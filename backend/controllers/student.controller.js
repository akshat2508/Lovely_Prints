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

    // 🔹 Current time in IST
    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const currentHour = now.getHours();

    // ⛔ Block orders between 12 AM and 6 AM
    if (currentHour >= 0 && currentHour < 6) {
      return errorResponse(
        res,
        "Orders cannot be placed between 12 AM and 6 AM",
        403
      );
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return errorResponse(res, "Authorization token missing", 401);
    }

    const {
      shop_id,
      description,
      orientation,
      is_handled,
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

      // 🔹 Parse pickup time safely
      const pickupTime = new Date(
        new Date(pickup_at).toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        })
      );

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

      // 🔹 Max 24 hours rule
      const maxAllowed = new Date(now);
      maxAllowed.setHours(maxAllowed.getHours() + 24);

      if (pickupTime > maxAllowed) {
        return errorResponse(
          res,
          "Pickup time must be within 24 hours",
          400
        );
      }

      // 🔹 Fetch shop info
      const { data: shop, error: shopError } =
        await supabaseService.getShopById(shop_id);

      if (shopError || !shop) {
        return errorResponse(res, "Shop not found", 404);
      }

      // 🔹 Check if shop accepting orders
      if (!shop.is_accepting_orders) {
        return errorResponse(
          res,
          "Shop is not accepting orders right now",
          403
        );
      }

      // 🔹 Detect tomorrow order
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const isTomorrowOrder =
        pickupTime.toDateString() === tomorrow.toDateString();

      // 🔹 Get shop closing time
      const [closeHour, closeMinute] = shop.close_time.split(":");

      const shopClosingToday = new Date(now);
      shopClosingToday.setHours(closeHour, closeMinute, 0, 0);

      // ⛔ Block tomorrow orders before shop closes
      if (isTomorrowOrder && now <= shopClosingToday) {
        return errorResponse(
          res,
          "Tomorrow orders can only be placed after the shop closes today",
          403
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
      is_handled: type === "online" ? Boolean(is_handled) : false,
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