
import api from "./api";

/**
 * Register User
 * POST /api/auth/register
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
 * POST /api/auth/login
 */
export const loginUser = async ({ email, password }) => {
  const response = await api.post("auth/login", {
    email,
    password,
  });

  /**
   * Save access token
   * Matches your response format:
   * data.session.access_token
   */
  const token = response.data.data.session.access_token;
  localStorage.setItem("access_token", token);

  return response.data;
};

/**
 * Logout User
 * POST /api/auth/logout
 */
export const logoutUser = async () => {
  await api.post("/auth/logout");
  localStorage.removeItem("access_token");
};

/**
 * Get Current User
 * GET /api/auth/me
 */
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
