import type { Response, Request } from 'express';
import { pool } from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Controllers for authentication (login, register, etc.) would go here

// Controller function to handle user login
const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
        return res.status(400).json({ error: 'Missing username or password in request body' });
    }

    // Fetch user from database
    const result = await pool.query('SELECT id, username, password_hash FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare password with hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
        { 
            id: user.id, 
            username: user.username
        },
        process.env.JWT_SECRET as string,
        { 
            expiresIn: '1h' 
        }
    );

    res.json({ token });

    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller function to handle user registration
const registerUser = async (req: Request, res: Response) => {
    try {
        const { username, password, email } = req.body || {};

        if (!username || !password || !email) {
            return res.status(400).json({ error: 'Missing username, password, or email in request body' });
        }

        // Check if user already exists
        const existingUser = await pool.query('SELECT id FROM users WHERE username = $1 OR email = $2', [username, email]);
        if (existingUser.rows.length > 0) {
        return res.status(409).json({ error: 'Username or email already exists' });
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert new user into database
        await pool.query(
        'INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3)',
        [username, passwordHash, email]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default {
    loginUser,
    registerUser,
};
