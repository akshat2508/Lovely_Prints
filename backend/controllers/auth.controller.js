// controllers/auth.controller.js
import supabaseService from '../services/supabase.service.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { supabaseAdmin } from "../services/supabase.service.js";

export const register = async (req, res, next) => {
  try {
    
    const { email, password, name, role, organisation_id } = req.body;
    console.log("REGISTER PAYLOAD:", {
      email,
      password,
      name,
      role,
      organisation_id,
    });

    // const { data, error } = await supabaseService.signUp(email, password, { name, role });


    const { data, error } = await supabaseService.signUp(
        email,
        password,
        {
          name,
          role,
          organisation_id, 
        }
      );

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
    const token = req.headers.authorization.split(' ')[1];

    const { data, error } =
      await supabaseService.getCurrentUser(token);

    if (error) {
      return errorResponse(res, error.message, 401);
    }

    return successResponse(res, data, 'User retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, "Email is required", 400);
    }

    const { error } =
      await supabaseService.sendPasswordResetEmail(email);

    if (error) {
      return errorResponse(res, error.message, 400);
    }

    return successResponse(
      res,
      null,
      "Password reset email sent"
    );
  } catch (err) {
    next(err);
  }
};

export const getOrganisations = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("organisations")
      .select("id, name")
      .eq("is_active", true)
      .order("name");

    if (error) {
      return errorResponse(res, error.message, 400);
    }

    return successResponse(res, data, "Organisations fetched");
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};
