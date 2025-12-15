// controllers/shop.controller.js
import supabaseService from '../services/supabase.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getAllShops = async (req, res, next) => {
  try {
    const { data, error } = await supabaseService.getAllShops();

    if (error) {
      return errorResponse(res, error.message, 404);
    }

    return successResponse(res, data, 'Shops retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getShopById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseService.getShopById(id);

    if (error) {
      return errorResponse(res, error.message, 404);
    }

    return successResponse(res, data, 'Shop retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createShop = async (req, res, next) => {
  try {
    const shopData = req.body;

    const { data, error } = await supabaseService.createShop(shopData);

    if (error) {
      return errorResponse(res, error.message, 400);
    }

    return successResponse(res, data, 'Shop created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateShop = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabaseService.updateShop(id, updates);

    if (error) {
      return errorResponse(res, error.message, 400);
    }

    return successResponse(res, data, 'Shop updated successfully');
  } catch (error) {
    next(error);
  }
};

export const getShopOrders = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseService.getOrdersByShopId(id);

    if (error) {
      return errorResponse(res, error.message, 404);
    }

    return successResponse(res, data, 'Shop orders retrieved successfully');
  } catch (error) {
    next(error);
  }
};