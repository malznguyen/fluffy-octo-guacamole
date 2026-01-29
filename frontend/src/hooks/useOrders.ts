import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Order, PaymentMethod, PageResponse } from '@/types';
import apiClient from '@/lib/axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PageResponsePayload<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

// Query keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (page: number, size: number) => [...orderKeys.lists(), page, size] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (orderCode: string) => [...orderKeys.details(), orderCode] as const,
};

// API functions
const fetchOrders = async (page: number = 0, size: number = 10): Promise<PageResponse<Order>> => {
  const response = await apiClient.get<ApiResponse<PageResponsePayload<Order>>>(`/api/v1/orders?page=${page}&size=${size}`);
  const payload = response.data.data;
  return {
    content: payload.content,
    totalElements: payload.totalElements,
    totalPages: payload.totalPages,
    size: payload.size,
    number: payload.currentPage,
  };
};

const fetchOrderByCode = async (orderCode: string): Promise<Order> => {
  const response = await apiClient.get<ApiResponse<Order>>(`/api/v1/orders/${orderCode}`);
  return response.data.data;
};

interface CreateOrderData {
  shippingAddress: string;
  phone: string;
  note?: string;
  paymentMethod: PaymentMethod;
}

const createOrder = async (data: CreateOrderData): Promise<Order> => {
  const response = await apiClient.post<ApiResponse<Order>>('/api/v1/orders', data);
  return response.data.data;
};

const cancelOrder = async (orderCode: string): Promise<void> => {
  await apiClient.post(`/api/v1/orders/${orderCode}/cancel`);
};

// Hooks
export function useOrders(page: number = 0, size: number = 10) {
  return useQuery({
    queryKey: orderKeys.list(page, size),
    queryFn: () => fetchOrders(page, size),
  });
}

export function useOrder(orderCode: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderCode),
    queryFn: () => fetchOrderByCode(orderCode),
    enabled: !!orderCode,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}
