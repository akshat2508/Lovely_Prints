// routes/student.routes.js
import express from 'express';
import { getProfile, updateProfile, getOrders } from '../controllers/student.controller.js';

const router = express.Router();

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/orders', getOrders);

export default router;