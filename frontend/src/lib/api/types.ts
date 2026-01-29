// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Category Types
export interface CategoryDTO {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: number;
  children?: CategoryDTO[];
}

// Product Types
export interface ProductDTO {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  salePrice?: number;
  categoryId: number;
  categoryName: string;
  images: ProductImageDTO[];
  variants: ProductVariantDTO[];
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
}

export interface ProductImageDTO {
  id: number;
  url: string;
  alt?: string;
  isPrimary: boolean;
}

export interface ProductVariantDTO {
  id: number;
  size?: string;
  color?: string;
  stockQuantity: number;
}

// Cart Types
export interface CartDTO {
  id: number;
  items: CartItemDTO[];
  totalAmount: number;
  totalItems: number;
}

export interface CartItemDTO {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  variantId?: number;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface AddToCartRequest {
  productId: number;
  variantId?: number;
  quantity: number;
}

// User Types
export interface UserResponse {
  id: number;
  email: string;
  fullName?: string;
  phone?: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName?: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}
