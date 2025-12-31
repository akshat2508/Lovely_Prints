import supabaseService from '../services/supabase.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createFinishType = async (req, res, next) => {
  try {
    const { shopId } = req.params;
    const token = req.headers.authorization.split(' ')[1];

    const { name, extra_price } = req.body;

    if (!name || extra_price == null) {
      return errorResponse(res, 'name and extra_price are required', 400);
    }

    const { data, error } =
      await supabaseService.createFinishType(
        {
          shop_id: shopId,
          name,
          extra_price,
        },
        token
      );

    if (error) return errorResponse(res, error.message, 400);

    return successResponse(res, data, 'Finish type added successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const getFinishTypesByShop = async (req, res, next) => {
  try {
    const { shopId } = req.params;

    const { data, error } =
      await supabaseService.getFinishTypesByShop(shopId);

    if (error) return errorResponse(res, error.message, 400);

    return successResponse(res, data, 'Finish types retrieved');
  } catch (err) {
    next(err);
  }
};

export const updateFinishType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    const token = req.headers.authorization.split(' ')[1];

    const { data, error } =
      await supabaseService.updateFinishType(id, is_active, token);

    if (error) return errorResponse(res, error.message, 400);

    return successResponse(res, data, 'Finish type updated');
  } catch (err) {
    next(err);
  }
};
