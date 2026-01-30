// API functions for public endpoints

import apiClient from './axios'
import { ApiResponse, ProductDTO, CategoryDTO } from '@/types/product'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'

/**
 * Fetch newest products for homepage
 * GET /api/v1/public/products/newest?limit={limit}
 */
export async function fetchNewestProducts(limit: number = 4): Promise<ProductDTO[]> {
  try {
    const response = await apiClient.get<ApiResponse<ProductDTO[]>>(
      `/public/products/newest?limit=${limit}`
    )
    if (response.data.success) {
      return response.data.data
    }
    throw new Error(response.data.message || 'Failed to fetch newest products')
  } catch (error) {
    console.error('Error fetching newest products:', error)
    return []
  }
}

/**
 * Fetch top selling products for homepage
 * GET /api/v1/public/products/top-selling?limit={limit}
 */
export async function fetchTopSellingProducts(limit: number = 4): Promise<ProductDTO[]> {
  try {
    const response = await apiClient.get<ApiResponse<ProductDTO[]>>(
      `/public/products/top-selling?limit=${limit}`
    )
    if (response.data.success) {
      return response.data.data
    }
    throw new Error(response.data.message || 'Failed to fetch top selling products')
  } catch (error) {
    console.error('Error fetching top selling products:', error)
    return []
  }
}

/**
 * Fetch all active categories
 * GET /api/v1/public/categories
 */
export async function fetchCategories(): Promise<CategoryDTO[]> {
  try {
    const response = await apiClient.get<ApiResponse<CategoryDTO[]>>(
      `/public/categories`
    )
    if (response.data.success) {
      // Filter active categories with no parent (root categories)
      return response.data.data.filter(
        (cat) => cat.isActive && cat.parentId === null
      )
    }
    throw new Error(response.data.message || 'Failed to fetch categories')
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

/**
 * Fetch categories as tree structure
 * GET /api/v1/public/categories/tree
 */
export async function fetchCategoryTree(): Promise<CategoryDTO[]> {
  try {
    const response = await apiClient.get<ApiResponse<CategoryDTO[]>>(
      `/public/categories/tree`
    )
    if (response.data.success) {
      return response.data.data
    }
    throw new Error(response.data.message || 'Failed to fetch category tree')
  } catch (error) {
    console.error('Error fetching category tree:', error)
    return []
  }
}

/**
 * Fetch products with pagination and filters
 * GET /api/v1/public/products?page=0&size=12&sortBy=createdAt&sortDir=desc&categoryId=1&minPrice=100000&maxPrice=500000&search=ao
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
  try {
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

    const response = await apiClient.get<ApiResponse<{
      content: ProductDTO[];
      totalElements: number;
      totalPages: number;
      currentPage: number;
      size: number;
    }>>(`/public/products?${queryParams.toString()}`);

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch products');
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      currentPage: 0,
      size: 12,
    };
  }
}

/**
 * Fetch all products at once for client-side filtering
 * GET /api/v1/public/products?size=100&sortBy=createdAt&sortDir=desc
 */
export async function fetchAllProducts(): Promise<ProductDTO[]> {
  try {
    const response = await apiClient.get<ApiResponse<{
      content: ProductDTO[];
      totalElements: number;
      totalPages: number;
      currentPage: number;
      size: number;
    }>>(`/public/products?size=100&sortBy=createdAt&sortDir=desc`);

    if (response.data.success) {
      return response.data.data.content;
    }
    throw new Error(response.data.message || 'Failed to fetch products');
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
}

/**
 * Fetch single product by slug
 * GET /api/v1/public/products/{slug}
 */
export async function fetchProductBySlug(slug: string): Promise<ProductDTO | null> {
  try {
    const response = await apiClient.get<ApiResponse<ProductDTO>>(
      `/public/products/${slug}`
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch product');
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}
