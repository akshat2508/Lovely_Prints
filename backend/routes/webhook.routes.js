import express from 'express';
import { razorpayWebhook } from '../controllers/webhook.controller.js';

const router = express.Router();

// Razorpay requires RAW body
router.post(
  '/razorpay',
  express.raw({ type: 'application/json' }),
  razorpayWebhook
);

export default router;
