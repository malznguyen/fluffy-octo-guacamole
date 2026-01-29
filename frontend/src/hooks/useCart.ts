"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/lib/api/services";
import { Cart } from "@/lib/api/types";
import { toast } from "sonner";

export const cartKeys = {
  all: ["cart"] as const,
  detail: () => [...cartKeys.all] as const,
};

export function useCart() {
  return useQuery<Cart, Error>({
    queryKey: cartKeys.detail(),
    queryFn: cartApi.getCart,
    staleTime: 0,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      productId: number;
      variantId?: number;
      quantity: number;
    }) => cartApi.addItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      toast.success("Đã thêm vào giỏ hàng", {
        description: "Sản phẩm đã được thêm vào giỏ hàng của bạn.",
      });
    },
    onError: () => {
      toast.error("Không thể thêm vào giỏ hàng", {
        description: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.",
      });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      cartApi.updateItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: () => {
      toast.error("Không thể cập nhật giỏ hàng");
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (itemId: number) => cartApi.removeItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    },
    onError: () => {
      toast.error("Không thể xóa sản phẩm");
    },
  });
}
