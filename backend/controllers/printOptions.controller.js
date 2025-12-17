import supabaseService from '../services/supabase.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getPrintOptionsByShop = async (req, res, next) => {
  try {
    const { shopId } = req.params;

    const { data, error } = await supabaseService.getPrintOptionsByShop(shopId);

    if (error) {
      return errorResponse(res, error.message, 400);
    }

    return successResponse(res, data, 'Print options retrieved successfully');
  } catch (err) {
    next(err);
  }
};


export const createPrintOption = async (req, res, next) => {
  try {
    const {
      shop_id,
      paper_type,
      color_mode,
      finish_type,
      price_per_page
    } = req.body;

    if (!shop_id || !paper_type || !color_mode || !finish_type || !price_per_page) {
      return errorResponse(res, 'All fields are required', 400);
    }

   const token = req.headers.authorization.split(' ')[1];

const { data, error } = await supabaseService.createPrintOption(
  {
    shop_id,
    paper_type,
    color_mode,
    finish_type,
    price_per_page
  },
  token
);


    if (error) {
      return errorResponse(res, error.message, 400);
    }

    return successResponse(res, data, 'Print option created successfully', 201);
  } catch (err) {
    next(err);
  }
};
