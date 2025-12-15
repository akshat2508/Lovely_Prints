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

    const { data, error } = await supabaseService.getOrdersByStudentId(userId);

    if (error) {
      return errorResponse(res, error.message, 404);
    }

    return successResponse(res, data, 'Orders retrieved successfully');
  } catch (error) {
    next(error);
  }
};