import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.ts';
import factCheckController from '../controllers/factcheck.controller.ts';

const router = Router();

// POST /api/fact-checks - Fact-check a post (can be public or protected)
router.post('/', factCheckController.factCheckPost);

// GET /api/fact-checks/:postId - Get fact-check result for a post (PUBLIC)
router.get('/:postId', factCheckController.getFactCheck);

// POST /api/fact-checks/:postId/trigger - Trigger fact-check for a post (PROTECTED - optional)
router.post('/:postId/trigger', authenticateToken, factCheckController.triggerFactCheck);

export default router;
