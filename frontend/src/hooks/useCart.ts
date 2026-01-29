import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Cart } from '@/types';
import apiClient from '@/lib/axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Query keys
export const cartKeys = {
  all: ['cart'] as const,
  detail: () => [...cartKeys.all, 'detail'] as const,
};

// API functions
const fetchCart = async (): Promise<Cart> => {
  const response = await apiClient.get<ApiResponse<Cart>>('/api/v1/cart');
  return response.data.data;
};

const addToCart = async (data: { 
  productId: number; 
  variantId: number; 
  quantity: number 
}): Promise<Cart> => {
  const response = await apiClient.post<ApiResponse<Cart>>('/api/v1/cart/items', data);
  return response.data.data;
};

const updateCartItem = async ({
  itemId,
  quantity,
}: {
  itemId: number;
  quantity: number;
}): Promise<Cart> => {
  const response = await apiClient.put<ApiResponse<Cart>>(`/api/v1/cart/items/${itemId}`, { quantity });
  return response.data.data;
};

const removeCartItem = async (itemId: number): Promise<Cart> => {
  const response = await apiClient.delete<ApiResponse<Cart>>(`/api/v1/cart/items/${itemId}`);
  return response.data.data;
};

const clearCart = async (): Promise<void> => {
  await apiClient.delete('/api/v1/cart');
};

// Hooks
export function useCart() {
  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: fetchCart,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
}
