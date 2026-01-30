'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Banknote,
  Building2,
  ArrowLeft,
  ChevronRight,
  ShoppingBag,
  Loader2,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { createOrder } from '@/lib/api/order';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Validation schema
const checkoutSchema = z.object({
  customerName: z
    .string()
    .min(1, 'Vui lòng nhập họ tên')
    .max(255, 'Họ tên không được vượt quá 255 ký tự'),
  phone: z
    .string()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(/^[0-9]{10,15}$/, 'Số điện thoại không hợp lệ'),
  shippingAddress: z
    .string()
    .min(1, 'Vui lòng nhập địa chỉ giao hàng')
    .max(500, 'Địa chỉ không được vượt quá 500 ký tự'),
  note: z.string().max(500, 'Ghi chú không được vượt quá 500 ký tự').optional(),
  paymentMethod: z.enum(['COD', 'BANK_TRANSFER'] as const, {
    message: 'Vui lòng chọn phương thức thanh toán',
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + 'đ';
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { cart, isInitialized, fetchCart, clearCart } = useCartStore();

  // Flag to prevent cart empty redirect during order submission
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: user?.fullName || '',
      phone: user?.phone || '',
      paymentMethod: 'COD',
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchCart();
  }, [isAuthenticated, router, fetchCart]);

  // Redirect if cart is empty (but NOT during/after order submission)
  useEffect(() => {
    // Skip redirect if user just submitted an order
    if (hasSubmitted) return;

    if (isInitialized && (!cart || cart.items.length === 0)) {
      toast.error('Giỏ hàng của bạn đang trống');
      router.push('/cart');
    }
  }, [isInitialized, cart, router, hasSubmitted]);

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      console.log('[Checkout] Submitting order...', data);

      const order = await createOrder({
        shippingAddress: data.shippingAddress,
        phone: data.phone,
        note: data.note,
        paymentMethod: data.paymentMethod as import('@/types/enums').PaymentMethod,
      });

      console.log('[Checkout] Order created:', order);

      if (order) {
        const orderCode = order.orderCode;
        console.log('[Checkout] Order created:', orderCode);

        // Mark as submitted to prevent cart empty redirect
        setHasSubmitted(true);

        // Clear cart
        clearCart();

        // Redirect to success page with order code
        console.log('[Checkout] Redirecting to success page...');
        router.push(`/checkout/success?orderCode=${orderCode}`);
      }
    } catch (error: any) {
      console.error('[Checkout] Error:', error);
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400 && message) {
        toast.error(message);
      } else if (status === 401) {
        toast.error('Vui lòng đăng nhập lại');
        router.push('/login');
      } else if (status === 409) {
        toast.error(message || 'Sản phẩm hết hàng hoặc giỏ hàng đã thay đổi');
      } else {
        toast.error('Không thể tạo đơn hàng. Vui lòng thử lại.');
      }
    }
  };

  // Loading state
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />
        <main className="flex-1 pt-24 pb-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
        </main>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-neutral-600 mb-8">
            <Link href="/cart" className="hover:text-neutral-900 transition-colors">
              GIỎ HÀNG
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-neutral-900">THANH TOÁN</span>
          </div>

          {/* Page Title */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black uppercase text-neutral-900">THANH TOÁN</h1>
            <Link
              href="/cart"
              className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại giỏ hàng
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Shipping Info Form */}
            <div>
              <h2 className="text-xl font-bold uppercase text-neutral-900 mb-6">
                THÔNG TIN GIAO HÀNG
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.1em] text-neutral-600 mb-2">
                    Họ và tên người nhận
                  </label>
                  <input
                    type="text"
                    {...register('customerName')}
                    placeholder="Nguyễn Văn A"
                    className="w-full border border-neutral-300 py-3 px-4 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                  {errors.customerName && (
                    <p className="mt-2 text-sm text-red-600">{errors.customerName.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.1em] text-neutral-600 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="0901234567"
                    className="w-full border border-neutral-300 py-3 px-4 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.1em] text-neutral-600 mb-2">
                    Địa chỉ giao hàng
                  </label>
                  <textarea
                    {...register('shippingAddress')}
                    rows={3}
                    placeholder="Số nhà, đường, phường, quận, thành phố..."
                    className="w-full border border-neutral-300 py-3 px-4 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors resize-none"
                  />
                  {errors.shippingAddress && (
                    <p className="mt-2 text-sm text-red-600">{errors.shippingAddress.message}</p>
                  )}
                </div>

                {/* Note */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.1em] text-neutral-600 mb-2">
                    Ghi chú (không bắt buộc)
                  </label>
                  <textarea
                    {...register('note')}
                    rows={2}
                    placeholder="Ghi chú về đơn hàng, ví dụ: Giao giờ hành chính"
                    className="w-full border border-neutral-300 py-3 px-4 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors resize-none"
                  />
                  {errors.note && (
                    <p className="mt-2 text-sm text-red-600">{errors.note.message}</p>
                  )}
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.1em] text-neutral-600 mb-4">
                    Phương thức thanh toán
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-4 p-4 border border-neutral-200 cursor-pointer hover:border-neutral-400 transition-colors">
                      <input
                        type="radio"
                        value="COD"
                        {...register('paymentMethod')}
                        className="w-4 h-4 text-black focus:ring-black"
                      />
                      <Banknote className="w-6 h-6 text-neutral-700" />
                      <div>
                        <p className="font-medium text-neutral-900">Thanh toán khi nhận hàng (COD)</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-4 p-4 border border-neutral-200 cursor-pointer hover:border-neutral-400 transition-colors">
                      <input
                        type="radio"
                        value="BANK_TRANSFER"
                        {...register('paymentMethod')}
                        className="w-4 h-4 text-black focus:ring-black"
                      />
                      <Building2 className="w-6 h-6 text-neutral-700" />
                      <div>
                        <p className="font-medium text-neutral-900">Chuyển khoản ngân hàng</p>
                      </div>
                    </label>
                  </div>
                  {errors.paymentMethod && (
                    <p className="mt-2 text-sm text-red-600">{errors.paymentMethod.message}</p>
                  )}
                </div>

                {/* Submit Button - Mobile Only */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="lg:hidden w-full flex items-center justify-center gap-2 py-4 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:bg-neutral-400"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      ĐANG XỬ LÝ...
                    </>
                  ) : (
                    <>
                      ĐẶT HÀNG
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right: Order Summary */}
            <div>
              <div className="bg-white border border-neutral-200 p-6 sticky top-24">
                <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-900 mb-6">
                  Đơn hàng của bạn
                </h2>

                {/* Items List */}
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-16 h-16 shrink-0 bg-neutral-100">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {item.color && item.size ? `${item.color} - ${item.size}` : ''}
                        </p>
                        <p className="text-xs text-neutral-600 mt-1">x{item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatPrice(item.subtotal)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-neutral-200 mt-6 pt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Tạm tính</span>
                    <span className="font-medium">{formatPrice(cart.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Phí vận chuyển</span>
                    <span className="font-medium text-green-600">Miễn phí</span>
                  </div>
                  <div className="border-t border-neutral-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold uppercase">Tổng cộng</span>
                      <span className="text-xl font-black text-neutral-900">
                        {formatPrice(cart.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Button - Desktop */}
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="hidden lg:flex mt-6 w-full items-center justify-center gap-2 py-4 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:bg-neutral-400"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      ĐANG XỬ LÝ...
                    </>
                  ) : (
                    <>
                      ĐẶT HÀNG
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
