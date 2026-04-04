import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.ts';
import postsController from '../controllers/posts.controller.ts';

const router = Router();

// Get all posts (PUBLIC - no auth required)
router.get('/', postsController.getAllPosts);

// Create a post (PROTECTED - auth required)
router.post('/', authenticateToken, (req, res) => {
  const { title, body, category } = req.body;
  if (!title || !body || !category) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  postsController.createPost(req, res);
});

// Update a post (PROTECTED & AUTHORIZED - must be owner)
router.put('/:id', authenticateToken, postsController.updatePost);

// Delete a post (PROTECTED & AUTHORIZED - must be owner)
router.delete('/:id', authenticateToken, postsController.deletePost);

export default router;
