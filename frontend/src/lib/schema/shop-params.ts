import { z } from 'zod';

export const SortOption = {
  NEWEST: 'newest',
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  BEST_SELLING: 'best_selling',
} as const;

export type SortOptionType = typeof SortOption[keyof typeof SortOption];

export const shopParamsSchema = z.object({
  page: z.coerce.number().default(1),
  size: z.coerce.number().default(12),
  sort: z.enum([
    SortOption.NEWEST,
    SortOption.PRICE_ASC,
    SortOption.PRICE_DESC,
    SortOption.BEST_SELLING,
  ]).default(SortOption.NEWEST),
  categoryId: z.coerce.number().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  search: z.string().optional(),
});

export type ShopParams = z.infer<typeof shopParamsSchema>;

export const sortLabels: Record<SortOptionType, string> = {
  [SortOption.NEWEST]: 'Mới Nhất',
  [SortOption.PRICE_ASC]: 'Giá: Thấp - Cao',
  [SortOption.PRICE_DESC]: 'Giá: Cao - Thấp',
  [SortOption.BEST_SELLING]: 'Bán Chạy',
};

export interface ProductPageResponse {
  content: ProductPageItem[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ProductPageItem {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  salePrice?: number;
  categoryId: number;
  categoryName: string;
  imageUrl?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
}
