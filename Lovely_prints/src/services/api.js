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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || "";

      if (!url.includes("auth/login")) {
        localStorage.removeItem("access_token");
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
