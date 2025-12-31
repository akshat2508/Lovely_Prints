import supabaseService from '../services/supabase.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createColorMode = async (req, res, next) => {
  try {
    const { shopId } = req.params;
    const token = req.headers.authorization.split(' ')[1];

    const { name, extra_price } = req.body;

    if (!name || extra_price == null) {
      return errorResponse(res, 'name and extra_price are required', 400);
    }

    const { data, error } =
      await supabaseService.createColorMode(
        {
          shop_id: shopId,
          name,
          extra_price,
        },
        token
      );

    if (error) return errorResponse(res, error.message, 400);

    return successResponse(res, data, 'Color mode added successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const getColorModesByShop = async (req, res, next) => {
  try {
    const { shopId } = req.params;

    const { data, error } =
      await supabaseService.getColorModesByShop(shopId);

    if (error) return errorResponse(res, error.message, 400);

    return successResponse(res, data, 'Color modes retrieved');
  } catch (err) {
    next(err);
  }
};

export const updateColorMode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    const token = req.headers.authorization.split(' ')[1];

    const { data, error } =
      await supabaseService.updateColorMode(id, is_active, token);

    if (error) return errorResponse(res, error.message, 400);

    return successResponse(res, data, 'Color mode updated');
  } catch (err) {
    next(err);
  }
};
