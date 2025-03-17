import axios from "axios";
import { environment } from "@/environment";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: environment.API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (token) {
      // Set Authorization header correctly
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        const response = await axios.post(
          `${environment.API_URL}/users/sign-in-using-token`,
          { accessToken, refreshToken }
        );

        if (response.data.success) {
          const newToken = response.data.accessToken;
          localStorage.setItem("accessToken", newToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          localStorage.setItem("uuid", response.data.user.uuid);

          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return axios(originalRequest);
        } else {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("uuid");
          toast.error("Session expired. Please login again.");
          // Instead of redirecting, show auth modal
          if (typeof window !== "undefined") {
            const authContext = window.__AUTH_CONTEXT__;
            if (authContext && authContext.setShowAuthModal) {
              authContext.setShowAuthModal(true);
            }
          }
        }
      } catch (err) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("uuid");
        toast.error("Session expired. Please login again.");

      }
    }
    return Promise.reject(error);
  }
);
export default api;
