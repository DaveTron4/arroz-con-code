import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.ts';
import commentsController from '../controllers/comments.controller.ts';

const router = Router({ mergeParams: true }); // mergeParams gives access to :postId from parent route

// Get all comments for a post (PUBLIC)
router.get('/', commentsController.getComments);

// Create a comment (PROTECTED)
router.post('/', authenticateToken, (req, res) => {
    const { body } = req.body;
    if (!body) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    commentsController.createComment(req, res);
});

// Update a comment (PROTECTED - must be owner)
router.put('/:commentId', authenticateToken, commentsController.updateComment);

// Delete a comment (PROTECTED - must be owner)
router.delete('/:commentId', authenticateToken, commentsController.deleteComment);

export default router;
