'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/lib/api/services';
import { CartDTO, CartItemDTO, AddToCartRequest } from '@/lib/api/types';

const CART_KEY = 'cart';

export function useCart() {
  return useQuery<CartDTO, Error>({
    queryKey: [CART_KEY],
    queryFn: () => cartApi.getCart(),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AddToCartRequest) => cartApi.addToCart(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CART_KEY] });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      cartApi.updateCartItem(itemId, quantity),
    onMutate: async ({ itemId, quantity }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: [CART_KEY] });

      // Snapshot previous value
      const previousCart = queryClient.getQueryData<CartDTO>([CART_KEY]);

      // Optimistically update
      if (previousCart) {
        const updatedItems = previousCart.items.map((item) =>
          item.id === itemId
            ? { ...item, quantity, subtotal: item.unitPrice * quantity }
            : item
        );

        const newTotalAmount = updatedItems.reduce(
          (sum, item) => sum + item.subtotal,
          0
        );
        const newTotalItems = updatedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        queryClient.setQueryData<CartDTO>([CART_KEY], {
          ...previousCart,
          items: updatedItems,
          totalAmount: newTotalAmount,
          totalItems: newTotalItems,
        });
      }

      return { previousCart };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData([CART_KEY], context.previousCart);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: [CART_KEY] });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) => cartApi.removeCartItem(itemId),
    onMutate: async (itemId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: [CART_KEY] });

      // Snapshot previous value
      const previousCart = queryClient.getQueryData<CartDTO>([CART_KEY]);

      // Optimistically remove item
      if (previousCart) {
        const updatedItems = previousCart.items.filter(
          (item) => item.id !== itemId
        );

        const newTotalAmount = updatedItems.reduce(
          (sum, item) => sum + item.subtotal,
          0
        );
        const newTotalItems = updatedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        queryClient.setQueryData<CartDTO>([CART_KEY], {
          ...previousCart,
          items: updatedItems,
          totalAmount: newTotalAmount,
          totalItems: newTotalItems,
        });
      }

      return { previousCart };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData([CART_KEY], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [CART_KEY] });
    },
  });
}
