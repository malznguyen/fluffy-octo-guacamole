import { create } from 'zustand';
import apiClient from '@/lib/axios';
import { useAuthStore } from './auth-store';

// Types
export interface CartItemDTO {
  id: number;
  variantId: number;
  productName: string;
  color: string;
  size: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  isDeleting?: boolean; // For animation state
  isUpdating?: boolean; // For loading state
}

export interface CartDTO {
  id: number;
  userId: number;
  items: CartItemDTO[];
  totalItems: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

interface CartState {
  cart: CartDTO | null;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  fetchCart: () => Promise<void>;
  addItem: (variantId: number, quantity: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  updateItemOptimistic: (itemId: number, newQuantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,
  isInitialized: false,

  fetchCart: async () => {
    const token = useAuthStore.getState().token;
    if (!token) {
      console.log('[CartStore] No token, skipping fetch');
      set({ isInitialized: true });
      return;
    }

    try {
      const response = await apiClient.get('/cart');
      if (response.data.success) {
        set({ cart: response.data.data, isInitialized: true });
      }
    } catch (error: any) {
      console.error('[CartStore] Failed to fetch:', error.response?.status);
      set({ isInitialized: true });
      throw error;
    }
  },

  addItem: async (variantId: number, quantity: number) => {
    const token = useAuthStore.getState().token;
    if (!token) {
      throw new Error('Vui lòng đăng nhập để thêm vào giỏ hàng');
    }

    set({ isLoading: true });
    try {
      const response = await apiClient.post('/cart/items', {
        variantId,
        quantity,
      });
      if (response.data.success) {
        set({ cart: response.data.data });
      }
    } catch (error) {
      console.error('[CartStore] Add item failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // DEPRECATED: Old method - fetches entire cart after update (causes lag)
  updateItem: async (itemId: number, quantity: number) => {
    const token = useAuthStore.getState().token;
    if (!token) {
      throw new Error('Vui lòng đăng nhập');
    }

    try {
      const response = await apiClient.put(`/cart/items/${itemId}`, { quantity });
      if (response.data.success) {
        set({ cart: response.data.data });
      }
    } catch (error) {
      console.error('[CartStore] Failed to update item:', error);
      throw error;
    }
  },

  // Optimistic update - updates UI immediately, calls API in background
  updateItemOptimistic: async (itemId: number, newQuantity: number) => {
    const { cart } = get();
    if (!cart) return;

    const token = useAuthStore.getState().token;
    if (!token) {
      throw new Error('Vui lòng đăng nhập');
    }

    // Save old state for potential rollback
    const oldItems = [...cart.items];

    // 1. Optimistic update - update UI immediately
    const updatedItems = cart.items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            quantity: newQuantity,
            subtotal: item.unitPrice * newQuantity,
            isUpdating: true,
          }
        : item
    );

    // Calculate new totals
    const newTotalItems = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
    const newTotalAmount = updatedItems.reduce((sum, i) => sum + i.subtotal, 0);

    set({
      cart: {
        ...cart,
        items: updatedItems,
        totalItems: newTotalItems,
        totalAmount: newTotalAmount,
      },
    });

    // 2. Call API in background
    try {
      const response = await apiClient.put(`/cart/items/${itemId}`, {
        quantity: newQuantity,
      });

      if (response.data.success) {
        // 3. Update with server response (to ensure consistency)
        const finalItems = response.data.data.items.map((item: CartItemDTO) => ({
          ...item,
          isUpdating: false,
        }));

        set({
          cart: {
            ...response.data.data,
            items: finalItems,
          },
        });
      }
    } catch (error) {
      // 4. Rollback on error
      console.error('[CartStore] Update failed, rollback');
      set({
        cart: {
          ...cart,
          items: oldItems,
        },
      });
      throw error;
    }
  },

  // Remove with animation - sets isDeleting flag first
  removeItem: async (itemId: number) => {
    const { cart } = get();
    if (!cart) return;

    const token = useAuthStore.getState().token;
    if (!token) {
      throw new Error('Vui lòng đăng nhập');
    }

    // Save old state for rollback
    const oldItems = [...cart.items];

    // 1. Set isDeleting flag for animation
    const itemsWithDeleting = cart.items.map((item) =>
      item.id === itemId ? { ...item, isDeleting: true } : item
    );

    set({
      cart: {
        ...cart,
        items: itemsWithDeleting,
      },
    });

    // 2. Wait for exit animation (300ms)
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 3. Call API
    try {
      const response = await apiClient.delete(`/cart/items/${itemId}`);

      if (response.data.success) {
        set({ cart: response.data.data });
      }
    } catch (error) {
      // 4. Rollback on error
      console.error('[CartStore] Remove failed, rollback');
      set({
        cart: {
          ...cart,
          items: oldItems,
        },
      });
      throw error;
    }
  },

  clearCart: () => {
    set({ cart: null });
  },
}));
