// Admin Orders API

import apiClient from '../client';
import { ApiResponse, PaginatedResponse } from '@/types/product';
import { OrderDTO, UpdateOrderStatusRequest } from '@/types/order';
import { OrderStatus } from '@/types/enums';

export type { OrderDTO, OrderStatus };

export interface AdminOrdersParams {
  page?: number;
  size?: number;
  status?: OrderStatus | 'all';
  search?: string;
  userId?: number;
}

export interface OrderListResponse extends PaginatedResponse<OrderDTO> {}

/**
 * Get all orders for admin with filters
 * GET /api/v1/admin/orders
 */
export async function getAdminOrders(params: AdminOrdersParams = {}): Promise<OrderListResponse> {
  const queryParams = new URLSearchParams();
  
  if (params.page !== undefined) queryParams.append('page', params.page.toString());
  if (params.size !== undefined) queryParams.append('size', params.size.toString());
  if (params.status && params.status !== 'all') queryParams.append('status', params.status);
  if (params.search) queryParams.append('search', params.search);
  if (params.userId !== undefined) queryParams.append('userId', params.userId.toString());
  
  const response = await apiClient.get<ApiResponse<OrderListResponse>>(`/admin/orders?${queryParams.toString()}`);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể lấy danh sách đơn hàng');
  }
  
  return response.data.data;
}

/**
 * Get single order by code (admin view)
 * GET /api/v1/admin/orders/{orderCode}
 */
export async function getAdminOrder(orderCode: string): Promise<OrderDTO> {
  const response = await apiClient.get<ApiResponse<OrderDTO>>(`/admin/orders/${orderCode}`);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể lấy thông tin đơn hàng');
  }
  
  return response.data.data;
}

/**
 * Update order status
 * PUT /api/v1/admin/orders/{orderCode}/status
 */
export async function updateOrderStatus(orderCode: string, status: OrderStatus): Promise<OrderDTO> {
  const data: UpdateOrderStatusRequest = { status };
  const response = await apiClient.put<ApiResponse<OrderDTO>>(`/admin/orders/${orderCode}/status`, data);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể cập nhật trạng thái');
  }
  
  return response.data.data;
}

/**
 * Cancel order (admin)
 * POST /api/v1/admin/orders/{orderCode}/cancel
 */
export async function cancelOrderAdmin(orderCode: string): Promise<OrderDTO> {
  const response = await apiClient.post<ApiResponse<OrderDTO>>(`/admin/orders/${orderCode}/cancel`);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể hủy đơn hàng');
  }
  
  return response.data.data;
}
