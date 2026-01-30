import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';
import { CategoryDTO, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/category';

// Query Keys
export const categoryKeys = {
    all: ['categories'] as const,
    lists: () => [...categoryKeys.all, 'list'] as const,
    tree: () => [...categoryKeys.all, 'tree'] as const,
    details: () => [...categoryKeys.all, 'detail'] as const,
    detail: (id: number) => [...categoryKeys.details(), id] as const,
};

// API Functions
const categoryApi = {
    getAll: async () => {
        const response = await apiClient.get<{ data: CategoryDTO[] }>('/admin/categories');
        return response.data.data;
    },
    getTree: async () => {
        const response = await apiClient.get<{ data: CategoryDTO[] }>('/admin/categories/tree');
        return response.data.data;
    },
    create: async (data: CreateCategoryRequest) => {
        const response = await apiClient.post<{ data: CategoryDTO }>('/admin/categories', data);
        return response.data.data;
    },
    update: async ({ id, data }: { id: number; data: UpdateCategoryRequest }) => {
        const response = await apiClient.put<{ data: CategoryDTO }>(`/admin/categories/${id}`, data);
        return response.data.data;
    },
    delete: async (id: number) => {
        await apiClient.delete(`/admin/categories/${id}`);
        return id;
    },
};

// Hooks
export function useCategories() {
    return useQuery({
        queryKey: categoryKeys.lists(),
        queryFn: categoryApi.getAll,
    });
}

export function useCategoryTree() {
    return useQuery({
        queryKey: categoryKeys.tree(),
        queryFn: categoryApi.getTree,
    });
}

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: categoryApi.create,
        onSuccess: () => {
            toast.success('Tạo danh mục thành công');
            queryClient.invalidateQueries({ queryKey: categoryKeys.all });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo danh mục');
        },
    });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: categoryApi.update,
        onSuccess: () => {
            toast.success('Cập nhật danh mục thành công');
            queryClient.invalidateQueries({ queryKey: categoryKeys.all });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật danh mục');
        },
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: categoryApi.delete,
        onSuccess: () => {
            toast.success('Xóa danh mục thành công');
            queryClient.invalidateQueries({ queryKey: categoryKeys.all });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa danh mục');
        },
    });
}
