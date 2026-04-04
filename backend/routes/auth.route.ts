import { Router } from 'express';
import * as authController from '../controllers/auth.controller.ts';
import { authenticateToken } from '../middleware/auth.middleware.ts';

const router = Router();

// Public routes
router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser);

// Protected routes
router.get('/me', authenticateToken, authController.getCurrentUser);
router.put('/me', authenticateToken, authController.updateUser);

export default router;