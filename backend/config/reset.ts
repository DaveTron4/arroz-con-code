import dotenv from 'dotenv';
dotenv.config();

import { pool } from './database.ts';
import bcrypt from 'bcrypt';

const resetDatabase = async () => {
  const client = await pool.connect();

  try {
    console.log('🔄 Resetting database...');

    // Drop existing tables in reverse order of dependencies
    await client.query('DROP TABLE IF EXISTS location_searches CASCADE;');
    await client.query('DROP TABLE IF EXISTS translations CASCADE;');
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

    // Create tables (in sync with schema.sql)
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        display_name VARCHAR(100),
        avatar_url VARCHAR(255),
        role VARCHAR(20) DEFAULT 'regular' NOT NULL,
        latitude FLOAT,
        longitude FLOAT,
        location_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );

      CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        type VARCHAR(20) DEFAULT 'post' NOT NULL,
        image_url VARCHAR(255),
        latitude FLOAT,
        longitude FLOAT,
        location_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );

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

      CREATE TABLE translations (
        id SERIAL PRIMARY KEY,
        post_id INT NOT NULL UNIQUE REFERENCES posts(id) ON DELETE CASCADE,
        original_language VARCHAR(10) NOT NULL,
        original_text TEXT NOT NULL,
        translated_language VARCHAR(10) NOT NULL,
        translated_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE location_searches (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        query TEXT NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL,
        results JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes
    await client.query(`
      CREATE INDEX idx_posts_user_id ON posts(user_id);
      CREATE INDEX idx_posts_category ON posts(category);
      CREATE INDEX idx_posts_type ON posts(type);
      CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
      CREATE INDEX idx_posts_latitude_longitude ON posts(latitude, longitude);
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
      CREATE INDEX idx_users_role ON users(role);
      CREATE INDEX idx_users_latitude_longitude ON users(latitude, longitude);
      CREATE INDEX idx_translations_post_id ON translations(post_id);
      CREATE INDEX idx_location_searches_user_id ON location_searches(user_id);
      CREATE INDEX idx_location_searches_location ON location_searches(latitude, longitude);
    `);

    // Create views
    await client.query(`
      CREATE VIEW posts_with_stats AS
      SELECT
        p.id, p.user_id, u.username, u.display_name, u.avatar_url, u.role,
        p.title, p.body, p.category, p.type, p.image_url,
        p.latitude, p.longitude, p.location_name, p.created_at,
        COUNT(DISTINCT l.id) as like_count,
        COUNT(DISTINCT c.id) as comment_count
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      LEFT JOIN comments c ON p.id = c.post_id AND c.deleted_at IS NULL
      WHERE p.deleted_at IS NULL
      GROUP BY p.id, u.id;

      CREATE VIEW comments_with_stats AS
      SELECT
        c.id, c.post_id, c.user_id, u.username, u.display_name, u.avatar_url,
        c.body, c.image_url, c.created_at,
        COUNT(DISTINCT l.id) as like_count,
        COUNT(DISTINCT r.id) as reply_count
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN likes l ON c.id = l.comment_id
      LEFT JOIN replies r ON c.id = r.comment_id AND r.deleted_at IS NULL
      WHERE c.deleted_at IS NULL
      GROUP BY c.id, u.id;
    `);

    console.log('✅ Created all tables, indexes, and views');

    // Hash demo password at runtime so logins actually work
    const demoPassword = await bcrypt.hash('demo1234', 10);

    // Seed Users
    const usersResult = await client.query(`
      INSERT INTO users (email, username, password_hash, display_name, avatar_url, role)
      VALUES
        ('maria@example.com',  'maria_garcia',   $1, 'María García',   'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',   'professional'),
        ('carlos@example.com', 'carlos_lopez',   $1, 'Carlos López',   'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',  'regular'),
        ('lucia@example.com',  'lucia_martinez', $1, 'Lucía Martínez', 'https://api.dicebear.com/7.x/avataaars/svg?seed=lucia',   'professional'),
        ('juan@example.com',   'juan_ruiz',      $1, 'Juan Ruiz',      'https://api.dicebear.com/7.x/avataaars/svg?seed=juan',    'regular'),
        ('sofia@example.com',  'sofia_torres',   $1, 'Sofía Torres',   'https://api.dicebear.com/7.x/avataaars/svg?seed=sofia',   'professional')
      RETURNING id;
    `, [demoPassword]);

    const userIds = usersResult.rows.map((r: { id: number }) => r.id);
    console.log('✅ Seeded 5 users (password: demo1234)');

    // Seed Posts — Education
    const educationPosts = await client.query(`
      INSERT INTO posts (user_id, title, body, category, type)
      VALUES
        ($1, 'How to prepare for college entrance exams?',
             'I am a junior in high school and I want to prepare for my college entrance exams. What are the best resources available?',
             'Education', 'post'),
        ($2, '¿Becas disponibles para estudiantes hispanos?',
             'Estoy buscando información sobre becas para estudiantes latinos en Estados Unidos. ¿Alguien tiene experiencia?',
             'Education', 'post'),
        ($3, 'College Prep Guide: A Professional''s Roadmap',
             'A comprehensive guide to preparing for college entrance exams, written by an education professional with 10+ years of experience.',
             'Education', 'article')
      RETURNING id;
    `, [userIds[0], userIds[1], userIds[2]]);

    // Seed Posts — Healthcare
    const healthcarePosts = await client.query(`
      INSERT INTO posts (user_id, title, body, category, type)
      VALUES
        ($1, 'How to find affordable healthcare in my city?',
             'I don''t have health insurance and need medical attention. What are my options?',
             'Healthcare', 'post'),
        ($2, 'Síntomas comunes del COVID-19',
             'Mi familia tiene síntomas. ¿Cuáles son los signos de COVID y cuándo debo buscar ayuda médica?',
             'Healthcare', 'post'),
        ($3, 'Healthcare Access in Hispanic Communities',
             'Written by a healthcare professional, this article explores resources and options for obtaining affordable healthcare for underinsured Hispanic families.',
             'Healthcare', 'article')
      RETURNING id;
    `, [userIds[3], userIds[4], userIds[0]]);

    // Seed Posts — New Tech
    const techPosts = await client.query(`
      INSERT INTO posts (user_id, title, body, category, type)
      VALUES
        ($1, 'Getting started with coding - where to begin?',
             'I want to learn programming but don''t know where to start. What programming language should I learn first?',
             'New Tech', 'post'),
        ($2, 'Recursos gratis para aprender programación',
             'He visto mucha demanda de programadores. ¿Hay cursos en línea en español que sean gratuitos?',
             'New Tech', 'post'),
        ($3, 'Career Pathways in AI: A Professional Guide',
             'An in-depth article by a tech professional covering the skills, resources, and career trajectories in artificial intelligence.',
             'New Tech', 'article')
      RETURNING id;
    `, [userIds[1], userIds[2], userIds[4]]);

    console.log('✅ Seeded 9 posts (6 posts, 3 articles)');

    // Seed Comments
    const allPostIds = [
      ...educationPosts.rows.map((r: { id: number }) => r.id),
      ...healthcarePosts.rows.map((r: { id: number }) => r.id),
      ...techPosts.rows.map((r: { id: number }) => r.id),
    ];

    await client.query(`
      INSERT INTO comments (post_id, user_id, body)
      VALUES
        ($1,  $10, 'Great question! I recommend starting with Khan Academy and then moving to more advanced courses.'),
        ($2,  $11, 'Las becas de Google y Microsoft son muy buenas para estudiantes latinos. Revisa sus sitios web.'),
        ($3,  $12, 'This guide is amazing! Very helpful for first-generation college students.'),
        ($4,  $13, 'Check your local health department website. Many cities have free or low-cost clinics.'),
        ($5,  $14, 'Consulta con tu médico inmediatamente si tienes fiebre alta o dificultad para respirar.'),
        ($6,  $15, 'Thank you for writing this. It really helps our community understand their options.'),
        ($7,  $16, 'Start with Python! It''s beginner-friendly and very in-demand.'),
        ($8,  $17, 'freeCodeCamp tiene cursos gratuitos y en español. ¡Los recomiendo mucho!'),
        ($9,  $18, 'Great breakdown of AI career paths. Very informative for anyone looking to get into tech.')
      RETURNING id;
    `, [
      allPostIds[0], allPostIds[1], allPostIds[2],
      allPostIds[3], allPostIds[4], allPostIds[5],
      allPostIds[6], allPostIds[7], allPostIds[8],
      userIds[1], userIds[3], userIds[4],
      userIds[0], userIds[2], userIds[1],
      userIds[3], userIds[0], userIds[2],
    ]);

    console.log('✅ Seeded comments');

    // Seed Fact-Checks
    await client.query(`
      INSERT INTO fact_checks (post_id, original_text, is_fact_checked, fact_check_status, fact_check_result, confidence_score, checked_at)
      VALUES
        ($1,  'How to prepare for college entrance exams?', true, 'verified', 'College entrance exam preparation through established resources like Khan Academy is a verified effective approach recommended by education professionals.', 0.92, NOW()),
        ($2,  '¿Becas disponibles para estudiantes hispanos?', true, 'verified', 'Google y Microsoft ofrecen becas específicas para estudiantes latinos. Esta información es verificable a través de sus sitios web oficiales.', 0.88, NOW()),
        ($3,  'College Prep Guide: A Professional''s Roadmap', true, 'verified', 'Comprehensive college preparation guides from education professionals are reliable and evidence-based resources.', 0.90, NOW()),
        ($4,  'How to find affordable healthcare in my city?', true, 'verified', 'Local health departments and community clinics provide free or low-cost healthcare. This is factually accurate.', 0.85, NOW()),
        ($5,  'Síntomas comunes del COVID-19', true, 'verified', 'Los síntomas descritos del COVID-19 como fiebre alta y dificultad respiratoria son síntomas confirmados. La recomendación de buscar ayuda médica es apropiada.', 0.89, NOW()),
        ($6,  'Healthcare Access in Hispanic Communities', true, 'verified', 'The challenges of healthcare access in Hispanic communities are well-documented and this article addresses real issues.', 0.87, NOW()),
        ($7,  'Getting started with coding - where to begin?', true, 'verified', 'Python is widely recognized as beginner-friendly and in-demand in the job market. This recommendation is accurate.', 0.91, NOW()),
        ($8,  'Recursos gratis para aprender programación', true, 'verified', 'freeCodeCamp ofrece cursos gratuitos en español. Esta información es verificable y exacta.', 0.93, NOW()),
        ($9,  'Career Pathways in AI: A Professional Guide', true, 'verified', 'Career trajectories in AI and the importance of skills development are accurately portrayed in professional resources.', 0.86, NOW())
      RETURNING id;
    `, [
      allPostIds[0], allPostIds[1], allPostIds[2],
      allPostIds[3], allPostIds[4], allPostIds[5],
      allPostIds[6], allPostIds[7], allPostIds[8]
    ]);

    console.log('✅ Seeded fact-checks');

    // Seed Resources
    await client.query(`
      INSERT INTO resources (category, title, url, description, language, priority)
      VALUES
        ('Education', 'Khan Academy',            'https://www.khanacademy.org',          'Free educational videos covering math, science, and more', 'en', 10),
        ('Education', 'Khan Academy en Español', 'https://es.khanacademy.org',           'Videos educativos gratuitos en español',                   'es', 10),
        ('Education', 'Coursera',                'https://www.coursera.org',             'Online courses from top universities',                     'en',  9),
        ('Healthcare', 'CDC Health Info',        'https://www.cdc.gov',                  'Official health information and guidance',                 'en', 10),
        ('Healthcare', 'Salud en Español',       'https://salud.nih.gov',                'Health information in Spanish from NIH',                   'es', 10),
        ('Healthcare', 'Planned Parenthood',     'https://www.plannedparenthood.org',    'Reproductive health information and services',             'en',  8),
        ('New Tech',   'freeCodeCamp',           'https://www.freecodecamp.org',         'Free coding bootcamp and tutorials',                      'en', 10),
        ('New Tech',   'Codecademy',             'https://www.codecademy.com',           'Interactive coding courses',                              'en',  9),
        ('New Tech',   'Google Colab',           'https://colab.research.google.com',    'Free Jupyter notebooks for machine learning',             'en',  9)
    `);

    console.log('✅ Seeded resources');
    console.log('');
    console.log('🎉 Database reset complete!');
    console.log('📝 Demo login: username = maria_garcia | password = demo1234');
    process.exit(0);
  } catch (error) {
    console.error('💥 Error resetting database:', error);
    process.exit(1);
  } finally {
    client.release();
  }
};

resetDatabase();
