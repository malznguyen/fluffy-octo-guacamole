import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, Category, ProductFilter, PageResponse } from '@/types';
import apiClient from '@/lib/axios';

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
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  if (filters?.page !== undefined) params.append('page', filters.page.toString());
  if (filters?.size) params.append('size', filters.size.toString());
  
  const response = await apiClient.get<PageResponse<Product>>(`/api/v1/products?${params}`);
  return response.data;
};

const fetchProductBySlug = async (slug: string): Promise<Product> => {
  const response = await apiClient.get<Product>(`/api/v1/products/${slug}`);
  return response.data;
};

const fetchTopSellingProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get<Product[]>('/api/v1/products/top-selling');
  return response.data;
};

const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<Category[]>('/api/v1/categories');
  return response.data;
};

const fetchCategoryTree = async (): Promise<Category[]> => {
  const response = await apiClient.get<Category[]>('/api/v1/categories/tree');
  return response.data;
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
