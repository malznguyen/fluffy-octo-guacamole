import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { UserDTO, UsersResponse, UpdateUserRequest, UserResponse } from '@/types/user';
import { OrderDTO } from '@/types/order';
import { toast } from 'sonner';

// Keys
export const userKeys = {
    all: ['admin', 'users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    detail: (id: number) => [...userKeys.all, 'detail', id] as const,
    orders: (id: number) => [...userKeys.all, 'orders', id] as const,
};

// Fetch all users (with optional pagination/search if API supports it, currently assuming flat or simple)
// Updating to match potential API pattern of page/size params
export const useAdminUsers = (page = 0, size = 10, search = '', role = 'all') => {
    return useQuery({
        queryKey: [...userKeys.lists(), { page, size, search, role }],
        queryFn: async () => {
            // Construct query params
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('size', size.toString());
            if (search) params.append('search', search);
            if (role !== 'all') params.append('role', role);

            // Note: Assuming API supports these params based on standard patterns. 
            // If flat list, filter client side in component. 
            // Based on instructions: "GET /api/v1/admin/users - Lay tat ca users (flat list, co the co pagination nhu orders)"
            const { data } = await apiClient.get<UsersResponse | { data: UserDTO[] }>(`/admin/users?${params.toString()}`);

            // Handle both paginated and flat response for robustness
            if ('content' in data.data) {
                return data as UsersResponse;
            } else if (Array.isArray(data.data)) {
                // Wrap flat list in paginated structure for consistent UI consumption
                // Client-side pagination logic handles this if needed, but here we return standard structure
                return {
                    success: true,
                    data: {
                        content: data.data,
                        totalElements: data.data.length,
                        totalPages: 1,
                        currentPage: 0,
                        size: data.data.length
                    },
                    message: 'Success'
                } as UsersResponse;
            }
            return data as UsersResponse;
        },
    });
};

// Get single user
export const useUser = (id: number | null) => {
    return useQuery({
        queryKey: userKeys.detail(id!),
        queryFn: async () => {
            const { data } = await apiClient.get<UserResponse>(`/admin/users/${id}`);
            return data.data;
        },
        enabled: !!id,
    });
};

// Update user
export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: UpdateUserRequest }) => {
            const response = await apiClient.put<UserResponse>(`/admin/users/${id}`, data);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(`Cập nhật user ${data.data.fullName} thành công`);
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật user');
        },
    });
};

// Delete user
export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await apiClient.delete(`/admin/users/${id}`);
        },
        onSuccess: () => {
            toast.success('Xóa user thành công');
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa user');
        },
    });
};

// Get user orders
export const useUserOrders = (userId: number | null) => {
    return useQuery({
        queryKey: userKeys.orders(userId!),
        queryFn: async () => {
            // Use the existing orders endpoint with filter
            // If query param specific for userId exists: /admin/orders?userId=1
            // Else fetch all and filter client side (fallback)
            // Trying direct filter param first as per instructions
            const { data } = await apiClient.get<{ data: { content: OrderDTO[] } }>(`/admin/orders?userId=${userId}&size=100`);
            return data.data.content || [];
        },
        enabled: !!userId,
    });
};
