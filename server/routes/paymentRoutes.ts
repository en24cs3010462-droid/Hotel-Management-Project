import { Router } from 'express';
import {
  createOrder,
  verifyPayment,
  getPaymentByBooking
} from '../controllers/paymentController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/create-order', requireAuth, createOrder);
router.post('/verify', requireAuth, verifyPayment);
router.get('/:bookingId', requireAuth, getPaymentByBooking);

export default router;
