import supabaseService from '../services/supabase.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createPaperType = async (req, res, next) => {
  try {
    const { shopId } = req.params;
    const token = req.headers.authorization.split(' ')[1];

    const { name, base_price } = req.body;

    if (!name || base_price == null) {
      return errorResponse(res, 'name and base_price are required', 400);
    }

    const { data, error } =
      await supabaseService.createPaperType(
        {
          shop_id: shopId,
          name,
          base_price,
        },
        token
      );

    if (error) return errorResponse(res, error.message, 400);

    return successResponse(res, data, 'Paper type added successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const getPaperTypesByShop = async (req, res, next) => {
  try {
    const { shopId } = req.params;

    const { data, error } =
      await supabaseService.getPaperTypesByShop(shopId);

    if (error) return errorResponse(res, error.message, 400);

    return successResponse(res, data, 'Paper types retrieved');
  } catch (err) {
    next(err);
  }
};
