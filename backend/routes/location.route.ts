import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.ts';
import locationController from '../controllers/location.controller.ts';

const router = Router();

// Search nearby locations (PUBLIC - works better with coords)
router.get('/search', locationController.searchLocations);

// AI-powered natural language location search (PUBLIC)
router.post('/ai-search', locationController.aiSearch);

// Get user's search history (PROTECTED)
router.get('/history', authenticateToken, locationController.getSearchHistory);

export default router;
