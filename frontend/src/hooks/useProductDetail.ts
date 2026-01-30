'use client';

import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/lib/api/services';
import { ProductDTO } from '@/lib/api/types';

const PRODUCT_DETAIL_KEY = 'product-detail';

export function useProductDetail(slug: string) {
    return useQuery<ProductDTO, Error>({
        queryKey: [PRODUCT_DETAIL_KEY, slug],
        queryFn: () => publicApi.getProductBySlug(slug),
        enabled: !!slug,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
