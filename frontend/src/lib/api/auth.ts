// Authentication API functions
// Login, register, profile

import apiClient from './client';
import { ApiResponse } from '@/types/product';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface AuthResponseData {
  token: string;
  email: string;
  fullName: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface UserResponseData {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface UpdateProfileData {
  fullName?: string;
  phone?: string;
}

/**
 * Login with email and password
 * POST /api/v1/auth/login
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponseData> {
  const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', credentials);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Đăng nhập thất bại');
  }
  
  return response.data.data;
}

/**
 * Register new account
 * POST /api/v1/auth/register
 */
export async function register(data: RegisterData): Promise<AuthResponseData> {
  const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/register', {
    email: data.email,
    password: data.password,
    fullName: data.fullName,
    phone: data.phone || undefined,
  });
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Đăng ký thất bại');
  }
  
  return response.data.data;
}

/**
 * Get current user profile
 * GET /api/v1/users/me
 */
export async function getMe(token?: string): Promise<UserResponseData> {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const response = await apiClient.get<ApiResponse<UserResponseData>>('/users/me', { headers });
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể lấy thông tin người dùng');
  }
  
  return response.data.data;
}

/**
 * Update user profile
 * PUT /api/v1/users/me
 */
export async function updateProfile(data: UpdateProfileData): Promise<UserResponseData> {
  const response = await apiClient.put<ApiResponse<UserResponseData>>('/users/me', data);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Cập nhật thông tin thất bại');
  }
  
  return response.data.data;
}
