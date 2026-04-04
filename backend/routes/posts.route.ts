import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Example: Get all posts (PUBLIC - no auth required)
router.get('/', async (req, res) => {
  try {
    // TODO: Implement get all posts logic
    res.json({ message: 'Get all posts' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Example: Create a post (PROTECTED - auth required)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, body, category } = req.body;
    const userId = req.user?.id;

    if (!title || !body || !category) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // TODO: Implement create post logic with userId
    res.status(201).json({ message: 'Post created', userId });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Example: Update a post (PROTECTED & AUTHORIZED - must be owner)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user?.id;
    const { title, body, category } = req.body;

    // TODO: Check if post exists and user owns it
    // if (postOwnerId !== userId) {
    //   return res.status(403).json({ error: 'Unauthorized' });
    // }

    // TODO: Implement update logic
    res.json({ message: 'Post updated' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Example: Delete a post (PROTECTED & AUTHORIZED - must be owner)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user?.id;

    // TODO: Check if post exists and user owns it
    // if (postOwnerId !== userId) {
    //   return res.status(403).json({ error: 'Unauthorized' });
    // }

    // TODO: Implement soft delete logic
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
