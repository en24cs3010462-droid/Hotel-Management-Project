import { Router } from 'express';
import { createReview, getRoomReviews } from '../controllers/reviewController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, createReview);
router.get('/room/:roomId', getRoomReviews);

export default router;
