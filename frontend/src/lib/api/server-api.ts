// Server-safe API functions for Server Components
// These functions use native fetch instead of axios to avoid client-side dependencies

import { ApiResponse, ProductDTO, CategoryDTO } from '@/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * Server-safe fetch wrapper with error handling
 */
async function serverFetch<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Cache for 60 seconds to avoid repeated requests during build/static generation
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error(`[Server API Error] ${response.status} ${url}`);
      return null;
    }

    const data: ApiResponse<T> = await response.json();
    
    if (!data.success) {
      console.error(`[Server API Error] ${url}: ${data.message}`);
      return null;
    }

    return data.data;
  } catch (error) {
    console.error(`[Server API Error] ${url}:`, error);
    return null;
  }
}

/**
 * Fetch newest products for homepage
 * GET /api/v1/public/products/newest?limit={limit}
 */
export async function fetchNewestProducts(limit: number = 4): Promise<ProductDTO[]> {
  const data = await serverFetch<ProductDTO[]>(`/public/products/newest?limit=${limit}`);
  return data || [];
}

/**
 * Fetch top selling products for homepage
 * GET /api/v1/public/products/top-selling?limit={limit}
 */
export async function fetchTopSellingProducts(limit: number = 4): Promise<ProductDTO[]> {
  const data = await serverFetch<ProductDTO[]>(`/public/products/top-selling?limit=${limit}`);
  return data || [];
}

/**
 * Fetch all active categories
 * GET /api/v1/public/categories
 */
export async function fetchCategories(): Promise<CategoryDTO[]> {
  const data = await serverFetch<CategoryDTO[]>(`/public/categories`);
  if (!data) return [];
  
  // Filter active categories with no parent (root categories)
  return data.filter((cat) => cat.isActive && cat.parentId === null);
}

/**
 * Fetch categories as tree structure
 * GET /api/v1/public/categories/tree
 */
export async function fetchCategoryTree(): Promise<CategoryDTO[]> {
  const data = await serverFetch<CategoryDTO[]>(`/public/categories/tree`);
  return data || [];
}

/**
 * Fetch single product by slug
 * GET /api/v1/public/products/{slug}
 */
export async function fetchProductBySlug(slug: string): Promise<ProductDTO | null> {
  return await serverFetch<ProductDTO>(`/public/products/${slug}`);
}

/**
 * Fetch products with pagination and filters
 * GET /api/v1/public/products?page=0&size=12&...
 */
export async function fetchProducts(params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
  categoryId?: number | number[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}): Promise<{
  content: ProductDTO[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}> {
  const queryParams = new URLSearchParams();
  
  if (params.page !== undefined) queryParams.append('page', params.page.toString());
  if (params.size !== undefined) queryParams.append('size', params.size.toString());
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortDir) queryParams.append('sortDir', params.sortDir);
  if (params.categoryId) {
    if (Array.isArray(params.categoryId)) {
      params.categoryId.forEach(id => queryParams.append('categoryId', id.toString()));
    } else {
      queryParams.append('categoryId', params.categoryId.toString());
    }
  }
  if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
  if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());
  if (params.search) queryParams.append('search', params.search);

  const data = await serverFetch<{
    content: ProductDTO[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    size: number;
  }>(`/public/products?${queryParams.toString()}`);

  return data || {
    content: [],
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    size: 12,
  };
}

/**
 * Fetch all products at once
 * GET /api/v1/public/products?size=100&...
 */
export async function fetchAllProducts(): Promise<ProductDTO[]> {
  const data = await serverFetch<{
    content: ProductDTO[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    size: number;
  }>(`/public/products?size=100&sortBy=createdAt&sortDir=desc`);

  return data?.content || [];
}
