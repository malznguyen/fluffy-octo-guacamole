// Custom hooks for product management using TanStack Query

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as productApi from '@/lib/api/admin/products';
import * as publicApi from '@/lib/api/public';
import type { ProductDTO, CategoryDTO, CreateProductRequest, UpdateProductRequest } from '@/types/product';

// Re-export types for convenience
export type { ProductDTO, CategoryDTO, CreateProductRequest, UpdateProductRequest } from '@/types/product';



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

// Hooks for admin products
export function useAdminProducts() {
  return useQuery<ProductDTO[], Error>({
    queryKey: productKeys.lists(),
    queryFn: async () => {
      const products = await productApi.getAdminProducts();
      // Đảm bảo variants và images luôn là mảng
      return products.map(product => ({
        ...product,
        variants: product.variants || [],
        images: product.images || [],
      }));
    },
  });
}

export function useAdminProduct(id: number) {
  return useQuery<ProductDTO, Error>({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const product = await productApi.getAdminProduct(id);
      // Đảm bảo variants và images luôn là mảng
      return {
        ...product,
        variants: product.variants || [],
        images: product.images || [],
      };
    },
    enabled: id > 0,
  });
}

// Hook for public categories
export function useCategories() {
  return useQuery<CategoryDTO[], Error>({
    queryKey: categoryKeys.lists(),
    queryFn: publicApi.fetchCategories,
  });
}

// Hook for category tree
export function useCategoryTree() {
  return useQuery<CategoryDTO[], Error>({
    queryKey: categoryKeys.tree(),
    queryFn: publicApi.fetchCategoryTree,
  });
}

// Mutations
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation<ProductDTO, Error, CreateProductRequest>({
    mutationFn: productApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('Tạo sản phẩm thành công');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tạo sản phẩm';
      toast.error(message);
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation<ProductDTO, Error, { id: number; data: UpdateProductRequest }>({
    mutationFn: ({ id, data }) => productApi.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      toast.success('Cập nhật sản phẩm thành công');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi cập nhật sản phẩm';
      toast.error(message);
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: productApi.deleteProduct,
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
  return useMutation<{ filename: string; url: string }, Error, File>({
    mutationFn: productApi.uploadImage,
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi tải ảnh lên');
    },
  });
}
