// controllers/student.controller.js
import supabaseService from '../services/supabase.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabaseService.getUserById(userId);

    if (error) {
      return errorResponse(res, error.message, 404);
    }

    return successResponse(res, data, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    const { data, error } = await supabaseService.updateUser(userId, updates);

    if (error) {
      return errorResponse(res, error.message, 400);
    }

    return successResponse(res, data, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;

const token = req.headers.authorization.split(' ')[1];

const { data, error } =
  await supabaseService.getOrdersByStudentId(userId, token);

    if (error) {
      return errorResponse(res, error.message, 404);
    }

    return successResponse(res, data, 'Orders retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return errorResponse(res, "Authorization token missing", 401);
    }

    const {
      shop_id,
      description,
      orientation,
      is_urgent,
      pickup_at,
      order_type,
    } = req.body;

    const type = order_type || "online";

    let normalizedPickup = null;

    // 🟢 ONLINE ORDER VALIDATION
    if (type === "online") {
      if (!pickup_at) {
        return errorResponse(
          res,
          "Pickup date & time is required",
          400
        );
      }

      const pickupTime = new Date(pickup_at);
      const now = new Date();

      if (isNaN(pickupTime.getTime())) {
        return errorResponse(res, "Invalid pickup date & time", 400);
      }

      if (pickupTime < now) {
        return errorResponse(
          res,
          "Pickup time cannot be in the past",
          400
        );
      }

      const maxAllowed = new Date(
        now.getTime() + 24 * 60 * 60 * 1000
      );

      if (pickupTime > maxAllowed) {
        return errorResponse(
          res,
          "Pickup time must be within 24 hours",
          400
        );
      }

      normalizedPickup = pickupTime.toISOString();
    }

    // 🟣 WALK-IN ORDER → NO PICKUP VALIDATION
    if (type === "walk_in") {
      normalizedPickup = null;
    }

    const orderData = {
      shop_id,
      order_type: type,
      notes: description || null,
      orientation: orientation || "portrait",
      is_urgent: type === "online" ? Boolean(is_urgent) : false,
      pickup_at: normalizedPickup,
    };

    const { data, error } =
      await supabaseService.createOrder(orderData, token);

    if (error) {
      return errorResponse(res, error.message, 400);
    }

    return successResponse(
      res,
      data,
      "Order created successfully",
      201
    );
  } catch (error) {
    next(error);
  }
};

export const addDocumentToOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const token = req.headers.authorization.split(' ')[1];

    const {
      fileKey,
      fileName,
      page_count,
      copies,
      paper_type_id,
      color_mode_id,
      finish_type_id,
      manual_price
    } = req.body;

    if (!fileKey || !fileName || !page_count) {
      return errorResponse(res, 'File data missing', 400);
    }

    const { data: order } = await supabaseService.getOrderById(orderId, token);

    if (!order) {
      return errorResponse(res, "Order not found", 404);
    }

    // 🟣 WALK-IN
    if (order.order_type === "walk_in") {
      if (!manual_price || Number(manual_price) <= 0) {
        return errorResponse(res, "Valid amount required", 400);
      }

      const { data, error } = await supabaseService.createDocument(
        {
          order_id: orderId,
          file_url: fileKey,
          file_name: fileName,
          page_count,
          copies: 1,
          manual_price: Number(manual_price),
        },
        token
      );

      if (error) {
        return errorResponse(res, error.message, 400);
      }

      return successResponse(res, data, 'Walk-in document added', 201);
    }

    // 🟢 ONLINE
    if (
      !copies ||
      !paper_type_id ||
      !color_mode_id ||
      !finish_type_id
    ) {
      return errorResponse(res, 'Print configuration required', 400);
    }

    const { data, error } = await supabaseService.createDocument(
      {
        order_id: orderId,
        file_url: fileKey,
        file_name: fileName,
        page_count,
        copies,
        paper_type_id,
        color_mode_id,
        finish_type_id
      },
      token
    );

    if (error) {
      return errorResponse(res, error.message, 400);
    }

    return successResponse(res, data, 'Document added successfully', 201);
  } catch (err) {
    next(err);
  }
};


export const getShopPrintOptionsStudent = async (req, res, next) => {
  try {
    const { shopId } = req.params;

    const data = await supabaseService.getShopOptionsStudent(shopId);

    return successResponse(res, data, 'Shop print options retrieved');
  } catch (err) {
    next(err);
  }
};