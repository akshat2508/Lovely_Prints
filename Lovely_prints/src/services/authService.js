// src/services/authService.js
import api from "./api";

/* ================= AUTH ================= */

/**
 * Register User
 * POST /auth/register
 */
export const registerUser = async ({ email, password, name, role }) => {
  const response = await api.post("auth/register", {
    email,
    password,
    name,
    role,
  });

  return response.data;
};


/**
 * Login User
 * POST /auth/login
 *
 * Backend returns:
 * data.access_token (NOT session.access_token)
 */
export const loginUser = async ({ email, password }) => {
  const response = await api.post("auth/login", { email, password });

  // ⭐⭐⭐ IMPORTANT ⭐⭐⭐
  const token = response.data.data.access_token; // ✔ FIXED TOKEN LOCATION

  if (token) {
    localStorage.setItem("access_token", token);
  }

  return response.data;
};


/**
 * Logout User
 * POST /auth/logout
 */
export const logoutUser = async () => {
  await api.post("auth/logout");
  localStorage.removeItem("access_token");
};


/**
 * Get Current User
 * GET /auth/me
 */
export const getCurrentUser = async () => {
  const response = await api.get("auth/me");
  return response.data;
};
