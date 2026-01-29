'use client';

import { useQuery } from '@tanstack/react-query';
import { getTopSellingProducts, getNewestProducts, getCategoryTree, getProductBySlug } from '@/lib/api';
import type { Product, Category } from '@/types';

// ===========================================
// Product Hooks
// ===========================================

export function useTopSellingProducts(limit: number = 8) {
    return useQuery<Product[], Error>({
        queryKey: ['products', 'top-selling', limit],
        queryFn: () => getTopSellingProducts(limit),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useNewestProducts(limit: number = 8) {
    return useQuery<Product[], Error>({
        queryKey: ['products', 'newest', limit],
        queryFn: () => getNewestProducts(limit),
        staleTime: 5 * 60 * 1000,
    });
}

export function useProductBySlug(slug: string) {
    return useQuery<Product, Error>({
        queryKey: ['product', slug],
        queryFn: () => getProductBySlug(slug),
        enabled: !!slug,
    });
}

// ===========================================
// Category Hooks
// ===========================================

export function useCategoryTree() {
    return useQuery<Category[], Error>({
        queryKey: ['categories', 'tree'],
        queryFn: () => getCategoryTree(),
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}
