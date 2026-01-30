import { create } from 'zustand';
import * as wishlistApi from '@/lib/api/wishlist';
import type { ProductDTO } from '@/types/product';

interface WishlistState {
    items: ProductDTO[];
    isLoading: boolean;
    isInitialized: boolean;

    // Actions
    fetchWishlist: () => Promise<void>;
    addToWishlist: (productId: number) => Promise<void>;
    removeFromWishlist: (productId: number) => Promise<void>;
    toggleWishlist: (productId: number) => Promise<void>;
    isInWishlist: (productId: number) => boolean;
    getWishlistCount: () => number;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
    items: [],
    isLoading: false,
    isInitialized: false,

    fetchWishlist: async () => {
        try {
            const items = await wishlistApi.getWishlist();
            set({ items, isInitialized: true });
        } catch (error) {
            console.error('[WishlistStore] Failed to fetch:', error);
            set({ isInitialized: true });
        }
    },

    addToWishlist: async (productId: number) => {
        try {
            // Optimistic update
            const { items } = get();
            
            // Gọi API trước để lấy thông tin sản phẩm đầy đủ
            await wishlistApi.addToWishlist(productId);
            
            // Refresh lại danh sách để có thông tin đầy đủ
            const updatedItems = await wishlistApi.getWishlist();
            set({ items: updatedItems });
        } catch (error) {
            console.error('[WishlistStore] Failed to add:', error);
            throw error;
        }
    },

    removeFromWishlist: async (productId: number) => {
        try {
            // Optimistic update
            const { items } = get();
            const filteredItems = items.filter(item => item.id !== productId);
            set({ items: filteredItems });

            // Gọi API
            await wishlistApi.removeFromWishlist(productId);
        } catch (error) {
            console.error('[WishlistStore] Failed to remove:', error);
            // Rollback nếu lỗi
            get().fetchWishlist();
            throw error;
        }
    },

    toggleWishlist: async (productId: number) => {
        const { isInWishlist, addToWishlist, removeFromWishlist } = get();
        
        if (isInWishlist(productId)) {
            await removeFromWishlist(productId);
        } else {
            await addToWishlist(productId);
        }
    },

    isInWishlist: (productId: number) => {
        const { items } = get();
        return items.some(item => item.id === productId);
    },

    getWishlistCount: () => {
        return get().items.length;
    },
}));
