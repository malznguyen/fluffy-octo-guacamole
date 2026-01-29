// ===========================================
// API Response Types
// ===========================================

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    timestamp?: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    size: number;
}

// ===========================================
// Product Types
// ===========================================

export interface ProductImage {
    id: number;
    url: string;
    altText?: string;
    sortOrder: number;
}

export interface ProductVariant {
    id: number;
    sku: string;
    size?: string;
    color?: string;
    priceAdjustment: number;
    stockQuantity: number;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    description?: string;
    basePrice: number;
    categoryId?: number;
    categoryName?: string;
    isVisible: boolean;
    soldCount: number;
    createdAt: string;
    updatedAt: string;
    images: ProductImage[];
    variants: ProductVariant[];
}

// ===========================================
// Category Types
// ===========================================

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    parentId?: number;
    parentName?: string;
    sortOrder: number;
    isActive: boolean;
    children: Category[];
}

// ===========================================
// Cart Types
// ===========================================

export interface CartItem {
    productId: number;
    variantId?: number;
    name: string;
    slug: string;
    price: number;
    quantity: number;
    image?: string;
    size?: string;
    color?: string;
}

export interface Cart {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
}

// ===========================================
// User Types
// ===========================================

export interface User {
    id: number;
    email: string;
    fullName: string;
    phone?: string;
    role: 'CUSTOMER' | 'ADMIN' | 'STAFF';
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}
