// Wishlist API functions

import apiClient from './client';
import { ApiResponse } from '@/types/product';
import type { ProductDTO } from '@/types/product';

export interface WishlistDTO {
    id: number;
    product: ProductDTO;
    addedAt: string;
}

export interface WishlistCheckResponse {
    isInWishlist: boolean;
    wishlistCount: number;
}

/**
 * Get user wishlist
 * GET /api/v1/wishlist
 */
export async function getWishlist(): Promise<ProductDTO[]> {
    const response = await apiClient.get<ApiResponse<ProductDTO[]>>('/wishlist');
    
    if (!response.data.success) {
        throw new Error(response.data.message || 'Không thể lấy danh sách yêu thích');
    }
    
    return response.data.data;
}

/**
 * Add product to wishlist
 * POST /api/v1/wishlist
 */
export async function addToWishlist(productId: number): Promise<WishlistDTO> {
    const response = await apiClient.post<ApiResponse<WishlistDTO>>('/wishlist', { productId });
    
    if (!response.data.success) {
        throw new Error(response.data.message || 'Không thể thêm vào yêu thích');
    }
    
    return response.data.data;
}

/**
 * Remove product from wishlist
 * DELETE /api/v1/wishlist/{productId}
 */
export async function removeFromWishlist(productId: number): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(`/wishlist/${productId}`);
    
    if (!response.data.success) {
        throw new Error(response.data.message || 'Không thể xóa khỏi yêu thích');
    }
}

/**
 * Check if product is in wishlist
 * GET /api/v1/wishlist/check/{productId}
 */
export async function checkWishlistStatus(productId: number): Promise<WishlistCheckResponse> {
    const response = await apiClient.get<ApiResponse<WishlistCheckResponse>>(`/wishlist/check/${productId}`);
    
    if (!response.data.success) {
        throw new Error(response.data.message || 'Không thể kiểm tra trạng thái');
    }
    
    return response.data.data;
}

/**
 * Get wishlist count
 * GET /api/v1/wishlist/count
 */
export async function getWishlistCount(): Promise<number> {
    const response = await apiClient.get<ApiResponse<{ count: number }>>('/wishlist/count');
    
    if (!response.data.success) {
        throw new Error(response.data.message || 'Không thể lấy số lượng');
    }
    
    return response.data.data.count;
}
