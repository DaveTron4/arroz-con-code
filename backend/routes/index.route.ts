import { Router } from 'express';

// Import route modules
import authRoutes from './auth.route.ts';
import postsRoutes from './posts.route.ts';
import commentsRoutes from './comments.route.ts';
import likesRoutes from './likes.route.ts';
import factCheckRoutes from './factcheck.route.ts';
import translationRoutes from './translation.route.ts';

const router = Router();

// Auth routes (public: login, register)
router.use('/auth', authRoutes);

// Posts routes (public read, protected write)
router.use('/posts', postsRoutes);

// Comments routes (nested under posts)
router.use('/posts/:postId/comments', commentsRoutes);

// Likes routes
router.use('/', likesRoutes);

// Fact-check routes
router.use('/fact-checks', factCheckRoutes);

// Translation routes
router.use('/translations', translationRoutes);

export default router;