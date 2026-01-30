// Custom hooks for product management using TanStack Query

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';
import {
  ProductDTO,
  CategoryDTO,
  CreateProductRequest,
  UpdateProductRequest,
  ImageUploadResponse,
  ApiResponse,
} from '@/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

// Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  tree: () => [...categoryKeys.all, 'tree'] as const,
};

// Fetch all products (admin)
async function fetchAdminProducts(): Promise<ProductDTO[]> {
  const response = await apiClient.get<ApiResponse<ProductDTO[]>>('/admin/products');
  if (response.data.success) {
    // Đảm bảo variants và images luôn là mảng
    return (response.data.data || []).map(product => ({
      ...product,
      variants: product.variants || [],
      images: product.images || [],
    }));
  }
  throw new Error(response.data.message || 'Không thể tải danh sách sản phẩm');
}

// Fetch single product (admin)
async function fetchAdminProduct(id: number): Promise<ProductDTO> {
  const response = await apiClient.get<ApiResponse<ProductDTO>>(`/admin/products/${id}`);
  if (response.data.success) {
    const product = response.data.data;
    // Đảm bảo variants và images luôn là mảng
    return {
      ...product,
      variants: product.variants || [],
      images: product.images || [],
    };
  }
  throw new Error(response.data.message || 'Không thể tải thông tin sản phẩm');
}

// Create product
async function createProduct(data: CreateProductRequest): Promise<ProductDTO> {
  const response = await apiClient.post<ApiResponse<ProductDTO>>('/admin/products', data);
  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'Không thể tạo sản phẩm');
}

// Update product
async function updateProduct(id: number, data: UpdateProductRequest): Promise<ProductDTO> {
  const response = await apiClient.put<ApiResponse<ProductDTO>>(`/admin/products/${id}`, data);
  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'Không thể cập nhật sản phẩm');
}

// Delete product (soft delete)
async function deleteProduct(id: number): Promise<void> {
  const response = await apiClient.delete<ApiResponse<void>>(`/admin/products/${id}`);
  if (!response.data.success) {
    throw new Error(response.data.message || 'Không thể xóa sản phẩm');
  }
}

// Upload image
async function uploadImage(file: File): Promise<ImageUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<ApiResponse<ImageUploadResponse>>(
    '/admin/products/upload-image',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'Không thể tải ảnh lên');
}

// Fetch categories
async function fetchCategories(): Promise<CategoryDTO[]> {
  const response = await apiClient.get<ApiResponse<CategoryDTO[]>>('/public/categories');
  if (response.data.success) {
    return (response.data.data || []).filter((cat) => cat.isActive);
  }
  throw new Error(response.data.message || 'Không thể tải danh sách danh mục');
}

// Hooks
export function useAdminProducts() {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: fetchAdminProducts,
  });
}

export function useAdminProduct(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchAdminProduct(id),
    enabled: id > 0,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: fetchCategories,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('Tạo sản phẩm thành công');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi tạo sản phẩm');
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductRequest }) =>
      updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      toast.success('Cập nhật sản phẩm thành công');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật sản phẩm');
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('Xóa sản phẩm thành công');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa sản phẩm');
    },
  });
}

export function useUploadImage() {
  return useMutation({
    mutationFn: uploadImage,
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi tải ảnh lên');
    },
  });
}
