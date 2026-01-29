import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, Category, ProductFilter, PageResponse } from '@/types';
import apiClient from '@/lib/axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PageResponsePayload<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

// Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilter) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
  topSelling: () => [...productKeys.all, 'top-selling'] as const,
};

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  tree: () => [...categoryKeys.all, 'tree'] as const,
};

// API functions
const fetchProducts = async (filters?: ProductFilter): Promise<PageResponse<Product>> => {
  const params = new URLSearchParams();
  
  if (filters?.categoryId) params.append('categoryId', filters.categoryId.toString());
  if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
  if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
  if (filters?.sortBy) {
    const sortMapping: Record<NonNullable<ProductFilter['sortBy']>, { sortBy: string; sortDir: string }> = {
      newest: { sortBy: 'createdAt', sortDir: 'desc' },
      price_asc: { sortBy: 'basePrice', sortDir: 'asc' },
      price_desc: { sortBy: 'basePrice', sortDir: 'desc' },
      bestselling: { sortBy: 'soldCount', sortDir: 'desc' },
    };
    const mapped = sortMapping[filters.sortBy];
    params.append('sortBy', mapped.sortBy);
    params.append('sortDir', mapped.sortDir);
  }
  if (filters?.page !== undefined) params.append('page', filters.page.toString());
  if (filters?.size) params.append('size', filters.size.toString());
  
  const response = await apiClient.get<ApiResponse<PageResponsePayload<Product>>>(`/api/v1/public/products?${params}`);
  const payload = response.data.data;
  return {
    content: payload.content,
    totalElements: payload.totalElements,
    totalPages: payload.totalPages,
    size: payload.size,
    number: payload.currentPage,
  };
};

const fetchProductBySlug = async (slug: string): Promise<Product> => {
  const response = await apiClient.get<ApiResponse<Product>>(`/api/v1/public/products/${slug}`);
  return response.data.data;
};

const fetchTopSellingProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get<ApiResponse<Product[]>>('/api/v1/public/products/top-selling');
  return response.data.data;
};

const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<ApiResponse<Category[]>>('/api/v1/public/categories');
  return response.data.data;
};

const fetchCategoryTree = async (): Promise<Category[]> => {
  const response = await apiClient.get<ApiResponse<Category[]>>('/api/v1/public/categories/tree');
  return response.data.data;
};

// Hooks
export function useProducts(filters?: ProductFilter) {
  return useQuery({
    queryKey: productKeys.list(filters || {}),
    queryFn: () => fetchProducts(filters),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => fetchProductBySlug(slug),
    enabled: !!slug,
  });
}

export function useTopSellingProducts() {
  return useQuery({
    queryKey: productKeys.topSelling(),
    queryFn: fetchTopSellingProducts,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: fetchCategories,
  });
}

export function useCategoryTree() {
  return useQuery({
    queryKey: categoryKeys.tree(),
    queryFn: fetchCategoryTree,
  });
}
