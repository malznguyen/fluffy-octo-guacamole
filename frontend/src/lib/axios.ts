// Axios instance configuration for API requests

import axios from 'axios';

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
    // Log outgoing request
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);

    // Add auth token if available (to be implemented)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    // Log successful response
    console.log(`[API Response] ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    // Log error response
    console.error('[API Response Error]', error.response?.status, error.response?.data || error.message);

    // Handle common errors (to be implemented)
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login or refresh token
      console.log('Unauthorized - redirecting to login');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
