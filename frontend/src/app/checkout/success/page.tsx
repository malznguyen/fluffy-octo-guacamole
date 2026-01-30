'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Home, Package } from 'lucide-react';
import apiClient from '@/lib/axios';

interface OrderData {
  orderCode: string;
  total: number;
  paymentMethod: 'COD' | 'BANK_TRANSFER';
}

function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN');
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderCode = searchParams.get('orderCode');
  
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch order details
  useEffect(() => {
    if (!orderCode) {
      router.push('/');
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await apiClient.get(`/orders/${orderCode}`);
        if (response.data.success) {
          setOrderData({
            orderCode: response.data.data.orderCode,
            total: response.data.data.total,
            paymentMethod: response.data.data.paymentMethod || 'COD',
          });
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
        // Still show success page even if fetch fails
        setOrderData({
          orderCode: orderCode,
          total: 0,
          paymentMethod: 'COD',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderCode, router]);

  // Redirect if no orderCode
  useEffect(() => {
    if (!orderCode && !isLoading) {
      router.push('/');
    }
  }, [orderCode, isLoading, router]);

  if (!orderCode || isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-20 h-20 bg-neutral-200 rounded-full mx-auto mb-4"></div>
          <div className="h-8 bg-neutral-200 w-64 mx-auto"></div>
        </div>
      </div>
    );
  }

  const paymentMethodText = orderData?.paymentMethod === 'COD' 
    ? 'Thanh toán khi nhận hàng' 
    : 'Chuyển khoản ngân hàng';

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Simple Header with Logo only */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-center">
          <Link 
            href="/" 
            className="text-2xl font-black tracking-[0.2em] uppercase text-neutral-900"
          >
            FASH.ON
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <div className="w-full max-w-2xl mx-auto">
          
          {/* Success Icon with animation */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-black/5 rounded-full scale-150 animate-pulse"></div>
              <div className="relative w-24 h-24 rounded-full border-4 border-black flex items-center justify-center bg-white">
                <CheckCircle className="w-12 h-12 text-black" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-center text-neutral-900 mb-4">
            ĐẶT HÀNG THÀNH CÔNG
          </h1>

          {/* Subtext */}
          <p className="text-neutral-600 text-center mb-2 text-lg">
            Cảm ơn bạn đã mua sắm tại FASH.ON
          </p>
          <p className="text-neutral-500 text-sm text-center mb-8">
            Đơn hàng của bạn đã được xác nhận và đang được xử lý
          </p>

          {/* Order Info Card */}
          <div className="bg-white border border-neutral-200 p-6 md:p-8 max-w-md w-full mx-auto">
            {/* Order Code */}
            <div className="text-center mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
                MÃ ĐƠN HÀNG
              </p>
              <p className="text-2xl font-mono font-bold text-neutral-900">
                {orderData?.orderCode || orderCode}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-neutral-200 my-4"></div>

            {/* Order Details */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Tổng thanh toán</span>
                <span className="font-bold text-xl text-neutral-900">
                  {formatPrice(orderData?.total || 0)}đ
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Phương thức thanh toán</span>
                <span className="text-sm font-medium text-neutral-900">
                  {paymentMethodText}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 max-w-md w-full mx-auto mt-8">
            {/* Primary: Continue Shopping */}
            <Link
              href="/"
              className="flex items-center justify-center gap-3 w-full bg-black text-white py-4 font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
            >
              <Home className="w-5 h-5" />
              TIẾP TỤC MUA SẮM
            </Link>

            {/* Secondary: View Order Details */}
            <Link
              href={`/orders/${orderCode}`}
              className="flex items-center justify-center gap-3 w-full border-2 border-black text-black py-4 font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
            >
              <Package className="w-5 h-5" />
              XEM CHI TIẾT ĐƠN HÀNG
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Support Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500 mb-1">
              Bạn có thể theo dõi trạng thái đơn hàng trong mục{' '}
              <Link href="/orders" className="text-neutral-900 underline hover:no-underline">
                Đơn hàng của tôi
              </Link>
            </p>
            <p className="text-xs text-neutral-400">
              Mọi thắc mắc xin liên hệ hotline: 1900 xxxx
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
