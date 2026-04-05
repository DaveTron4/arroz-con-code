import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.ts';
import likesController from '../controllers/likes.controller.ts';

const router = Router({ mergeParams: true });

// Toggle like on a post (PROTECTED)
router.post('/posts/:postId/like', authenticateToken, likesController.togglePostLike);

// Toggle like on a comment (PROTECTED)
router.post('/posts/:postId/comments/:commentId/like', authenticateToken, likesController.toggleCommentLike);

export default router;
