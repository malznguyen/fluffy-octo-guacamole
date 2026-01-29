import { apiClient } from "./client";
import { Category, Product, Cart, User } from "./types";

// Category APIs
export const categoryApi = {
  getTree: async (): Promise<Category[]> => {
    const response = await apiClient.get("/public/categories/tree");
    return response.data;
  },
  
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get("/public/categories");
    return response.data;
  },
};

// Product APIs
export const productApi = {
  getTopSelling: async (): Promise<Product[]> => {
    const response = await apiClient.get("/public/products/top-selling");
    return response.data;
  },
  
  getNewest: async (): Promise<Product[]> => {
    const response = await apiClient.get("/public/products/newest");
    return response.data;
  },
  
  getAll: async (params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    page?: number;
    size?: number;
  }): Promise<{ content: Product[]; totalPages: number; totalElements: number }> => {
    const response = await apiClient.get("/public/products", { params });
    return response.data;
  },
  
  getBySlug: async (slug: string): Promise<Product> => {
    const response = await apiClient.get(`/public/products/${slug}`);
    return response.data;
  },
};

// Cart APIs
export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get("/cart");
    return response.data;
  },
  
  addItem: async (data: {
    productId: number;
    variantId?: number;
    quantity: number;
  }): Promise<Cart> => {
    const response = await apiClient.post("/cart/items", data);
    return response.data;
  },
  
  updateItem: async (itemId: number, quantity: number): Promise<Cart> => {
    const response = await apiClient.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  },
  
  removeItem: async (itemId: number): Promise<Cart> => {
    const response = await apiClient.delete(`/cart/items/${itemId}`);
    return response.data;
  },
};

// Auth APIs
export const authApi = {
  login: async (data: { email: string; password: string }): Promise<{ token: string; user: User }> => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },
  
  register: async (data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
  }): Promise<{ token: string; user: User }> => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },
  
  getMe: async (): Promise<User> => {
    const response = await apiClient.get("/users/me");
    return response.data;
  },
};

// Order APIs
export const orderApi = {
  getMyOrders: async (): Promise<import("./types").Order[]> => {
    const response = await apiClient.get("/orders");
    return response.data;
  },
  
  getOrderByCode: async (orderCode: string): Promise<import("./types").Order> => {
    const response = await apiClient.get(`/orders/${orderCode}`);
    return response.data;
  },
  
  createOrder: async (data: {
    shippingAddress: string;
    paymentMethod: "COD" | "BANK_TRANSFER";
  }): Promise<import("./types").Order> => {
    const response = await apiClient.post("/orders", data);
    return response.data;
  },
};
