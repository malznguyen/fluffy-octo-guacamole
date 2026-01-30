'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, ShoppingBag, MapPin, Phone, FileText, CreditCard, Truck, Building2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/lib/store/use-auth-store';
import { useCart } from '@/lib/hooks/use-cart';
import { orderApi } from '@/lib/api/services';
import { CreateOrderRequest } from '@/lib/api/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Currency formatter for VND
const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

// Validation schema matching CreateOrderRequest.java
const checkoutSchema = z.object({
  shippingAddress: z.string().min(1, 'Vui lòng nhập địa chỉ giao hàng'),
  phone: z
    .string()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(/^[0-9]{10,15}$/, 'Số điện thoại phải có 10-15 chữ số'),
  note: z.string().optional(),
  paymentMethod: z.enum(['COD', 'BANK_TRANSFER']),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Empty cart component
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
        Bạn chưa có sản phẩm nào để thanh toán
      </p>
      <Link href="/cua-hang">
        <Button className="bg-neutral-900 hover:bg-neutral-800 text-white px-8">
          TIẾP TỤC MUA SẮM
        </Button>
      </Link>
    </motion.div>
  );
}

// Loading skeleton
function CheckoutSkeleton() {
  return (
    <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-neutral-200 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-12 bg-neutral-100" />
              <div className="h-12 bg-neutral-100" />
              <div className="h-32 bg-neutral-100" />
            </div>
            <div className="h-96 bg-neutral-100" />
          </div>
        </div>
      </div>
    </main>
  );
}

