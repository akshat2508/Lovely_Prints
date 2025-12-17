import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import requireRole from '../middleware/role.middleware.js';
import {
  getProfile,
  updateProfile,
  getOrders,
  createOrder,
  addDocumentToOrder,
} from '../controllers/student.controller.js';

const router = express.Router();

// profile
router.get(
  '/profile',
  authMiddleware,
  requireRole('student'),
  getProfile
);

router.put(
  '/profile',
  authMiddleware,
  requireRole('student'),
  updateProfile
);

// orders
router.get(
  '/orders',
  authMiddleware,
  requireRole('student'),
  getOrders
);

router.post(
  '/orders',
  authMiddleware,
  requireRole('student'),
  createOrder
);

router.post(
  '/orders/:orderId/documents',
  authMiddleware,
  requireRole('student'),
  addDocumentToOrder
);

export default router;
