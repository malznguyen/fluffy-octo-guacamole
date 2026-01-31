'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { ShoppingBag, Minus, Plus, ArrowRight, Loader2, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + 'đ';
}

// Debounce hook for quantity updates
function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  // Cancel pending debounce on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

// Cart Item Component (memoized to prevent unnecessary re-renders)
const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating,
}: {
  item: import('@/stores/cart-store').CartItemDTO;
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  onRemove: (itemId: number) => void;
  isUpdating: boolean;
}) => {
  // Local state for immediate UI feedback
  const [localQuantity, setLocalQuantity] = useState(item.quantity);

  // Sync local quantity with prop when not updating
  useEffect(() => {
    if (!item.isUpdating) {
      setLocalQuantity(item.quantity);
    }
  }, [item.quantity, item.isUpdating]);

  const handleIncrease = () => {
    const newQty = localQuantity + 1;
    setLocalQuantity(newQty);
    onUpdateQuantity(item.id, newQty);
  };

  const handleDecrease = () => {
    if (localQuantity <= 1) return;
    const newQty = localQuantity - 1;
    setLocalQuantity(newQty);
    onUpdateQuantity(item.id, newQty);
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  return (
    <div
      className={`
        group bg-white rounded-xl border border-neutral-200 shadow-sm p-4 md:p-6 mb-4
        hover:shadow-md hover:border-neutral-300 hover:-translate-y-0.5
        transition-all duration-200 ease-out
        ${item.isDeleting ? 'opacity-30 scale-95 pointer-events-none' : 'opacity-100 scale-100'}
      `}
    >
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Product Image */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-lg overflow-hidden bg-neutral-100">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.productName}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
          )}
          
          {/* Loading overlay for updating */}
          {(item.isUpdating || isUpdating) && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-neutral-600" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Top: Name and Variant */}
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-neutral-900 mb-1 line-clamp-2">
              {item.productName}
            </h3>
            <p className="text-sm text-neutral-500 mb-2">
              {item.color && item.size ? `${item.color} - ${item.size}` : item.color || item.size || ''}
            </p>
            <p className="text-xs text-neutral-400">Mã: {item.sku}</p>
          </div>

          {/* Bottom: Price info (mobile) or aligned with actions (desktop) */}
          <div className="mt-4 md:mt-auto">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-base md:text-lg text-neutral-900">
                {formatPrice(item.unitPrice * localQuantity)}
              </span>
              <span className="text-sm text-neutral-500">
                ({formatPrice(item.unitPrice)} / sản phẩm)
              </span>
            </div>
          </div>
        </div>

        {/* Actions: Quantity + Delete */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3">
          {/* Quantity Stepper */}
          <div className="flex items-center border-2 border-neutral-200 rounded-lg bg-white overflow-hidden">
            <button
              onClick={handleDecrease}
              disabled={localQuantity <= 1 || item.isUpdating || isUpdating}
              className="w-10 h-10 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 h-10 flex items-center justify-center font-semibold text-neutral-900 border-x-2 border-neutral-200 bg-neutral-50">
              {localQuantity}
            </span>
            <button
              onClick={handleIncrease}
              disabled={item.isUpdating || isUpdating}
              className="w-10 h-10 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Delete Button */}
          <button
            onClick={handleRemove}
            disabled={item.isDeleting || item.isUpdating}
            className="flex items-center gap-2 px-3 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Xóa sản phẩm"
          >
            {item.isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium md:hidden">Xóa</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { cart, isLoading, isInitialized, fetchCart, updateItemOptimistic, removeItem } = useCartStore();
  const [pendingUpdates, setPendingUpdates] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchCart();
  }, [isAuthenticated, router, fetchCart]);

  // Debounced quantity update
  const debouncedUpdate = useDebouncedCallback(
    async (itemId: number, newQuantity: number) => {
      try {
        setPendingUpdates((prev) => new Set(prev).add(itemId));
        await updateItemOptimistic(itemId, newQuantity);
      } catch (error: any) {
        const message = error.response?.data?.message || 'Không thể cập nhật số lượng';
        toast.error(message);
      } finally {
        setPendingUpdates((prev) => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }
    },
    400 // 400ms debounce delay
  );

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    debouncedUpdate(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeItem(itemId);
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error) {
      toast.error('Không thể xóa sản phẩm');
    }
  };

  // Loading state
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />
        <main className="flex-1 pt-24 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-10 bg-neutral-200 w-1/3 mb-8 rounded-lg"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-40 bg-neutral-200 rounded-xl"></div>
                  <div className="h-40 bg-neutral-200 rounded-xl"></div>
                </div>
                <div className="h-64 bg-neutral-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Empty cart state
  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-8">
            Giỏ hàng của bạn
          </h1>

          {isEmpty ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-neutral-200">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-neutral-400" strokeWidth={1.5} />
              </div>
              <p className="text-lg text-neutral-600 mb-2">Giỏ hàng của bạn đang trống</p>
              <p className="text-sm text-neutral-400 mb-8">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
              <Link
                href="/products"
                className="px-8 py-4 bg-neutral-900 text-white text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-800 transition-colors"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            // Cart Content
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Cart Items */}
              <div className="lg:col-span-2">
                {cart.items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleQuantityChange}
                    onRemove={handleRemoveItem}
                    isUpdating={pendingUpdates.has(item.id)}
                  />
                ))}
              </div>

              {/* Right: Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-neutral-200 rounded-xl p-6 sticky top-24 shadow-sm">
                  <h2 className="text-base font-semibold text-neutral-900 mb-6">
                    Tóm tắt đơn hàng
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Tổng sản phẩm</span>
                      <span className="font-medium">{cart.totalItems} sản phẩm</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Tạm tính</span>
                      <span className="font-medium">{formatPrice(cart.totalAmount)}</span>
                    </div>

                    <div className="border-t border-neutral-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold uppercase">Tổng cộng</span>
                        <span className="text-xl font-black text-neutral-900">
                          {formatPrice(cart.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="mt-6 w-full flex items-center justify-center gap-2 py-4 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
                  >
                    Thanh toán
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/products"
                    className="mt-4 block text-center text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    Tiếp tục mua sắm
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
