import axios, { AxiosError, AxiosInstance } from 'axios';
import { toast } from 'sonner';
import type { ApiResponse, Category, Product } from '@/types';

// ===========================================
// Axios Instance
// ===========================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// ===========================================
// Error Handling Interceptor
// ===========================================

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string }>) => {
        const message = error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.';

        if (error.response?.status === 401) {
            toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (error.response?.status === 403) {
            toast.error('Bạn không có quyền thực hiện thao tác này.');
        } else if (error.response?.status === 404) {
            toast.error('Không tìm thấy dữ liệu yêu cầu.');
        } else if (error.response?.status && error.response.status >= 500) {
            toast.error('Lỗi máy chủ. Vui lòng thử lại sau.');
        } else {
            toast.error(message);
        }

        return Promise.reject(error);
    }
);

// ===========================================
// Product APIs
// ===========================================

export async function getTopSellingProducts(limit: number = 8): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>('/public/products/top-selling', {
        params: { limit },
    });
    return response.data.data;
}

export async function getNewestProducts(limit: number = 8): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>('/public/products/newest', {
        params: { limit },
    });
    return response.data.data;
}

export async function getProductBySlug(slug: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/public/products/${slug}`);
    return response.data.data;
}

// ===========================================
// Category APIs
// ===========================================

export async function getCategoryTree(): Promise<Category[]> {
    const response = await api.get<ApiResponse<Category[]>>('/public/categories/tree');
    return response.data.data;
}

export async function getActiveCategories(): Promise<Category[]> {
    const response = await api.get<ApiResponse<Category[]>>('/public/categories');
    return response.data.data;
}

// ===========================================
// Format Helpers
// ===========================================

export function formatVND(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
}
