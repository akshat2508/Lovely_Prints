import crypto from 'crypto';
import paymentService from '../services/payment.service.js';
import supabaseService from '../services/supabase.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createPaymentOrder = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { orderId } = req.body;

    const { data: order, error } =
      await supabaseService.getOrderForPayment(orderId);

    if (error || !order) {
      return errorResponse(res, 'Order not found', 404);
    }

    if (order.student_id !== studentId) {
      return errorResponse(res, 'Unauthorized', 403);
    }

    if (order.is_paid) {
      return errorResponse(res, 'Order already paid', 400);
    }

    if (order.total_price <= 0) {
      return errorResponse(res, 'Invalid order amount', 400);
    }

    const razorpayOrder = await paymentService.createOrder(
      order.total_price,
      orderId
    );

    await supabaseService.createPayment({
      order_id: orderId,
      student_id: studentId,
      amount: order.total_price,
      razorpay_order_id: razorpayOrder.id,
      status: 'created',
    });

    return successResponse(res, razorpayOrder, 'Payment order created');
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Payment initialization failed', 500);
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    /* 1️⃣ Idempotency check */
    const { data: existingPayment } =
      await supabaseService.getPaymentByRazorpayOrder(
        razorpay_order_id
      );

    if (existingPayment?.status === 'success') {
      return successResponse(res, null, 'Payment already verified');
    }

    /* 2️⃣ Signature verification */
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return errorResponse(res, 'Payment verification failed', 400);
    }

    /* 3️⃣ Mark payment success */
    await supabaseService.markPaymentSuccess(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    /* 4️⃣ Mark order paid */
    await supabaseService.markOrderPaid(orderId);

    return successResponse(res, null, 'Payment successful');
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Payment verification error', 500);
  }
};
