
import api from "./api";

/**
 * Register User
 * POST /api/auth/register
 */
export const registerUser = async ({
  email,
  password,
  name,
  role,
  organisation_id,
}) => {
  const response = await api.post("auth/register", {
    email,
    password,
    name,
    role,
    organisation_id, // 🔥 DO NOT MISS THIS
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

const role = response.data.data.user.user_metadata.role;
const session = response.data.data.session;


localStorage.setItem("access_token", session.access_token);
localStorage.setItem("refresh_token", session.refresh_token);localStorage.setItem("role", role);
  return response.data;
};

/**
 * Logout User
 * POST /api/auth/logout
 */
export const logoutUser = async () => {
  await api.post("/auth/logout");
localStorage.removeItem("access_token");
localStorage.removeItem("role");
  window.location.href="/login";
};

/**
 * Get Current User
 * GET /api/auth/me
 */
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
export const forgotPassword = async (email) => {
  return api.post("/auth/forgot-password", {
    email,
  });
};

/**
 * Get Organisations (Public)
 * GET /api/auth/organisations
 */
export const getOrganisations = async () => {
  const response = await api.get("/auth/organisations");
  return response.data.data;
};
