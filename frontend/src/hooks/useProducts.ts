'use client';

import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/lib/api/services';
import { ProductDTO } from '@/lib/api/types';

const PRODUCTS_KEY = 'products';

export function useTopSellingProducts() {
  return useQuery<ProductDTO[], Error>({
    queryKey: [PRODUCTS_KEY, 'top-selling'],
    queryFn: () => publicApi.getTopSellingProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProducts(params?: { category?: string; page?: number; size?: number }) {
  return useQuery<ProductDTO[], Error>({
    queryKey: [PRODUCTS_KEY, params],
    queryFn: () => publicApi.getProducts(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(slug: string) {
  return useQuery<ProductDTO, Error>({
    queryKey: [PRODUCTS_KEY, slug],
    queryFn: () => publicApi.getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}
