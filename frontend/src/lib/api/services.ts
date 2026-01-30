import { apiClient } from './client';
import {
  CategoryDTO,
  ProductDTO,
  CartDTO,
  CartItemDTO,
  AddToCartRequest,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserResponse,
  PageResponse,
  ProductQueryParams,
} from './types';

// Public Services
export const publicApi = {
  // Categories
  getCategories: (): Promise<CategoryDTO[]> =>
    apiClient.get<CategoryDTO[]>('/public/categories/tree'),

  getFlatCategories: (): Promise<CategoryDTO[]> =>
    apiClient.get<CategoryDTO[]>('/public/categories'),

  // Products
  getTopSellingProducts: (): Promise<ProductDTO[]> =>
    apiClient.get<ProductDTO[]>('/public/products/top-selling'),

  getProducts: (params?: { category?: string; page?: number; size?: number }): Promise<ProductDTO[]> =>
    apiClient.get<ProductDTO[]>('/public/products', params),

  getProductBySlug: (slug: string): Promise<ProductDTO> =>
    apiClient.get<ProductDTO>(`/public/products/${slug}`),

  // Paginated Products for Shop Page
  getProductsPaginated: (params?: ProductQueryParams): Promise<PageResponse<ProductDTO>> =>
    apiClient.get<PageResponse<ProductDTO>>('/public/products', params),
};

// Cart Services
export const cartApi = {
  getCart: (): Promise<CartDTO> =>
    apiClient.get<CartDTO>('/cart'),

  addToCart: (request: AddToCartRequest): Promise<CartItemDTO> =>
    apiClient.post<CartItemDTO>('/cart/items', request),

  updateCartItem: (itemId: number, quantity: number): Promise<CartItemDTO> =>
    apiClient.put<CartItemDTO>(`/cart/items/${itemId}`, { quantity }),

  removeCartItem: (itemId: number): Promise<void> =>
    apiClient.delete<void>(`/cart/items/${itemId}`),

  clearCart: (): Promise<void> =>
    apiClient.delete<void>('/cart'),
};

// Auth Services
export const authApi = {
  login: (request: LoginRequest): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>('/auth/login', request),

  register: (request: RegisterRequest): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>('/auth/register', request),

  getProfile: (): Promise<UserResponse> =>
    apiClient.get<UserResponse>('/users/me'),

  updateProfile: (data: Partial<UserResponse>): Promise<UserResponse> =>
    apiClient.put<UserResponse>('/users/profile', data),
};
