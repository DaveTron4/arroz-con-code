import type { Request, Response } from 'express';
import { pool } from '../config/database.ts';

// GET /api/posts/:postId/comments
// Public
const getComments = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;

        const post = await pool.query(
            'SELECT id FROM posts WHERE id = $1 AND deleted_at IS NULL',
            [postId]
        );

        if (post.rows.length === 0) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        const result = await pool.query(
            'SELECT * FROM comments_with_stats WHERE post_id = $1 ORDER BY like_count DESC, created_at ASC',
            [postId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching comments:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// POST /api/posts/:postId/comments
// Protected
const createComment = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const { body, imageUrl } = req.body;
        const userId = req.user!.id;

        const post = await pool.query(
            'SELECT id FROM posts WHERE id = $1 AND deleted_at IS NULL',
            [postId]
        );

        if (post.rows.length === 0) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        const result = await pool.query(
            `INSERT INTO comments (post_id, user_id, body, image_url)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [postId, userId, body, imageUrl ?? null]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating comment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// PUT /api/posts/:postId/comments/:commentId
// Protected - must be comment owner
const updateComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const { body } = req.body;
        const userId = req.user!.id;

        const existing = await pool.query(
            'SELECT user_id FROM comments WHERE id = $1 AND deleted_at IS NULL',
            [commentId]
        );

        if (existing.rows.length === 0) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }

        if (existing.rows[0].user_id !== userId) {
            res.status(403).json({ error: 'Unauthorized' });
            return;
        }

        const result = await pool.query(
            `UPDATE comments
             SET body = COALESCE($1, body), updated_at = NOW()
             WHERE id = $2
             RETURNING *`,
            [body, commentId]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating comment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// DELETE /api/posts/:postId/comments/:commentId
// Protected - must be comment owner (soft delete)
const deleteComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const userId = req.user!.id;

        const existing = await pool.query(
            'SELECT user_id FROM comments WHERE id = $1 AND deleted_at IS NULL',
            [commentId]
        );

        if (existing.rows.length === 0) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }

        if (existing.rows[0].user_id !== userId) {
            res.status(403).json({ error: 'Unauthorized' });
            return;
        }

        await pool.query(
            'UPDATE comments SET deleted_at = NOW() WHERE id = $1',
            [commentId]
        );

        res.json({ message: 'Comment deleted' });
    } catch (err) {
        console.error('Error deleting comment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default {
    getComments,
    createComment,
    updateComment,
    deleteComment,
};
