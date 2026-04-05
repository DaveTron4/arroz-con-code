import type { Request, Response } from 'express';
import { pool } from '../config/database.ts';

// POST /api/posts/:postId/like
// Protected - toggles like on a post
const togglePostLike = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const userId = req.user!.id;

        const post = await pool.query(
            'SELECT id FROM posts WHERE id = $1 AND deleted_at IS NULL',
            [postId]
        );

        if (post.rows.length === 0) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        const existing = await pool.query(
            'SELECT id FROM likes WHERE user_id = $1 AND post_id = $2',
            [userId, postId]
        );

        if (existing.rows.length > 0) {
            await pool.query('DELETE FROM likes WHERE user_id = $1 AND post_id = $2', [userId, postId]);
            res.json({ liked: false });
        } else {
            await pool.query(
                'INSERT INTO likes (user_id, post_id) VALUES ($1, $2)',
                [userId, postId]
            );
            res.status(201).json({ liked: true });
        }
    } catch (err) {
        console.error('Error toggling post like:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// POST /api/posts/:postId/comments/:commentId/like
// Protected - toggles like on a comment
const toggleCommentLike = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const userId = req.user!.id;

        const comment = await pool.query(
            'SELECT id FROM comments WHERE id = $1 AND deleted_at IS NULL',
            [commentId]
        );

        if (comment.rows.length === 0) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }

        const existing = await pool.query(
            'SELECT id FROM likes WHERE user_id = $1 AND comment_id = $2',
            [userId, commentId]
        );

        if (existing.rows.length > 0) {
            await pool.query('DELETE FROM likes WHERE user_id = $1 AND comment_id = $2', [userId, commentId]);
            res.json({ liked: false });
        } else {
            await pool.query(
                'INSERT INTO likes (user_id, comment_id) VALUES ($1, $2)',
                [userId, commentId]
            );
            res.status(201).json({ liked: true });
        }
    } catch (err) {
        console.error('Error toggling comment like:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default {
    togglePostLike,
    toggleCommentLike,
};
