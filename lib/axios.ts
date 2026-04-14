import axios from "axios";
import { clearAuthCookie } from "./auth-cookie";
import { useAuthStore } from "@/stores/useAuthStore";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

const api = axios.create({
  baseURL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path === "/login" || path === "/register") {
        return Promise.reject(error);
      }
      useAuthStore.getState().logout();
      clearAuthCookie();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
