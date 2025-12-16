import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  getProfile,
  updateProfile,
  getOrders,
  createOrder,
  addDocumentToOrder
} from '../controllers/student.controller.js';

const router = express.Router();

// profile
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

// orders
router.get('/orders', authMiddleware, getOrders);
router.post('/orders', authMiddleware, createOrder);
router.post(
  '/orders/:orderId/documents',
  authMiddleware,
  addDocumentToOrder
);

export default router;
