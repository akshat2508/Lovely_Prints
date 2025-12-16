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
    const studentId = req.user.id;
    const token = req.headers.authorization.split(' ')[1];

    const orderData = {
      student_id: studentId,
      shop_id: req.body.shop_id,
      notes: req.body.description || null,
    };

    const { data, error } =
      await supabaseService.createOrder(orderData, token);

    if (error) {
      return errorResponse(res, error.message, 400);
    }

    return successResponse(res, data, 'Order created successfully', 201);
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
      page_count = 1,
      price_per_page = 1
    } = req.body;

    if (!fileKey || !fileName) {
      return res.status(400).json({
        success: false,
        message: 'fileKey and fileName are required'
      });
    }

    const documentData = {
      order_id: orderId,
      file_url: fileKey,
      file_name: fileName,
      page_count,
      price_per_page
    };

    const { data, error } =
      await supabaseService.createDocument(documentData, token);

    if (error) {
      return errorResponse(res, error.message, 400);
    }

    return successResponse(res, data, 'Document attached successfully', 201);
  } catch (error) {
    next(error);
  }
};
