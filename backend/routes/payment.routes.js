import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import requireRole from '../middleware/role.middleware.js';
import {
  createPaymentOrder,
  verifyPayment,
} from '../controllers/payment.controller.js';

const router = express.Router();

router.post(
  '/create-order',
  authMiddleware,
  requireRole('student'),
  createPaymentOrder
);

router.post(
  '/verify',
  authMiddleware,
  requireRole('student'),
  verifyPayment
);

export default router;
