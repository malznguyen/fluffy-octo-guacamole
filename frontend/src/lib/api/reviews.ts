// Reviews API functions

import apiClient from './client';
import { Review, ProductReviewStats, CreateReviewRequest } from '@/types/review';
import { ApiResponse } from '@/types/product';

/**
 * Get product reviews and stats
 * GET /api/v1/public/products/{productId}/reviews
 */
export async function getProductReviews(productId: number): Promise<ProductReviewStats> {
  const response = await apiClient.get<ApiResponse<ProductReviewStats>>(`/public/products/${productId}/reviews`);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể lấy đánh giá sản phẩm');
  }
  
  return response.data.data;
}

/**
 * Create a new review
 * POST /api/v1/reviews
 */
export async function createReview(data: CreateReviewRequest): Promise<Review> {
  const response = await apiClient.post<ApiResponse<Review>>('/reviews', data);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể gửi đánh giá');
  }
  
  return response.data.data;
}

/**
 * Delete a review
 * DELETE /api/v1/reviews/{reviewId}
 */
export async function deleteReview(reviewId: number): Promise<void> {
  const response = await apiClient.delete<ApiResponse<void>>(`/reviews/${reviewId}`);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể xóa đánh giá');
  }
}
