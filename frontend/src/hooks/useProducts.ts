"use client";

import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/lib/api/services";
import { Product } from "@/lib/api/types";

export const productKeys = {
  all: ["products"] as const,
  topSelling: () => [...productKeys.all, "top-selling"] as const,
  newest: () => [...productKeys.all, "newest"] as const,
  list: (params?: Record<string, unknown>) => [...productKeys.all, "list", params] as const,
  detail: (slug: string) => [...productKeys.all, "detail", slug] as const,
};

export function useTopSellingProducts() {
  return useQuery<Product[], Error>({
    queryKey: productKeys.topSelling(),
    queryFn: productApi.getTopSelling,
    staleTime: 5 * 60 * 1000,
  });
}

export function useNewestProducts() {
  return useQuery<Product[], Error>({
    queryKey: productKeys.newest(),
    queryFn: productApi.getNewest,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductBySlug(slug: string) {
  return useQuery<Product, Error>({
    queryKey: productKeys.detail(slug),
    queryFn: () => productApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProducts(params?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  size?: number;
}) {
  return useQuery<{
    content: Product[];
    totalPages: number;
    totalElements: number;
  }, Error>({
    queryKey: productKeys.list(params),
    queryFn: () => productApi.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
}
