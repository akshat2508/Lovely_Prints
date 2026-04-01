// src/services/api.js
import axios from "axios";

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

    // 🔥 treat these as auth failures
    if (![401, 400, 404].includes(status)) {
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

    try {
      console.log("🔄 Calling refresh token...");
      const res = await api.post("/auth/refresh", {
  refresh_token: refreshToken,
});

      const newAccessToken = res.data.data.access_token;

      localStorage.setItem("access_token", newAccessToken);

      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${newAccessToken}`;

      processQueue(null, newAccessToken);

      originalRequest.headers[
        "Authorization"
      ] = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);
      console.log("❌ API error status:", error.response?.status);
      // ❌ only now logout
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      window.location.assign("/login");

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
