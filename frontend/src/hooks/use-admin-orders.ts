import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    OrderDTO,
    OrderListResponse,
    UpdateOrderStatusRequest
} from '@/types/order';
import { OrderStatus } from '@/types/enums';
import { useAuthStore } from '@/stores/auth-store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = useAuthStore.getState().token;
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'An error occurred');
    }

    return response.json();
}

interface UseAdminOrdersParams {
    page: number; // 0-based
    size: number;
    status?: string; // 'all' or specific status
    search?: string;
}

export function useAdminOrders({ page, size, status, search }: UseAdminOrdersParams) {
    return useQuery<OrderListResponse>({
        queryKey: ['admin-orders', page, size, status, search],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('size', size.toString());

            if (status && status !== 'all') {
                params.append('status', status);
            }

            if (search) {
                // API docs don't explicitly list 'search' query param for GET /orders
                // But the prompt REQUIREMENTS say: "Search theo orderCode hoac customerName (query param)"
                // I will assume the param name is 'search' or 'keyword'. 
                // Docs for public products use 'search'. 
                // Docs for Admin Orders Section 5.3 say: "Pagination (page, size, status filter)".
                // Requirements say: "Search theo orderCode hoac customerName (query param)".
                // I'll assume 'search' is the param name.
                params.append('search', search);
            }

            const response = await fetchWithAuth(`/admin/orders?${params.toString()}`);
            return response.data;
        },
    });
}

export function useAdminOrder(orderCode: string | null) {
    return useQuery<OrderDTO>({
        queryKey: ['admin-order', orderCode],
        queryFn: async () => {
            if (!orderCode) throw new Error('Order code is required');
            const response = await fetchWithAuth(`/admin/orders/${orderCode}`);
            return response.data;
        },
        enabled: !!orderCode,
    });
}

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ orderCode, status }: { orderCode: string; status: OrderStatus }) => {
            const body: UpdateOrderStatusRequest = { status };
            return fetchWithAuth(`/admin/orders/${orderCode}/status`, {
                method: 'PUT',
                body: JSON.stringify(body),
            });
        },
        onSuccess: (data, variables) => {
            toast.success(`Cập nhật trạng thái đơn hàng ${variables.orderCode} thành công`);
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
            queryClient.invalidateQueries({ queryKey: ['admin-order', variables.orderCode] });
        },
        onError: (error: Error) => {
            toast.error(`Lỗi cập nhật: ${error.message}`);
        },
    });
}

export function useCancelOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (orderCode: string) => {
            return fetchWithAuth(`/admin/orders/${orderCode}/cancel`, {
                method: 'POST',
            });
        },
        onSuccess: (data, variables) => {
            toast.success(`Đã hủy đơn hàng ${variables}`);
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
            queryClient.invalidateQueries({ queryKey: ['admin-order', variables] });
        },
        onError: (error: Error) => {
            toast.error(`Lỗi hủy đơn: ${error.message}`);
        },
    });
}
