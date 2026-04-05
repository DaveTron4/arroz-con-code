import type { Request, Response } from 'express';
import { pool } from '../config/database.ts';
import type { CreatePostRequest } from '../interfaces/posts.interfaces.ts';

// GET /api/posts
// Public - supports ?category=Education&latitude=X&longitude=Y&radius=5&page=1&limit=10
const getAllPosts = async (req: Request, res: Response) => {
    try {
        const { category, userId, latitude, longitude, radius, page = '1', limit = '10' } = req.query;

        const pageNum = Math.max(1, parseInt(page as string));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
        const offset = (pageNum - 1) * limitNum;

        const params: any[] = [];
        const conditions: string[] = [];

        if (category) {
            params.push(category);
            conditions.push(`category = $${params.length}`);
        }

        if (userId) {
            params.push(parseInt(userId as string));
            conditions.push(`user_id = $${params.length}`);
        }

        // Radius filter using Haversine formula (radius in km, default 10km)
        if (latitude && longitude) {
            const lat = parseFloat(latitude as string);
            const lng = parseFloat(longitude as string);
            const rad = parseFloat((radius as string) || '10');

            params.push(lat, lng, rad);
            conditions.push(`
                (latitude IS NOT NULL AND longitude IS NOT NULL AND
                6371 * acos(
                    cos(radians($${params.length - 2})) *
                    cos(radians(latitude)) *
                    cos(radians(longitude) - radians($${params.length - 1})) +
                    sin(radians($${params.length - 2})) *
                    sin(radians(latitude))
                ) <= $${params.length})
            `);
        }

        let query = 'SELECT * FROM posts_with_stats';
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
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
        const { title, body, category, type, imageUrl, latitude, longitude, locationName } = req.body as CreatePostRequest;
        const userId = req.user!.id;
        const userRole = req.user!.role;

        // Only professional users can create articles
        const postType = type === 'article' && userRole === 'professional' ? 'article' : 'post';

        const result = await pool.query(
            `INSERT INTO posts (user_id, title, body, category, type, image_url, latitude, longitude, location_name)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [userId, title, body, category, postType, imageUrl ?? null, latitude ?? null, longitude ?? null, locationName ?? null]
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
        const { title, body, category, latitude, longitude, locationName } = req.body;

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
                 latitude = COALESCE($5, latitude),
                 longitude = COALESCE($6, longitude),
                 location_name = COALESCE($7, location_name),
                 updated_at = NOW()
             WHERE id = $4
             RETURNING *`,
            [title, body, category, postId, latitude, longitude, locationName]
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
