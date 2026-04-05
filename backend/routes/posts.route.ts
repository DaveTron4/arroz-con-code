import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.ts';
import postsController from '../controllers/posts.controller.ts';

const router = Router();

// Get all posts (PUBLIC - no auth required)
router.get('/', postsController.getAllPosts);

// Get a single post by ID (PUBLIC)
router.get('/:id', postsController.getPostById);

// Create a post (PROTECTED - auth required)
router.post('/', authenticateToken, postsController.createPost);

// Update a post (PROTECTED & AUTHORIZED - must be owner)
router.put('/:id', authenticateToken, postsController.updatePost);

// Delete a post (PROTECTED & AUTHORIZED - must be owner)
router.delete('/:id', authenticateToken, postsController.deletePost);

export default router;
