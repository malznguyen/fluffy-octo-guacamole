'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types';
import { toast } from 'sonner';

interface CartState {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeFromCart: (productId: number, variantId?: number) => void;
    updateQuantity: (productId: number, quantity: number, variantId?: number) => void;
    clearCart: () => void;
    getCartCount: () => number;
    getCartTotal: () => number;
}

export const useCart = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addToCart: (item) => {
                set((state) => {
                    const existingIndex = state.items.findIndex(
                        (i) => i.productId === item.productId && i.variantId === item.variantId
                    );

                    if (existingIndex > -1) {
                        const updated = [...state.items];
                        updated[existingIndex].quantity += item.quantity || 1;
                        toast.success('Đã cập nhật số lượng trong giỏ hàng');
                        return { items: updated };
                    }

                    toast.success('Đã thêm vào giỏ hàng');
                    return {
                        items: [...state.items, { ...item, quantity: item.quantity || 1 }],
                    };
                });
            },

            removeFromCart: (productId, variantId) => {
                set((state) => ({
                    items: state.items.filter(
                        (i) => !(i.productId === productId && i.variantId === variantId)
                    ),
                }));
                toast.success('Đã xóa khỏi giỏ hàng');
            },

            updateQuantity: (productId, quantity, variantId) => {
                if (quantity <= 0) {
                    get().removeFromCart(productId, variantId);
                    return;
                }

                set((state) => ({
                    items: state.items.map((item) =>
                        item.productId === productId && item.variantId === variantId
                            ? { ...item, quantity }
                            : item
                    ),
                }));
            },

            clearCart: () => {
                set({ items: [] });
                toast.success('Đã xóa toàn bộ giỏ hàng');
            },

            getCartCount: () => {
                return get().items.reduce((sum, item) => sum + item.quantity, 0);
            },

            getCartTotal: () => {
                return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            },
        }),
        {
            name: 'fashon-cart',
        }
    )
);
