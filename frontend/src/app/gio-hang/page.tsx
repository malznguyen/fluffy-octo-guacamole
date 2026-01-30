'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart, useUpdateCartItem, useRemoveCartItem } from '@/lib/hooks/use-cart';
import { CartItemDTO } from '@/lib/api/types';
import { Button } from '@/components/ui/button';

// Currency formatter for VND
const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

interface CartItemProps {
  item: CartItemDTO;
}

function CartItem({ item }: CartItemProps) {
  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveCartItem();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleIncrease = () => {
    updateMutation.mutate({
      itemId: item.id,
      quantity: item.quantity + 1,
    });
  };

  const handleDecrease = () => {
    if (item.quantity <= 1) {
      setShowDeleteConfirm(true);
    } else {
      updateMutation.mutate({
        itemId: item.id,
        quantity: item.quantity - 1,
      });
    }
  };

  const handleDelete = () => {
    removeMutation.mutate(item.id);
    setShowDeleteConfirm(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex gap-4 py-6 border-b border-neutral-200 last:border-b-0"
    >
      {/* Product Image */}
      <div className="relative w-24 h-32 flex-shrink-0 bg-neutral-100 overflow-hidden">
        {item.productImage ? (
          <Image
            src={item.productImage}
            alt={item.productName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-neutral-400" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-900">
            {item.productName}
          </h3>
          <div className="flex gap-2 mt-2">
            {item.size && (
              <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600">
                Size: {item.size}
              </span>
            )}
            {item.color && (
              <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600">
                Màu: {item.color}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          {/* Quantity Controls */}
          <div className="flex items-center border border-neutral-300">
            <button
              onClick={handleDecrease}
              disabled={updateMutation.isPending}
              className="p-2 hover:bg-neutral-100 transition-colors disabled:opacity-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrease}
              disabled={updateMutation.isPending}
              className="p-2 hover:bg-neutral-100 transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Price & Delete */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-neutral-900">
              {formatVND(item.subtotal)}
            </span>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-xs text-neutral-500 hover:text-red-600 underline transition-colors"
            >
              XÓA
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 max-w-sm w-full mx-4"
          >
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Xác nhận xóa
            </h3>
            <p className="text-sm text-neutral-600 mb-6">
              Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
              >
                HỦY
              </Button>
              <Button
                onClick={handleDelete}
                disabled={removeMutation.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                XÓA
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <ShoppingBag className="w-16 h-16 text-neutral-300 mb-4" />
      <h2 className="text-xl font-medium text-neutral-900 mb-2">
        GIỎ HÀNG TRỐNG
      </h2>
      <p className="text-sm text-neutral-500 mb-6">
        Bạn chưa có sản phẩm nào trong giỏ hàng
      </p>
      <Link href="/cua-hang">
        <Button className="bg-neutral-900 hover:bg-neutral-800 text-white px-8">
          TIẾP TỤC MUA SẮM
        </Button>
      </Link>
    </motion.div>
  );
}

export default function CartPage() {
  const { data: cart, isLoading } = useCart();

  if (isLoading) {
    return (
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-neutral-200 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-neutral-100" />
                ))}
              </div>
              <div className="h-64 bg-neutral-100" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  const hasItems = cart && cart.items.length > 0;

  return (
    <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-medium tracking-wide text-neutral-900 mb-8">
          GIỎ HÀNG
        </h1>

        {!hasItems ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="border-t border-neutral-200">
                {cart?.items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 bg-neutral-50 p-6">
                <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-900 mb-6">
                  TÓM TẮT ĐƠN HÀNG
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Tạm tính</span>
                    <span className="font-medium">
                      {formatVND(cart?.totalAmount || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Phí vận chuyển</span>
                    <span className="font-medium">Miễn phí</span>
                  </div>
                </div>

                <div className="border-t border-neutral-200 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">TỔNG CỘNG</span>
                    <span className="text-lg font-medium">
                      {formatVND(cart?.totalAmount || 0)}
                    </span>
                  </div>
                </div>

                <Link href="/thanh-toan">
                  <Button
                    disabled={!hasItems}
                    className="w-full bg-neutral-900 hover:bg-neutral-800 text-white h-12 text-sm tracking-wide"
                  >
                    THANH TOÁN
                  </Button>
                </Link>

                <Link
                  href="/cua-hang"
                  className="block text-center mt-4 text-sm text-neutral-600 hover:text-neutral-900 underline transition-colors"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
