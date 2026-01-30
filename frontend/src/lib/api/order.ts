// Order API functions

import apiClient from './client';
import { ApiResponse, PaginatedResponse } from '@/types/product';
import { OrderDTO, OrderItemDTO } from '@/types/order';
import { PaymentMethod } from '@/types/enums';

export { OrderDTO, OrderItemDTO };

export interface CreateOrderData {
  shippingAddress: string;
  phone: string;
  note?: string;
  paymentMethod: PaymentMethod;
}

export interface OrderListResponse extends PaginatedResponse<OrderDTO> {}

/**
 * Create new order from cart
 * POST /api/v1/orders
 */
export async function createOrder(data: CreateOrderData): Promise<OrderDTO> {
  const response = await apiClient.post<ApiResponse<OrderDTO>>('/orders', {
    shippingAddress: data.shippingAddress,
    phone: data.phone,
    note: data.note,
    paymentMethod: data.paymentMethod,
  });
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể tạo đơn hàng');
  }
  
  return response.data.data;
}

/**
 * Get user's orders with pagination
 * GET /api/v1/orders
 */
export async function getOrders(page: number = 0, size: number = 10): Promise<OrderListResponse> {
  const response = await apiClient.get<ApiResponse<OrderListResponse>>('/orders', {
    params: { page, size },
  });
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể lấy danh sách đơn hàng');
  }
  
  return response.data.data;
}

/**
 * Get order detail by order code
 * GET /api/v1/orders/{orderCode}
 */
export async function getOrderDetail(orderCode: string): Promise<OrderDTO> {
  const response = await apiClient.get<ApiResponse<OrderDTO>>(`/orders/${orderCode}`);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể lấy thông tin đơn hàng');
  }
  
  return response.data.data;
}

/**
 * Cancel an order
 * POST /api/v1/orders/{orderCode}/cancel
 */
export async function cancelOrder(orderCode: string): Promise<OrderDTO> {
  const response = await apiClient.post<ApiResponse<OrderDTO>>(`/orders/${orderCode}/cancel`);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể hủy đơn hàng');
  }
  
  return response.data.data;
}
