// Product Types
export interface ProductImage {
  id: number;
  imageUrl: string;
  altText?: string;
  displayOrder: number;
}

export interface ProductVariant {
  id: number;
  size?: string;
  color?: string;
  colorCode?: string;
  sku: string;
  priceAdjustment: number;
  quantity: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  salePrice?: number;
  categoryId: number;
  categoryName?: string;
  isActive: boolean;
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
  productId: number;
  productName: string;
  productSlug: string;
  productImage?: string;
  variantId?: number;
  size?: string;
  color?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

// Order Types
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethod = 'COD' | 'BANK_TRANSFER';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  variantId?: number;
  size?: string;
  color?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  status: OrderStatus;
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  note?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
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
