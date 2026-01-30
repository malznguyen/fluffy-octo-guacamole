import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as orderApi from '@/lib/api/admin/orders';
import type { OrderDTO, OrderListResponse } from '@/types/order';
import type { OrderStatus } from '@/types/enums';

// Re-export types for convenience
export type { OrderDTO, OrderListResponse } from '@/types/order';
export type { OrderStatus } from '@/types/enums';

interface UseAdminOrdersParams {
    page: number; // 0-based
    size: number;
    status?: string; // 'all' or specific status
    search?: string;
}

const adminOrderKeys = {
    all: ['admin-orders'] as const,
    lists: () => [...adminOrderKeys.all, 'list'] as const,
    list: (filters: { page: number; size: number; status?: string; search?: string }) =>
        [...adminOrderKeys.lists(), filters] as const,
    detail: (orderCode: string) => [...adminOrderKeys.all, 'detail', orderCode] as const,
};

export function useAdminOrders({ page, size, status, search }: UseAdminOrdersParams) {
    return useQuery<OrderListResponse, Error>({
        queryKey: adminOrderKeys.list({ page, size, status, search }),
        queryFn: async () => {
            return orderApi.getAdminOrders({
                page,
                size,
                status: (status === 'all' ? undefined : status) as OrderStatus | undefined,
                search: search || undefined,
            });
        },
    });
}

export function useAdminOrder(orderCode: string | null) {
    return useQuery<OrderDTO, Error>({
        queryKey: adminOrderKeys.detail(orderCode || ''),
        queryFn: async () => {
            if (!orderCode) throw new Error('Order code is required');
            return orderApi.getAdminOrder(orderCode);
        },
        enabled: !!orderCode,
    });
}

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation<OrderDTO, Error, { orderCode: string; status: OrderStatus }>({
        mutationFn: ({ orderCode, status }) => orderApi.updateOrderStatus(orderCode, status),
        onSuccess: (_, variables) => {
            toast.success(`Cập nhật trạng thái đơn hàng ${variables.orderCode} thành công`);
            queryClient.invalidateQueries({ queryKey: adminOrderKeys.all });
        },
        onError: (error: Error) => {
            toast.error(`Lỗi cập nhật: ${error.message}`);
        },
    });
}

export function useCancelOrder() {
    const queryClient = useQueryClient();

    return useMutation<OrderDTO, Error, string>({
        mutationFn: orderApi.cancelOrderAdmin,
        onSuccess: (_, orderCode) => {
            toast.success(`Đã hủy đơn hàng ${orderCode}`);
            queryClient.invalidateQueries({ queryKey: adminOrderKeys.all });
        },
        onError: (error: Error) => {
            toast.error(`Lỗi hủy đơn: ${error.message}`);
        },
    });
}
