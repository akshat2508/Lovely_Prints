// controllers/order.controller.js
import supabaseService from '../services/supabase.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createOrder = async (req, res, next) => {
  try {
    const orderData = req.body;

    const { data, error } = await supabaseService.createOrder(orderData);

    if (error) {
      return errorResponse(res, error.message, 400);
    }

    return successResponse(res, data, 'Order created successfully', 201);
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

    return successResponse(res, data, 'Order retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabaseService.updateOrderStatus(id, status);

    if (error) {
      return errorResponse(res, error.message, 400);
    }

    return successResponse(res, data, 'Order status updated successfully');
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

    return successResponse(res, data, 'Order deleted successfully');
  } catch (error) {
    next(error);
  }
};