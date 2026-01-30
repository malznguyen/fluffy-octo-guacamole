// Admin Categories API

import apiClient from '../client';
import { ApiResponse } from '@/types/product';
import type { CategoryDTO } from '@/types/product';
import type { CreateCategoryRequest, UpdateCategoryRequest } from '@/types/category';

/**
 * Get all categories (admin view)
 * GET /api/v1/admin/categories
 */
export async function getAdminCategories(): Promise<CategoryDTO[]> {
  const response = await apiClient.get<ApiResponse<CategoryDTO[]>>('/admin/categories');
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể lấy danh sách danh mục');
  }
  
  return response.data.data;
}

/**
 * Get category tree
 * GET /api/v1/admin/categories/tree
 */
export async function getAdminCategoryTree(): Promise<CategoryDTO[]> {
  const response = await apiClient.get<ApiResponse<CategoryDTO[]>>('/admin/categories/tree');
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể lấy cây danh mục');
  }
  
  return response.data.data;
}

/**
 * Get single category by ID
 * GET /api/v1/admin/categories/{id}
 */
export async function getAdminCategory(id: number): Promise<CategoryDTO> {
  const response = await apiClient.get<ApiResponse<CategoryDTO>>(`/admin/categories/${id}`);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể lấy thông tin danh mục');
  }
  
  return response.data.data;
}

/**
 * Create new category
 * POST /api/v1/admin/categories
 */
export async function createCategory(data: CreateCategoryRequest): Promise<CategoryDTO> {
  const response = await apiClient.post<ApiResponse<CategoryDTO>>('/admin/categories', data);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể tạo danh mục');
  }
  
  return response.data.data;
}

/**
 * Update category
 * PUT /api/v1/admin/categories/{id}
 */
export async function updateCategory(id: number, data: UpdateCategoryRequest): Promise<CategoryDTO> {
  const response = await apiClient.put<ApiResponse<CategoryDTO>>(`/admin/categories/${id}`, data);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể cập nhật danh mục');
  }
  
  return response.data.data;
}

/**
 * Delete category (soft delete)
 * DELETE /api/v1/admin/categories/{id}
 */
export async function deleteCategory(id: number): Promise<void> {
  const response = await apiClient.delete<ApiResponse<void>>(`/admin/categories/${id}`);
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể xóa danh mục');
  }
}
