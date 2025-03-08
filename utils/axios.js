import axios from 'axios';
import { environment } from '@/environment';

const api = axios.create({
  baseURL: environment.API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      // Set Authorization header correctly
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
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

    // If error is 401 and we haven't tried refreshing token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        // Call sign in using token with a new axios instance to avoid interceptors
        const response = await axios.post(
          `${environment.API_URL}/users/sign-in-using-token`,
          { accessToken, refreshToken }
        );

        if (response.data.success) {
          const newToken = response.data.accessToken;
          
          // Update tokens in localStorage
          localStorage.setItem('accessToken', newToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          localStorage.setItem('uuid', response.data.user.uuid);

          // Update the failed request config with new token
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

          // Retry the original request with new token
          return axios(originalRequest);
        }
      } catch (err) {
        // Clear auth data and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('uuid');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;