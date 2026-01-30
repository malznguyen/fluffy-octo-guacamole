// Admin Users API

import apiClient from '../client';
import { ApiResponse, PaginatedResponse } from '@/types/product';
import { UserDTO, UpdateUserRequest } from '@/types/user';
import { Role } from '@/types/enums';
import { OrderDTO } from '@/types/order';

export type { UserDTO, UpdateUserRequest, Role };

export interface AdminUsersParams {
  page?: number;
  size?: number;
  search?: string;
  role?: Role | 'all';
}

export interface UsersResponse extends PaginatedResponse<UserDTO> {}

/**
 * Get all users (admin view)
 * GET /api/v1/admin/users
 */
export async function getAdminUsers(params: AdminUsersParams = {}): Promise<UsersResponse> {
  const queryParams = new URLSearchParams();
  
  if (params.page !== undefined) queryParams.append('page', params.page.toString());
  if (params.size !== undefined) queryParams.append('size', params.size.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.role && params.role !== 'all') queryParams.append('role', params.role);
  
  const response = await apiClient.get<ApiResponse<UsersResponse | { data: UserDTO[] }>>(`/admin/users?${queryParams.toString()}`);
  
  // Handle both paginated and flat response for robustness
  const responseData = response.data.data;
  
  if ('content' in responseData) {
    return responseData as UsersResponse;
  } else if (Array.isArray(responseData)) {
    // Wrap flat list in paginated structure
    return {
      content: responseData,
      totalElements: responseData.length,
      totalPages: 1,
      currentPage: 0,
      size: responseData.length,
    };
  }
  
  return responseData as UsersResponse;
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
