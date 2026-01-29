// Product Types
export interface ProductImage {
  id: number;
  imageUrl: string;
  altText?: string;
  displayOrder: number;
}

export interface ProductVariant {
  id: number;
  sku: string;
  color?: string;
  size?: string;
  stockQuantity: number;
  priceAdjustment: number;
  finalPrice: number;
  isAvailable: boolean;
  inStock: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  categoryId: number;
  categoryName?: string;
  isVisible: boolean;
  soldCount?: number;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: number;
  children?: Category[];
  productCount?: number;
}

// Cart Types
export interface CartItem {
  id: number;
  variantId?: number;
  productName: string;
  color?: string;
  size?: string;
  sku?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  imageUrl?: string;
}

export interface Cart {
  id: number;
  userId?: number;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  createdAt?: string;
  updatedAt?: string;
}

// Order Types
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
export type PaymentMethod = 'COD' | 'BANK_TRANSFER';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface OrderItem {
  id: number;
  productNameSnapshot: string;
  variantInfoSnapshot: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id: number;
  orderCode: string;
  userId: number;
  customerName?: string;
  customerEmail?: string;
  status: OrderStatus;
  total: number;
  shippingAddress: string;
  phone: string;
  note?: string;
  items: OrderItem[];
  totalItems?: number;
  createdAt: string;
  updatedAt: string;
}

// User Types
export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  role: 'CUSTOMER' | 'ADMIN';
}

// Auth Types
export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Filter Types
export interface ProductFilter {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'bestselling';
  page?: number;
  size?: number;
}
