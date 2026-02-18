// controllers/order.controller.js
import supabaseService from "../services/supabase.service.js";
import { successResponse, errorResponse } from "../utils/response.js";
import {
  sendReadyForPickupEmail,
  sendOrderDeliveredEmail,
} from "../services/email.service.js";
import { sendPushToUser } from "../services/notification.service.js";

export const createOrder = async (req, res, next) => {
  try {
    const orderData = req.body;

    const { data, error } = await supabaseService.createOrder(orderData);

    if (error) {
      return errorResponse(res, error.message, 400);
    }

    return successResponse(res, data, "Order created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseService.getOrderById(id);

    if (error) {
      return errorResponse(res, error.message, 404);
    }

    return successResponse(res, data, "Order retrieved successfully");
  } catch (error) {
    next(error);
  }
};
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status === "completed") {
      return errorResponse(
        res,
        "OTP verification required to complete order",
        403,
      );
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return errorResponse(res, "Authorization token missing", 401);
    }

    // 🔍 Fetch current order (to prevent duplicate emails)
    const { data: existingOrder } = await supabaseService.getOrderById(
      id,
      token,
    );

    if (!existingOrder) {
      return errorResponse(res, "Order not found", 404);
    }

    const previousStatus = existingOrder.status;

    // 🔄 Update status
    const { data, error } = await supabaseService.updateOrderStatus(
      id,
      status,
      token,
    );

    if (error) {
      return errorResponse(res, error.message, 400);
    }

    // 📩 SEND READY EMAIL (ONLY ON TRANSITION)
  // 📩 SEND READY EMAIL + PUSH (ONLY ON TRANSITION)
if (status === "ready" && previousStatus !== "ready") {
  const { data: context } = await supabaseService.getOrderEmailContext(id);

  if (context) {
    try {
      await sendReadyForPickupEmail({
        email: context.student.email,
        name: context.student.name,
        orderNo: context.order_no,
        shopName: context.shop.shop_name,
      });
    } catch (emailError) {}

    try {
      await sendPushToUser({
        userId: existingOrder.student_id,
        title: "Order Ready for Pickup 🖨️",
        body: `Order #${context.order_no} is ready at ${context.shop.shop_name}`,
      });
    } catch (pushError) {}
  }
}


    return successResponse(res, data, "Order status updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseService.deleteOrder(id);

    if (error) {
      return errorResponse(res, error.message, 400);
    }

    return successResponse(res, data, "Order deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const verifyOrderOtp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;

    if (!otp) {
      return errorResponse(res, "OTP is required", 400);
    }

    // 🔍 Fetch OTP data
    const { data: order, error } = await supabaseService.getOrderOtpData(id);

    if (error || !order) {
      return errorResponse(res, "Order not found", 404);
    }

    if (order.otp_verified) {
      return errorResponse(res, "OTP already used", 400);
    }

    if (order.delivery_otp !== otp) {
      return errorResponse(res, "Invalid OTP", 400);
    }

    // ✅ Mark delivered
    const { data, error: updateError } =
      await supabaseService.markOrderDelivered(id);

    if (updateError) {
      return errorResponse(res, updateError.message, 400);
    }
    // after markOrderDelivered succeeds

    const { data: context } = await supabaseService.getOrderEmailContext(id);

    if (context) {
  try {
    await sendOrderDeliveredEmail({
      email: context.student.email,
      name: context.student.name,
      orderNo: context.order_no,
    });
  } catch (err) {}

  try {
    await sendPushToUser({
  userId: context.student.id,
  title: "Order Delivered ✅",
  body: `Order #${context.order_no} has been delivered successfully.`,
});

  } catch (pushError) {}
}


    return successResponse(res, data, "Order delivered successfully");
  } catch (err) {
    next(err);
  }
};
