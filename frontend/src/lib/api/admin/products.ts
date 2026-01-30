// Admin Products API

import apiClient from '../client';
import { ApiResponse, ProductDTO, CreateProductRequest, UpdateProductRequest, ImageUploadResponse } from '@/types/product';

export type { ProductDTO, CreateProductRequest, UpdateProductRequest };

/**
 * Get all products (admin view)
 * GET /api/v1/admin/products
 */
export async function getAdminProducts(): Promise<ProductDTO[]> {
  const response = await apiClient.get<ApiResponse<ProductDTO[]>>('/admin/products');
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể lấy danh sách sản phẩm');
  }
  
  return response.data.data;
}

/**
 * Get single product by ID
 * GET /api/v1/admin/products/{id}
 */
export async function getAdminProduct(id: number): Promise<ProductDTO> {
  const response = await apiClient.get<ApiResponse<ProductDTO>>(`/admin/products/${id}`);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể lấy thông tin sản phẩm');
  }
  
  return response.data.data;
}

/**
 * Create new product
 * POST /api/v1/admin/products
 */
export async function createProduct(data: CreateProductRequest): Promise<ProductDTO> {
  const response = await apiClient.post<ApiResponse<ProductDTO>>('/admin/products', data);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể tạo sản phẩm');
  }
  
  return response.data.data;
}

/**
 * Update product
 * PUT /api/v1/admin/products/{id}
 */
export async function updateProduct(id: number, data: UpdateProductRequest): Promise<ProductDTO> {
  const response = await apiClient.put<ApiResponse<ProductDTO>>(`/admin/products/${id}`, data);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể cập nhật sản phẩm');
  }
  
  return response.data.data;
}

/**
 * Delete product (soft delete)
 * DELETE /api/v1/admin/products/{id}
 */
export async function deleteProduct(id: number): Promise<void> {
  const response = await apiClient.delete<ApiResponse<void>>(`/admin/products/${id}`);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể xóa sản phẩm');
  }
}

/**
 * Upload product image
 * POST /api/v1/admin/upload
 */
export async function uploadImage(file: File): Promise<ImageUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiClient.post<ApiResponse<ImageUploadResponse>>('/admin/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể upload ảnh');
  }
  
  return response.data.data;
}
