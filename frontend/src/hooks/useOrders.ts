import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Order, OrderStatus, PaymentMethod, PageResponse } from '@/types';
import apiClient from '@/lib/axios';

// Query keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (page: number, size: number) => [...orderKeys.lists(), page, size] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: number) => [...orderKeys.details(), id] as const,
};

// API functions
const fetchOrders = async (page: number = 0, size: number = 10): Promise<PageResponse<Order>> => {
  const response = await apiClient.get<PageResponse<Order>>(`/api/v1/orders?page=${page}&size=${size}`);
  return response.data;
};

const fetchOrderById = async (id: number): Promise<Order> => {
  const response = await apiClient.get<Order>(`/api/v1/orders/${id}`);
  return response.data;
};

interface CreateOrderData {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  note?: string;
  paymentMethod: PaymentMethod;
}

const createOrder = async (data: CreateOrderData): Promise<Order> => {
  const response = await apiClient.post<Order>('/api/v1/orders', data);
  return response.data;
};

const cancelOrder = async (orderId: number): Promise<void> => {
  await apiClient.post(`/api/v1/orders/${orderId}/cancel`);
};

// Hooks
export function useOrders(page: number = 0, size: number = 10) {
  return useQuery({
    queryKey: orderKeys.list(page, size),
    queryFn: () => fetchOrders(page, size),
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => fetchOrderById(id),
    enabled: !!id,
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
