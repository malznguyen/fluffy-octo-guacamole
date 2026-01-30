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
  basePrice: number;
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
  imageUrl: string;
  alt?: string;
  isPrimary: boolean;
}

export interface ProductVariantDTO {
  id: number;
  size?: string;
  color?: string;
  stockQuantity: number;
  finalPrice: number;
  isAvailable: boolean;
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
  avatarUrl?: string;
  role: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
}

export interface AuthPayload {
  id: number;
  email: string;
  fullName?: string;
  role: string;
  token: string;
}

export type AuthResponse = AuthPayload;

// Pagination Types
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  currentPage: number;
}

export interface ProductQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  [key: string]: unknown;
}

// Order Types
export interface CreateOrderRequest {
  shippingAddress: string;
  phone: string; // Regex: ^[0-9]{10,15}$
  note?: string;
  paymentMethod: 'COD' | 'BANK_TRANSFER';
}

export interface OrderDTO {
  id: number;
  orderCode: string;
  status: string;
  totalAmount: number;
  total?: number;
  shippingAddress: string;
  phone: string;
  note?: string;
  paymentMethod: string;
  paymentStatus?: string;
  recipientName?: string;
  customerName?: string;
  customerEmail?: string;
  createdAt: string;
  updatedAt?: string;
  items: OrderItemDTO[];
  orderItems?: OrderItemDTO[];
}

export interface OrderItemDTO {
  id: number;
  productId?: number;
  productName?: string;
  productNameSnapshot?: string;
  productImage?: string;
  variantId?: number;
  size?: string;
  color?: string;
  variantInfo?: string;
  variantInfoSnapshot?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  orderCode: string; // Backend returns this at top level
  data: OrderDTO;    // The Order Object
}

// Order List Response (Paginated)
export interface OrderResponse {
  content: OrderDTO[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}
