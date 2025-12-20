import crypto from 'crypto';
import supabaseService from '../services/supabase.service.js';

export const razorpayWebhook = async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const signature = req.headers['x-razorpay-signature'];
  const body = req.body;

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex');

  if (expectedSignature !== signature) {
    return res.status(400).json({ success: false });
  }

  const event = JSON.parse(body.toString());

  // 🎯 We only care about successful payments
  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity;

    const razorpayOrderId = payment.order_id;
    const razorpayPaymentId = payment.id;

    // 1️⃣ Update payment table
    await supabaseService.markPaymentWebhookSuccess(
      razorpayOrderId,
      razorpayPaymentId,
      payment
    );

    // 2️⃣ Mark order as paid
    await supabaseService.markOrderPaidByRazorpayOrder(
      razorpayOrderId
    );
  }

  return res.json({ received: true });
};
