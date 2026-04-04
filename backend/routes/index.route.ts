import { Router } from 'express';

// Import route modules
import authRoutes from './auth.route.ts';
import postsRoutes from './posts.route.ts';

const router = Router();

// Auth routes (public: login, register)
router.use('/auth', authRoutes);

// Posts routes (public read, protected write)
router.use('/posts', postsRoutes);

export default router;