import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import * as userApi from '@/lib/api/admin/users';
import type { UserDTO, UsersResponse, UpdateUserRequest, Role } from '@/lib/api/admin/users';
import { OrderDTO } from '@/types/order';

// Re-export types
export type { UserDTO, UpdateUserRequest, Role };

// Keys
export const userKeys = {
    all: ['admin', 'users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    detail: (id: number) => [...userKeys.all, 'detail', id] as const,
    orders: (id: number) => [...userKeys.all, 'orders', id] as const,
};

interface UseAdminUsersFilters {
    page?: number;
    size?: number;
    search?: string;
    role?: string;
}

// Interface cho error response từ API
interface ApiErrorResponse {
    message?: string;
}

export const useAdminUsers = (filters: UseAdminUsersFilters = {}) => {
    const { page = 0, size = 10, search = '', role = 'all' } = filters;
    
    return useQuery<UsersResponse, Error>({
        queryKey: [...userKeys.lists(), { page, size, search, role }],
        queryFn: async () => {
            return userApi.getAdminUsers({
                page,
                size,
                search: search || undefined,
                role: (role === 'all' ? undefined : role) as Role | undefined,
            });
        },
    });
};

// Get single user
export const useUser = (id: number | null) => {
    return useQuery<UserDTO, Error>({
        queryKey: userKeys.detail(id || 0),
        queryFn: async () => {
            if (!id) throw new Error('User ID is required');
            return userApi.getAdminUser(id);
        },
        enabled: !!id,
    });
};

// Update user
export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation<UserDTO, AxiosError<ApiErrorResponse>, { id: number; data: UpdateUserRequest }>({
        mutationFn: ({ id, data }) => userApi.updateUser(id, data),
        onSuccess: (data) => {
            toast.success(`Cập nhật user ${data.fullName} thành công`);
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật user';
            toast.error(message);
        },
    });
};

// Delete user
export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError<ApiErrorResponse>, number>({
        mutationFn: userApi.deleteUser,
        onSuccess: () => {
            toast.success('Xóa user thành công');
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi xóa user';
            toast.error(message);
        },
    });
};

// Get user orders
export const useUserOrders = (userId: number | null) => {
    return useQuery<OrderDTO[], Error>({
        queryKey: userKeys.orders(userId || 0),
        queryFn: async () => {
            if (!userId) throw new Error('User ID is required');
            return userApi.getUserOrders(userId);
        },
        enabled: !!userId,
    });
};
