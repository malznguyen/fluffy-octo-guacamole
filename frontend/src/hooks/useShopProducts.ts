'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { publicApi } from '@/lib/api/services';
import { ProductDTO, PageResponse, CategoryDTO } from '@/lib/api/types';

const SHOP_PRODUCTS_KEY = 'shop-products';

// Frontend sort values to backend sortBy/sortDir mapping
function mapSortBy(sort?: string): string {
  switch (sort) {
    case 'price_asc':
    case 'price_desc':
      return 'basePrice';
    case 'best_selling':
      return 'salesCount';
    case 'newest':
    default:
      return 'createdAt';
  }
}

function mapSortDir(sort?: string): string {
  if (sort?.endsWith('_asc')) {
    return 'asc';
  }
  return 'desc';
}

// Extended params interface with sort mapping
interface ShopProductParams {
  page?: number;
  size?: number;
  sort?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export function useShopProducts(params?: ShopProductParams) {
  return useQuery<PageResponse<ProductDTO>, Error>({
    queryKey: [SHOP_PRODUCTS_KEY, params],
    queryFn: async () => {
      // Map frontend params to backend params
      const backendParams: Record<string, unknown> = {
        page: (params?.page ?? 1) - 1, // Convert 1-based to 0-based
        size: params?.size ?? 12,
      };

      // Map sort to sortBy and sortDir
      if (params?.sort) {
        backendParams.sortBy = mapSortBy(params.sort);
        backendParams.sortDir = mapSortDir(params.sort);
      }

      // Add other filter params if present
      if (params?.categoryId) {
        backendParams.categoryId = params.categoryId;
      }
      if (params?.minPrice !== undefined) {
        backendParams.minPrice = params.minPrice;
      }
      if (params?.maxPrice !== undefined) {
        backendParams.maxPrice = params.maxPrice;
      }
      if (params?.search) {
        backendParams.search = params.search;
      }

      // Make direct API call to handle the raw response
      const response = await apiClient.get<PageResponse<ProductDTO>>('/public/products', backendParams);
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData, // keepPreviousData equivalent
  });
}

export function useFlatCategories() {
  return useQuery<CategoryDTO[], Error>({
    queryKey: ['flat-categories'],
    queryFn: () => publicApi.getFlatCategories(),
    staleTime: 5 * 60 * 1000,
  });
}
