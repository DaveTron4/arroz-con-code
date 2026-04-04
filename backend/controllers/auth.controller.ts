import type { Response, Request } from 'express';
import { pool } from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { LoginRequest, RegisterRequest, TokenPayload } from '../interfaces/auth.interfaces.js';

// Validation helpers
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateUsername = (username: string): string | null => {
  if (!username || username.length < 3) {
    return 'Username must be at least 3 characters long';
  }
  if (username.length > 50) {
    return 'Username must be less than 50 characters';
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return 'Username can only contain letters, numbers, underscores, and hyphens';
  }
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (password.length > 128) {
    return 'Password must be less than 128 characters';
  }
  return null;
};

/**
 * Login user with username and password
 * Returns JWT token and user info
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body as LoginRequest;

    // Validation
    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    // Fetch user from database
    const result = await pool.query(
      'SELECT id, username, password_hash, email, display_name, avatar_url FROM users WHERE username = $1 AND deleted_at IS NULL',
      [username.trim()]
    );
    const user = result.rows[0];

    if (!user) {
      // Don't reveal if username exists for security
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // Compare password with hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // Generate JWT token (7 days expiration)
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      } as TokenPayload,
      process.env.JWT_SECRET as string,
      {
        expiresIn: '7d',
      }
    );

    // Return token and user info
    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.display_name,
        avatarUrl: user.avatar_url,
      },
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'An error occurred during login' });
  }
};

/**
 * Register a new user
 * Returns success message and user info + token
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, email } = req.body as RegisterRequest;

    // Validation
    if (!username || !password || !email) {
      res.status(400).json({ error: 'Username, password, and email are required' });
      return;
    }

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // Validate username
    const usernameError = validateUsername(trimmedUsername);
    if (usernameError) {
      res.status(400).json({ error: usernameError });
      return;
    }

    // Validate email
    if (!validateEmail(trimmedEmail)) {
      res.status(400).json({ error: 'Please provide a valid email address' });
      return;
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      res.status(400).json({ error: passwordError });
      return;
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE (username = $1 OR email = $2) AND deleted_at IS NULL',
      [trimmedUsername, trimmedEmail]
    );
    if (existingUser.rows.length > 0) {
      res.status(409).json({ error: 'Username or email already exists' });
      return;
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert new user into database
    const newUserResult = await pool.query(
      'INSERT INTO users (username, password_hash, email, display_name) VALUES ($1, $2, $3, $4) RETURNING id, username, email, display_name',
      [trimmedUsername, passwordHash, trimmedEmail, trimmedUsername]
    );

    const newUser = newUserResult.rows[0];

    // Generate JWT token for immediate login after registration
    const token = jwt.sign(
      {
        id: newUser.id,
        username: newUser.username,
      } as TokenPayload,
      process.env.JWT_SECRET as string,
      {
        expiresIn: '7d',
      }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        displayName: newUser.display_name,
      },
    });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'An error occurred during registration' });
  }
};

/**
 * Get current user info from token
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const result = await pool.query(
      'SELECT id, username, email, display_name, avatar_url, created_at FROM users WHERE id = $1 AND deleted_at IS NULL',
      [userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = result.rows[0];
    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.display_name,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    console.error('Error fetching current user:', err);
    res.status(500).json({ error: 'An error occurred while fetching user info' });
  }
};

/**
 * Update user info
 */
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { displayName, avatarUrl } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    // Validate inputs
    if (displayName && displayName.length > 100) {
      res.status(400).json({ error: 'Display name must be less than 100 characters' });
      return;
    }

    // Update user
    const result = await pool.query(
      'UPDATE users SET display_name = COALESCE($1, display_name), avatar_url = COALESCE($2, avatar_url), updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND deleted_at IS NULL RETURNING id, username, email, display_name, avatar_url',
      [displayName || null, avatarUrl || null, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = result.rows[0];
    res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.display_name,
        avatarUrl: user.avatar_url,
      },
    });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'An error occurred while updating user' });
  }
};

export default {
  loginUser,
  registerUser,
  getCurrentUser,
  updateUser,
};
