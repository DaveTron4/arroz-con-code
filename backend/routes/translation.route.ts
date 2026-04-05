import { Router } from 'express';
import translationController from '../controllers/translation.controller.ts';

const router = Router();

// POST /api/translations - Translate a post (PUBLIC)
router.post('/', translationController.translatePost);

// GET /api/translations/:postId - Get translation for a post (PUBLIC)
// Query param: ?language=es or ?language=en
router.get('/:postId', translationController.getTranslation);

export default router;
