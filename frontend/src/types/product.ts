// Product-related type definitions matching API DTOs

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Pagination response
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

// Category DTO
export interface CategoryDTO {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parentId: number | null;
  parentName: string | null;
  sortOrder: number;
  isActive: boolean;
  children: CategoryDTO[];
}

// Product Image DTO
export interface ProductImageDTO {
  id: number;
  imageUrl: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
}

// Product Variant DTO
export interface ProductVariantDTO {
  id: number;
  sku: string;
  color: string;
  size: string;
  stockQuantity: number;
  priceAdjustment: number;
  finalPrice: number;
  isAvailable: boolean;
  inStock: boolean;
}

// Product DTO
export interface ProductDTO {
  id: number;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  categoryId: number;
  categoryName: string;
  isVisible: boolean;
  soldCount: number;
  createdAt: string;
  updatedAt: string;
  images: ProductImageDTO[];
  variants: ProductVariantDTO[];
}

// Legacy types for backward compatibility
export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  color: string;
  stock: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  category?: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}
