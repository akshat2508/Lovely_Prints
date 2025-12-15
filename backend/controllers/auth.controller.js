// controllers/auth.controller.js
import supabaseService from '../services/supabase.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;

    const { data, error } = await supabaseService.signUp(email, password, { name, role });

    if (error) {
      return errorResponse(res, error.message, 400);
    }

    return successResponse(res, data, 'User registered successfully');
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabaseService.signIn(email, password);

    if (error) {
      return errorResponse(res, error.message, 401);
    }

    return successResponse(res, data, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { error } = await supabaseService.signOut();

    if (error) {
      return errorResponse(res, error.message, 400);
    }

    return successResponse(res, null, 'Logout successful');
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const { data, error } = await supabaseService.getCurrentUser();

    if (error) {
      return errorResponse(res, error.message, 401);
    }

    return successResponse(res, data, 'User retrieved successfully');
  } catch (error) {
    next(error);
  }
};