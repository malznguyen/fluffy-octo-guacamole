// Order-related type definitions
import { OrderStatus } from './enums';

export interface OrderItemDTO {
  id: number;
  productNameSnapshot: string;
  variantInfoSnapshot: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDTO {
  id: number;
  orderCode: string;
  userId: number;
  customerName: string;
  customerEmail: string;
  total: number;
  status: OrderStatus;
  shippingAddress: string;
  phone: string;
  note: string | null;
  items: OrderItemDTO[];
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

// Responses
export interface OrderListResponse {
  content: OrderDTO[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

// Request Types
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}
