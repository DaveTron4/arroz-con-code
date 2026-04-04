// dotenv is already loaded in database.ts before importing pool
import { pool } from './database.ts';

const resetDatabase = async () => {
  const client = await pool.connect();

  try {
    console.log('🔄 Resetting database...');

    // Drop existing tables in reverse order of dependencies
    await client.query('DROP TABLE IF EXISTS resources CASCADE;');
    await client.query('DROP TABLE IF EXISTS chat_messages CASCADE;');
    await client.query('DROP TABLE IF EXISTS fact_checks CASCADE;');
    await client.query('DROP TABLE IF EXISTS likes CASCADE;');
    await client.query('DROP TABLE IF EXISTS replies CASCADE;');
    await client.query('DROP TABLE IF EXISTS comments CASCADE;');
    await client.query('DROP TABLE IF EXISTS posts CASCADE;');
    await client.query('DROP TABLE IF EXISTS users CASCADE;');
    await client.query('DROP VIEW IF EXISTS posts_with_stats CASCADE;');
    await client.query('DROP VIEW IF EXISTS comments_with_stats CASCADE;');

    console.log('✅ Dropped existing tables');

    // Create tables
    await client.query(`
      -- Users Table
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        display_name VARCHAR(100),
        avatar_url VARCHAR(255),
        role VARCHAR(20) DEFAULT 'regular' NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );

      -- Posts Table (Community Board)
      CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        type VARCHAR(20) DEFAULT 'post' NOT NULL,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );

      -- Comments Table
      CREATE TABLE comments (
        id SERIAL PRIMARY KEY,
        post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        body TEXT NOT NULL,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );

      -- Nested Replies (comments on comments)
      CREATE TABLE replies (
        id SERIAL PRIMARY KEY,
        comment_id INT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        body TEXT NOT NULL,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );

      -- Likes Table
      CREATE TABLE likes (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        post_id INT REFERENCES posts(id) ON DELETE CASCADE,
        comment_id INT REFERENCES comments(id) ON DELETE CASCADE,
        reply_id INT REFERENCES replies(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, post_id, comment_id, reply_id),
        CHECK (
          (post_id IS NOT NULL AND comment_id IS NULL AND reply_id IS NULL) OR
          (post_id IS NULL AND comment_id IS NOT NULL AND reply_id IS NULL) OR
          (post_id IS NULL AND comment_id IS NULL AND reply_id IS NOT NULL)
        )
      );

      -- Fact Check Results Table
      CREATE TABLE fact_checks (
        id SERIAL PRIMARY KEY,
        post_id INT NOT NULL UNIQUE REFERENCES posts(id) ON DELETE CASCADE,
        original_text TEXT NOT NULL,
        is_fact_checked BOOLEAN DEFAULT FALSE,
        fact_check_status VARCHAR(50),
        fact_check_result TEXT,
        confidence_score FLOAT,
        checked_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Chat Messages Table
      CREATE TABLE chat_messages (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        session_id VARCHAR(100),
        user_message TEXT NOT NULL,
        ai_response TEXT NOT NULL,
        language VARCHAR(10) DEFAULT 'en',
        category VARCHAR(50),
        user_feedback VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Resources Table
      CREATE TABLE resources (
        id SERIAL PRIMARY KEY,
        category VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        description TEXT,
        language VARCHAR(10) DEFAULT 'en',
        priority INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Indexes
      CREATE INDEX idx_posts_user_id ON posts(user_id);
      CREATE INDEX idx_posts_category ON posts(category);
      CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
      CREATE INDEX idx_comments_post_id ON comments(post_id);
      CREATE INDEX idx_comments_user_id ON comments(user_id);
      CREATE INDEX idx_replies_comment_id ON replies(comment_id);
      CREATE INDEX idx_likes_user_id ON likes(user_id);
      CREATE INDEX idx_likes_post_id ON likes(post_id);
      CREATE INDEX idx_likes_comment_id ON likes(comment_id);
      CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
      CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
      CREATE INDEX idx_resources_category ON resources(category);
      CREATE INDEX idx_users_email ON users(email);
    `);

    console.log('✅ Created all tables');

    // Seed Users
    const usersResult = await client.query(`
      INSERT INTO users (email, username, password_hash, display_name, avatar_url, role)
      VALUES
        ('maria@example.com', 'maria_garcia', '$2b$10$Y9IfzgYZUVZ8', 'María García', 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria', 'professional'),
        ('carlos@example.com', 'carlos_lopez', '$2b$10$Y9IfzgYZUVZ8', 'Carlos López', 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos', 'regular'),
        ('lucia@example.com', 'lucia_martinez', '$2b$10$Y9IfzgYZUVZ8', 'Lucía Martínez', 'https://api.dicebear.com/7.x/avataaars/svg?seed=lucia', 'professional'),
        ('juan@example.com', 'juan_ruiz', '$2b$10$Y9IfzgYZUVZ8', 'Juan Ruiz', 'https://api.dicebear.com/7.x/avataaars/svg?seed=juan', 'regular'),
        ('sofia@example.com', 'sofia_torres', '$2b$10$Y9IfzgYZUVZ8', 'Sofía Torres', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sofia', 'professional')
      RETURNING id;
    `);

    const userIds = usersResult.rows.map((r) => r.id);
    console.log('✅ Seeded users (3 professionals, 2 regular)');

    // Seed Posts (Education) - mix of posts and articles
    const educationPosts = await client.query(`
      INSERT INTO posts (user_id, title, body, category, type)
      VALUES
        ($1, 'How to prepare for college entrance exams?', 'I am a junior in high school and I want to prepare for my college entrance exams. What are the best resources available?', 'Education', 'post'),
        ($2, '¿Becas disponibles para estudiantes hispanos?', 'Estoy buscando información sobre becas para estudiantes latinos en Estados Unidos. ¿Alguien tiene experiencia?', 'Education', 'post'),
        ($3, 'College Prep Guide: A Professional''s Roadmap', 'A comprehensive guide to preparing for college entrance exams, written by an education professional with 10+ years of experience.', 'Education', 'article')
      RETURNING id;
    `, [userIds[0], userIds[1], userIds[2]]);

    // Seed Posts (Healthcare) - mix of posts and articles
    const healthcarePosts = await client.query(`
      INSERT INTO posts (user_id, title, body, category, type)
      VALUES
        ($1, 'How to find affordable healthcare in my city?', 'I don''t have health insurance and need medical attention. What are my options?', 'Healthcare', 'post'),
        ($2, 'Síntomas comunes del COVID-19', 'Mi familia tiene síntomas. ¿Cuáles son los signos de COVID y cuándo debo buscar ayuda médica?', 'Healthcare', 'post'),
        ($3, 'Healthcare Access in Hispanic Communities', 'Written by a healthcare professional, this article explores resources and options for obtaining affordable healthcare for underinsured Hispanic families.', 'Healthcare', 'article')
      RETURNING id;
    `, [userIds[3], userIds[4], userIds[0]]);

    // Seed Posts (New Tech) - mix of posts and articles
    const techPosts = await client.query(`
      INSERT INTO posts (user_id, title, body, category, type)
      VALUES
        ($1, 'Getting started with coding - where to begin?', 'I want to learn programming but don''t know where to start. What programming language should I learn first?', 'New Tech', 'post'),
        ($2, 'Recursos gratis para aprender programación', 'He visto mucha demanda de programadores. ¿Hay cursos en línea en español que sean gratuitos?', 'New Tech', 'post'),
        ($3, 'Career Pathways in AI: A Professional Guide', 'An in-depth article by a tech professional covering the skills, resources, and career trajectories in artificial intelligence and machine learning.', 'New Tech', 'article')
      RETURNING id;
    `, [userIds[1], userIds[2], userIds[4]]);

    console.log('✅ Seeded posts (6 posts, 3 articles)');

    // Seed Comments
    const allPostIds = [
      ...educationPosts.rows.map((r) => r.id),
      ...healthcarePosts.rows.map((r) => r.id),
      ...techPosts.rows.map((r) => r.id),
    ];

    await client.query(`
      INSERT INTO comments (post_id, user_id, body)
      VALUES
        ($1, $2, 'Great question! I recommend starting with Khan Academy and then moving to more advanced courses.'),
        ($3, $4, 'Las becas de Google y Microsoft son muy buenas para estudiantes latinos. Revisa sus sitios web.'),
        ($5, $6, 'I used Duolingo and Babbel. Both are really helpful! Practice speaking with native speakers too.'),
        ($7, $8, 'Check your local health department website. Many cities have free or low-cost clinics.'),
        ($9, $10, 'Consulta con tu médico inmediatamente si tienes fiebre alta o dificultad para respirar.'),
        ($11, $12, 'Organizations like NAMI offer free support groups. You are not alone!')
      RETURNING id;
    `, [
      allPostIds[0], userIds[1], allPostIds[1], userIds[3], allPostIds[2], userIds[4],
      allPostIds[3], userIds[0], allPostIds[4], userIds[2], allPostIds[5], userIds[1],
    ]);

    console.log('✅ Seeded comments');

    // Seed Resources
    await client.query(`
      INSERT INTO resources (category, title, url, description, language, priority)
      VALUES
        ('Education', 'Khan Academy', 'https://www.khanacademy.org', 'Free educational videos covering math, science, and more', 'en', 10),
        ('Education', 'Khan Academy en Español', 'https://es.khanacademy.org', 'Videos educativos gratuitos en español', 'es', 10),
        ('Education', 'Coursera', 'https://www.coursera.org', 'Online courses from top universities', 'en', 9),
        ('Healthcare', 'CDC COVID-19 Info', 'https://www.cdc.gov/coronavirus/', 'Official COVID-19 information and guidance', 'en', 10),
        ('Healthcare', 'Salud en Español', 'https://salud.nih.gov', 'Health information in Spanish from NIH', 'es', 10),
        ('Healthcare', 'Planned Parenthood', 'https://www.plannedparenthood.org', 'Reproductive health information and services', 'en', 8),
        ('New Tech', 'freeCodeCamp', 'https://www.freecodecamp.org', 'Free coding bootcamp and tutorials', 'en', 10),
        ('New Tech', 'Codecademy', 'https://www.codecademy.com', 'Interactive coding courses', 'en', 9),
        ('New Tech', 'Google Colab', 'https://colab.research.google.com', 'Free Jupyter notebooks for machine learning', 'en', 9)
      RETURNING id;
    `);

    console.log('✅ Seeded resources');

    console.log('🎉 Database reset and seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Error resetting database:', error);
    process.exit(1);
  } finally {
    client.release();
  }
};

resetDatabase();
