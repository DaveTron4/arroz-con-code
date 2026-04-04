import { Router } from 'express';
import authController from '../controllers/auth.controller.js';

const router = Router();

// Routes for authentication

// Login route
router.post('/login', authController.loginUser);

// Register route
router.post('/register', authController.registerUser);

export default router;