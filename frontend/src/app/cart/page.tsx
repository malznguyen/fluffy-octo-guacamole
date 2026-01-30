'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { ShoppingBag, Minus, Plus, X, ArrowRight, Loader2 } from 'lucide-react';
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
        bg-white border border-neutral-200 p-4 flex gap-4
        transition-all duration-300 ease-in-out
        ${item.isDeleting ? 'opacity-30 scale-95 pointer-events-none' : 'opacity-100 scale-100'}
      `}
    >
      {/* Product Image */}
      <div className="relative w-24 h-24 shrink-0 bg-neutral-100 overflow-hidden">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.productName}
            fill
            className="object-cover"
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
      <div className="flex-1 min-w-0">
        <h3 className="font-medium uppercase text-neutral-900 truncate">
          {item.productName}
        </h3>
        <p className="text-sm text-neutral-600 mt-1">
          {item.color && item.size ? `${item.color} - ${item.size}` : item.color || item.size || ''}
        </p>
        <p className="text-xs text-neutral-500 mt-1">Mã: {item.sku}</p>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity Control */}
          <div className="flex items-center border border-neutral-300">
            <button
              onClick={handleDecrease}
              disabled={localQuantity <= 1 || item.isUpdating || isUpdating}
              className="p-2 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center text-sm font-medium">
              {localQuantity}
            </span>
            <button
              onClick={handleIncrease}
              disabled={item.isUpdating || isUpdating}
              className="p-2 hover:bg-neutral-100 disabled:opacity-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-sm text-neutral-500">
              Đơn giá: {formatPrice(item.unitPrice)}
            </p>
            <p className="font-bold text-neutral-900">
              Thành tiền: {formatPrice(item.unitPrice * localQuantity)}
            </p>
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        disabled={item.isDeleting || item.isUpdating}
        className="shrink-0 p-2 text-neutral-400 hover:text-red-600 transition-colors self-start disabled:opacity-50"
        aria-label="Xóa sản phẩm"
      >
        {item.isDeleting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <X className="w-5 h-5" />
        )}
      </button>
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
              <div className="h-10 bg-neutral-200 w-1/3 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-32 bg-neutral-200"></div>
                  <div className="h-32 bg-neutral-200"></div>
                </div>
                <div className="h-64 bg-neutral-200"></div>
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
          <h1 className="text-3xl font-black uppercase text-neutral-900 mb-8">
            GIỎ HÀNG CỦA BẠN
          </h1>

          {isEmpty ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-20">
              <ShoppingBag className="w-16 h-16 text-neutral-300 mb-6" strokeWidth={1} />
              <p className="text-lg text-neutral-600 mb-8">Giỏ hàng của bạn đang trống</p>
              <Link
                href="/products"
                className="px-8 py-4 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                TIẾP TỤC MUA SẮM
              </Link>
            </div>
          ) : (
            // Cart Content
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Cart Items */}
              <div className="lg:col-span-2 space-y-4">
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
                <div className="bg-white border border-neutral-200 p-6 sticky top-24">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-6">
                    TÓM TẮT ĐƠN HÀNG
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
                    className="mt-6 w-full flex items-center justify-center gap-2 py-4 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                  >
                    THANH TOÁN
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
