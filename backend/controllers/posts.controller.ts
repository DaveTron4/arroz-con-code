import type { Request, Response } from 'express';
import { pool } from '../config/database.js';

// GET /api/posts
// Public - supports ?category=Education&page=1&limit=10
const getAllPosts = async (req: Request, res: Response) => {
    try {
        const { category, page = '1', limit = '10' } = req.query;

        const pageNum = Math.max(1, parseInt(page as string));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
        const offset = (pageNum - 1) * limitNum;

        let query = 'SELECT * FROM posts_with_stats';
        const params: any[] = [];

        if (category) {
            params.push(category);
            query += ` WHERE category = $${params.length}`;
        }

        query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limitNum, offset);

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// POST /api/posts
// Protected - requires auth token
const createPost = async (req: Request, res: Response) => {
    try {
        const { title, body, category } = req.body;
        const userId = req.user!.id;

        const result = await pool.query(
            `INSERT INTO posts (user_id, title, body, category)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [userId, title, body, category]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// PUT /api/posts/:id
// Protected - must be post owner
const updatePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id;
        const userId = req.user!.id;
        const { title, body, category } = req.body;

        const existing = await pool.query(
            'SELECT user_id FROM posts WHERE id = $1 AND deleted_at IS NULL',
            [postId]
        );

        if (existing.rows.length === 0) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        if (existing.rows[0].user_id !== userId) {
            res.status(403).json({ error: 'Unauthorized' });
            return;
        }

        const result = await pool.query(
            `UPDATE posts
             SET title = COALESCE($1, title),
                 body = COALESCE($2, body),
                 category = COALESCE($3, category),
                 updated_at = NOW()
             WHERE id = $4
             RETURNING *`,
            [title, body, category, postId]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating post:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// DELETE /api/posts/:id
// Protected - must be post owner (soft delete)
const deletePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id;
        const userId = req.user!.id;

        const existing = await pool.query(
            'SELECT user_id FROM posts WHERE id = $1 AND deleted_at IS NULL',
            [postId]
        );

        if (existing.rows.length === 0) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        if (existing.rows[0].user_id !== userId) {
            res.status(403).json({ error: 'Unauthorized' });
            return;
        }

        await pool.query(
            'UPDATE posts SET deleted_at = NOW() WHERE id = $1',
            [postId]
        );

        res.json({ message: 'Post deleted' });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default {
    getAllPosts,
    createPost,
    updatePost,
    deletePost,
};
