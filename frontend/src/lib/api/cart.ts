// Cart API functions

import apiClient from './client';
import { ApiResponse } from '@/types/product';

export interface CartItemDTO {
  id: number;
  variantId: number;
  productName: string;
  color: string;
  size: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartDTO {
  id: number;
  userId: number;
  items: CartItemDTO[];
  totalItems: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartData {
  variantId: number;
  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
}

/**
 * Get current user's cart
 * GET /api/v1/cart
 */
export async function getCart(): Promise<CartDTO> {
  const response = await apiClient.get<ApiResponse<CartDTO>>('/cart');
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể lấy giỏ hàng');
  }
  
  return response.data.data;
}

/**
 * Add item to cart
 * POST /api/v1/cart/items
 */
export async function addToCart(data: AddToCartData): Promise<CartDTO> {
  const response = await apiClient.post<ApiResponse<CartDTO>>('/cart/items', data);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể thêm vào giỏ hàng');
  }
  
  return response.data.data;
}

/**
 * Update cart item quantity
 * PUT /api/v1/cart/items/{itemId}
 */
export async function updateCartItem(itemId: number, data: UpdateCartItemData): Promise<CartDTO> {
  const response = await apiClient.put<ApiResponse<CartDTO>>(`/cart/items/${itemId}`, data);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể cập nhật số lượng');
  }
  
  return response.data.data;
}

/**
 * Remove item from cart
 * DELETE /api/v1/cart/items/{itemId}
 */
export async function removeCartItem(itemId: number): Promise<CartDTO> {
  const response = await apiClient.delete<ApiResponse<CartDTO>>(`/cart/items/${itemId}`);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể xóa sản phẩm');
  }
  
  return response.data.data;
}
