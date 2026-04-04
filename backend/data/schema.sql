-- ============================================
-- ARROZ CON CODE - DATABASE SCHEMA
-- ============================================

-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  avatar_url VARCHAR(255),
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
  category VARCHAR(50) NOT NULL, -- 'Education', 'Healthcare', 'New Tech'
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

-- Likes Table (for posts and comments)
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

-- Fact Check Results Table (Gemini fact-checking)
CREATE TABLE fact_checks (
  id SERIAL PRIMARY KEY,
  post_id INT NOT NULL UNIQUE REFERENCES posts(id) ON DELETE CASCADE,
  original_text TEXT NOT NULL,
  is_fact_checked BOOLEAN DEFAULT FALSE,
  fact_check_status VARCHAR(50), -- 'verified', 'misleading', 'false', 'unverifiable'
  fact_check_result TEXT, -- Gemini's detailed response
  confidence_score FLOAT, -- 0-1 confidence level
  checked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat Messages Table (for AI chat history)
CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(100), -- For grouping messages by session (even if not logged in)
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  language VARCHAR(10) DEFAULT 'en', -- 'en' or 'es'
  category VARCHAR(50), -- 'Education', 'Healthcare', 'New Tech'
  user_feedback VARCHAR(10), -- 'thumbs_up', 'thumbs_down', null for no feedback
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Curated Resources Table (for AI system prompt injection)
CREATE TABLE resources (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL, -- 'Education', 'Healthcare', 'New Tech'
  title VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  description TEXT,
  language VARCHAR(10) DEFAULT 'en', -- 'en' or 'es'
  priority INT DEFAULT 0, -- Higher number = higher priority in prompt
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES for Performance
-- ============================================

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

-- ============================================
-- VIEWS for Common Queries
-- ============================================

-- Posts with author info and like count
CREATE VIEW posts_with_stats AS
SELECT
  p.id,
  p.user_id,
  u.username,
  u.display_name,
  u.avatar_url,
  p.title,
  p.body,
  p.category,
  p.image_url,
  p.created_at,
  COUNT(DISTINCT l.id) as like_count,
  COUNT(DISTINCT c.id) as comment_count
FROM posts p
LEFT JOIN users u ON p.user_id = u.id
LEFT JOIN likes l ON p.id = l.post_id
LEFT JOIN comments c ON p.id = c.post_id AND c.deleted_at IS NULL
WHERE p.deleted_at IS NULL
GROUP BY p.id, u.id;

-- Comments with author info and like count
CREATE VIEW comments_with_stats AS
SELECT
  c.id,
  c.post_id,
  c.user_id,
  u.username,
  u.display_name,
  u.avatar_url,
  c.body,
  c.image_url,
  c.created_at,
  COUNT(DISTINCT l.id) as like_count,
  COUNT(DISTINCT r.id) as reply_count
FROM comments c
LEFT JOIN users u ON c.user_id = u.id
LEFT JOIN likes l ON c.id = l.comment_id
LEFT JOIN replies r ON c.id = r.comment_id AND r.deleted_at IS NULL
WHERE c.deleted_at IS NULL
GROUP BY c.id, u.id;
