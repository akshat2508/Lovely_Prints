import crypto from 'crypto';
import paymentService from '../services/payment.service.js';
import supabaseService from '../services/supabase.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createPaymentOrder = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { orderId } = req.body;

    // 1️⃣ Fetch order WITHOUT RLS
    const { data: order, error } =
      await supabaseService.getOrderForPayment(orderId);

    if (error || !order) {
      return errorResponse(res, 'Order not found', 404);
    }

    // 2️⃣ Ownership check
    if (order.student_id !== studentId) {
      return errorResponse(res, 'Unauthorized', 403);
    }

    if (order.is_paid) {
      return errorResponse(res, 'Order already paid', 400);
    }

    if (order.total_price <= 0) {
      return errorResponse(res, 'Invalid order amount', 400);
    }

    // 3️⃣ Create Razorpay order
    const razorpayOrder = await paymentService.createOrder(
      order.total_price,
      orderId
    );

    // 4️⃣ Save payment
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
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
  } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return errorResponse(res, 'Payment verification failed', 400);
  }

  // 1️⃣ Update payment
 // 1️⃣ Update payment record
await supabaseService.markPaymentSuccess(
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
);

// 2️⃣ Mark order paid
await supabaseService.markOrderPaid(orderId);

return successResponse(res, null, 'Payment successful');

};
