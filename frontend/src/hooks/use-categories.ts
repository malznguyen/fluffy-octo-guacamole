import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import * as categoryApi from '@/lib/api/admin/categories';
import type { CategoryDTO, CreateCategoryRequest, UpdateCategoryRequest } from '@/lib/api/admin/categories';

// Interface cho error response từ API
interface ApiErrorResponse {
    message?: string;
}

// Query Keys
export const categoryKeys = {
    all: ['categories'] as const,
    lists: () => [...categoryKeys.all, 'list'] as const,
    tree: () => [...categoryKeys.all, 'tree'] as const,
    details: () => [...categoryKeys.all, 'detail'] as const,
    detail: (id: number) => [...categoryKeys.details(), id] as const,
};

// Hooks
export function useCategories() {
    return useQuery<CategoryDTO[], Error>({
        queryKey: categoryKeys.lists(),
        queryFn: categoryApi.getAdminCategories,
    });
}

export function useCategoryTree() {
    return useQuery<CategoryDTO[], Error>({
        queryKey: categoryKeys.tree(),
        queryFn: categoryApi.getAdminCategoryTree,
    });
}

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation<CategoryDTO, AxiosError<ApiErrorResponse>, CreateCategoryRequest>({
        mutationFn: categoryApi.createCategory,
        onSuccess: () => {
            toast.success('Tạo danh mục thành công');
            queryClient.invalidateQueries({ queryKey: categoryKeys.all });
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi tạo danh mục';
            toast.error(message);
        },
    });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation<CategoryDTO, AxiosError<ApiErrorResponse>, { id: number; data: UpdateCategoryRequest }>({
        mutationFn: ({ id, data }) => categoryApi.updateCategory(id, data),
        onSuccess: () => {
            toast.success('Cập nhật danh mục thành công');
            queryClient.invalidateQueries({ queryKey: categoryKeys.all });
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật danh mục';
            toast.error(message);
        },
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError<ApiErrorResponse>, number>({
        mutationFn: categoryApi.deleteCategory,
        onSuccess: () => {
            toast.success('Xóa danh mục thành công');
            queryClient.invalidateQueries({ queryKey: categoryKeys.all });
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi xóa danh mục';
            toast.error(message);
        },
    });
}