// Payment method option component
function PaymentOption({
  value,
  label,
  description,
  icon: Icon,
  selected,
  onChange,
}: {
  value: 'COD' | 'BANK_TRANSFER';
  label: string;
  description: string;
  icon: React.ElementType;
  selected: boolean;
  onChange: (value: 'COD' | 'BANK_TRANSFER') => void;
}) {
  return (
    <label
      className={`relative flex items-start gap-4 p-4 border cursor-pointer transition-all ${
        selected
          ? 'border-neutral-900 bg-neutral-50'
          : 'border-neutral-200 hover:border-neutral-300'
      }`}
    >
      <input
        type="radio"
        name="paymentMethod"
        value={value}
        checked={selected}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
          selected ? 'border-neutral-900' : 'border-neutral-300'
        }`}
      >
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-neutral-900" />}
      </div>
      <div className="flex items-start gap-3 flex-1">
        <Icon className="w-5 h-5 text-neutral-600 mt-0.5" />
        <div>
          <p className="font-medium text-neutral-900">{label}</p>
          <p className="text-sm text-neutral-500">{description}</p>
        </div>
      </div>
    </label>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const { data: cart, isLoading: isCartLoading } = useCart();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'COD',
      shippingAddress: '',
      phone: user?.phone || '',
      note: '',
    },
  });

  // Pre-fill phone from user profile
  useEffect(() => {
    if (user?.phone) {
      setValue('phone', user.phone);
    }
  }, [user, setValue]);

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: (data: CreateOrderRequest) => orderApi.createOrder(data),
    onSuccess: (response) => {
      toast.success('Đặt hàng thành công!');
      // Invalidate cart query to clear cart
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      // Redirect to order detail page using the returned orderCode
      router.push(`/don-hang/${response.orderCode}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
    },
  });

  // Auth check - redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated && !isCartLoading) {
      toast.error('Vui lòng đăng nhập để thanh toán');
      router.push('/dang-nhap');
    }
  }, [isAuthenticated, isCartLoading, router]);

  // Cart check - redirect if empty
  useEffect(() => {
    if (!isCartLoading && cart && cart.items.length === 0) {
      router.push('/cua-hang');
    }
  }, [cart, isCartLoading, router]);

  const onSubmit = (data: CheckoutFormData) => {
    createOrderMutation.mutate(data);
  };

  const paymentMethod = watch('paymentMethod');

  if (isCartLoading) {
    return <CheckoutSkeleton />;
  }

  const hasItems = cart && cart.items.length > 0;

  if (!hasItems) {
    return (
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <EmptyCart />
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-medium tracking-wide text-neutral-900">
            THANH TOÁN
          </h1>
          <p className="text-sm text-neutral-500 mt-2">
            Hoàn tất đơn hàng của bạn
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Shipping Information */}
              <div className="border border-neutral-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="w-5 h-5 text-neutral-600" />
                  <h2 className="text-sm font-medium uppercase tracking-wide">
                    THÔNG TIN GIAO HÀNG
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Address */}
                  <div>
                    <label className="block text-sm text-neutral-600 mb-2">
                      Địa chỉ giao hàng <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register('shippingAddress')}
                      rows={3}
                      placeholder="Nhập địa chỉ đầy đủ của bạn"
                      className={`w-full px-3 py-2 border rounded-md text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-neutral-950 resize-none ${
                        errors.shippingAddress
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-neutral-200'
                      }`}
                    />
                    {errors.shippingAddress && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.shippingAddress.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm text-neutral-600 mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <Input
                        {...register('phone')}
                        type="tel"
                        placeholder="Nhập số điện thoại (10-15 số)"
                        className={`pl-10 ${
                          errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Note */}
                  <div>
                    <label className="block text-sm text-neutral-600 mb-2">
                      Ghi chú (tùy chọn)
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                      <textarea
                        {...register('note')}
                        rows={2}
                        placeholder="Ghi chú về đơn hàng, ví dụ: thờigian giao hàng"
                        className="w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-md text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-neutral-950 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="border border-neutral-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="w-5 h-5 text-neutral-600" />
                  <h2 className="text-sm font-medium uppercase tracking-wide">
                    PHƯƠNG THỨC THANH TOÁN
                  </h2>
                </div>

                <div className="space-y-3">
                  <PaymentOption
                    value="COD"
                    label="Thanh toán khi nhận hàng (COD)"
                    description="Bạn sẽ thanh toán bằng tiền mặt khi nhận được hàng"
                    icon={Truck}
                    selected={paymentMethod === 'COD'}
                    onChange={(value) => setValue('paymentMethod', value)}
                  />
                  <PaymentOption
                    value="BANK_TRANSFER"
                    label="Chuyển khoản ngân hàng"
                    description="Chuyển khoản qua tài khoản ngân hàng của chúng tôi"
                    icon={Building2}
                    selected={paymentMethod === 'BANK_TRANSFER'}
                    onChange={(value) => setValue('paymentMethod', value)}
                  />
                </div>
              </div>

              {/* Mobile Order Button */}
              <div className="lg:hidden">
                <Button
                  type="submit"
                  disabled={createOrderMutation.isPending}
                  className="w-full bg-neutral-900 hover:bg-neutral-800 text-white h-14 text-sm tracking-wide"
                >
                  {createOrderMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ĐANG XỬ LÝ...
                    </>
                  ) : (
                    'ĐẶT HÀNG'
                  )}
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Right Column - Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="lg:sticky lg:top-32">
              <div className="border border-neutral-200">
                {/* Header */}
                <div className="p-6 border-b border-neutral-200">
                  <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-900">
                    ĐƠN HÀNG CỦA BẠN
                  </h2>
                  <p className="text-sm text-neutral-500 mt-1">
                    {cart?.totalItems} sản phẩm
                  </p>
                </div>

                {/* Items List */}
                <div className="max-h-96 overflow-y-auto">
                  {cart?.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 border-b border-neutral-100 last:border-b-0"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-16 h-20 flex-shrink-0 bg-neutral-100 overflow-hidden">
                        {item.productImage ? (
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-neutral-400" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-neutral-900 truncate">
                          {item.productName}
                        </h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.size && (
                            <span className="text-xs text-neutral-500">
                              Size: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="text-xs text-neutral-500">
                              Màu: {item.color}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-neutral-500">
                            SL: {item.quantity}
                          </span>
                          <span className="text-sm font-medium text-neutral-900 font-mono">
                            {formatVND(item.subtotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="p-6 border-t border-neutral-200 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Tạm tính</span>
                    <span className="font-medium font-mono">
                      {formatVND(cart?.totalAmount || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Phí vận chuyển</span>
                    <span className="font-medium">Miễn phí</span>
                  </div>
                </div>

                {/* Total */}
                <div className="p-6 border-t border-neutral-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium uppercase tracking-wide">
                      Tổng cộng
                    </span>
                    <span className="text-xl font-medium text-neutral-900 font-mono">
                      {formatVND(cart?.totalAmount || 0)}
                    </span>
                  </div>
                </div>

                {/* Desktop Order Button */}
                <div className="hidden lg:block p-6 border-t border-neutral-200">
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={createOrderMutation.isPending}
                    className="w-full bg-neutral-900 hover:bg-neutral-800 text-white h-14 text-sm tracking-wide"
                  >
                    {createOrderMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ĐANG XỬ LÝ...
                      </>
                    ) : (
                      'ĐẶT HÀNG'
                    )}
                  </Button>
                </div>
              </div>

              {/* Back to cart link */}
              <Link
                href="/gio-hang"
                className="block text-center mt-4 text-sm text-neutral-600 hover:text-neutral-900 underline transition-colors"
              >
                Quay lại giỏ hàng
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
