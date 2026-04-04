import { Router } from 'express';

// Import route modules
import authRoutes from './auth.route.js';
import postsRoutes from './posts.route.js';

const router = Router();

// Auth routes (public: login, register)
router.use('/auth', authRoutes);

// Posts routes (public read, protected write)
router.use('/posts', postsRoutes);

export default router;