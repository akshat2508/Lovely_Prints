// src/services/api.js
import axios from "axios";
import { supabase } from "./supabase"; // adjust path
/**
 * Base Axios instance
 * Backend runs on /api/*
 */


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
/**
 * 🔥 NEW: Separate instance for refresh (IMPORTANT)
 */
const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
/**
 * Attach JWT token automatically
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Optional: handle expired token globally
 */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // 🔥 your logic (keep 401, 403, 404)
    if (![401, 403, 404].includes(status)) {
      return Promise.reject(error);
    }

    // prevent infinite loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers["Authorization"] = "Bearer " + token;
        return api(originalRequest);
      });
    }

    isRefreshing = true;

    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      localStorage.clear();
      window.location.assign("/login");
      return Promise.reject(error);
    }

    try {
      console.log("🔄 Refreshing token...");

      const res = await refreshApi.post("/auth/refresh", {
        refresh_token: refreshToken,
      });

      const newAccessToken = res.data.data.access_token;
      const newRefreshToken = res.data.data.refresh_token;

      // ✅ IMPORTANT: store BOTH tokens
      localStorage.setItem("access_token", newAccessToken);
      localStorage.setItem("refresh_token", newRefreshToken);
      supabase.realtime.setAuth(newAccessToken);

      processQueue(null, newAccessToken);

      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);

      console.log("❌ Refresh failed → logout");

      localStorage.clear();
      window.location.assign("/login");

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
