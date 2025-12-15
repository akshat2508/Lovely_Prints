// routes/order.routes.js
import express from 'express';
import { createOrder, getOrderById, updateOrderStatus, deleteOrder } from '../controllers/order.controller.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

export default router;