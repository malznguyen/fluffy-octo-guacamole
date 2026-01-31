// Axios instance configuration for API requests

import axios from 'axios';
import { useAuthStore } from '@/stores/auth-store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Log outgoing request (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }

    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = useAuthStore.getState().token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Only warn for protected routes
        const protectedRoutes = ['/cart', '/orders', '/users/me', '/checkout'];
        const isProtected = protectedRoutes.some(route => config.url?.includes(route));
        if (isProtected) {
          console.warn(`[Axios] No token for protected route: ${config.url}`);
        }
      }
    }

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log successful response (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.config.url}`, response.status);
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    // Only log client errors (4xx), don't spam console with server errors (5xx)
    // as those are backend issues that should be handled by the UI
    if (status && status >= 400 && status < 500) {
      console.error(`[API Client Error] ${status} ${url}`, error.response?.data);
    }

    // Log 500 errors only in development with minimal info
    if (status === 500 && process.env.NODE_ENV === 'development') {
      console.warn(`[API Server Error] 500 ${url} - Backend issue, check server logs`);
    }

    // Handle auth errors
    if (status === 401) {
      console.warn('[API] Unauthorized - Token may be expired');
      if (typeof window !== 'undefined') {
        useAuthStore.getState().logout();
        // Redirect to login if not already there
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      }
    } else if (status === 403) {
      console.warn('[API] Forbidden - Check token validity');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
