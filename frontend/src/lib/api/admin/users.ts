// Admin Users API

import apiClient from '../client';
import { ApiResponse, PaginatedResponse } from '@/types/product';
import type { UserDTO, UpdateUserRequest } from '@/types/user';
import type { Role } from '@/types/enums';
import type { OrderDTO } from '@/types/order';

export interface AdminUsersParams {
  page?: number;
  size?: number;
  search?: string;
  role?: Role | 'all';
}

/**
 * Get all users (admin view)
 * GET /api/v1/admin/users
 */
export async function getAdminUsers(params: AdminUsersParams = {}): Promise<PaginatedResponse<UserDTO>> {
  const queryParams = new URLSearchParams();
  
  if (params.page !== undefined) queryParams.append('page', params.page.toString());
  if (params.size !== undefined) queryParams.append('size', params.size.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.role && params.role !== 'all') queryParams.append('role', params.role);
  
  const response = await apiClient.get<ApiResponse<PaginatedResponse<UserDTO>>>(`/admin/users?${queryParams.toString()}`);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể lấy danh sách ngườí dùng');
  }
  
  return response.data.data;
}

/**
 * Get single user by ID
 * GET /api/v1/admin/users/{id}
 */
export async function getAdminUser(id: number): Promise<UserDTO> {
  const response = await apiClient.get<ApiResponse<UserDTO>>(`/admin/users/${id}`);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể lấy thông tin người dùng');
  }
  
  return response.data.data;
}

/**
 * Update user
 * PUT /api/v1/admin/users/{id}
 */
export async function updateUser(id: number, data: UpdateUserRequest): Promise<UserDTO> {
  const response = await apiClient.put<ApiResponse<UserDTO>>(`/admin/users/${id}`, data);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể cập nhật người dùng');
  }
  
  return response.data.data;
}

/**
 * Delete user (soft delete)
 * DELETE /api/v1/admin/users/{id}
 */
export async function deleteUser(id: number): Promise<void> {
  const response = await apiClient.delete<ApiResponse<void>>(`/admin/users/${id}`);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể xóa người dùng');
  }
}

/**
 * Get orders of a specific user
 * GET /api/v1/admin/orders?userId={userId}
 */
export async function getUserOrders(userId: number): Promise<OrderDTO[]> {
  const response = await apiClient.get<ApiResponse<{ content: OrderDTO[] }>>(`/admin/orders?userId=${userId}&size=100`);
  return response.data.data.content || [];
}
