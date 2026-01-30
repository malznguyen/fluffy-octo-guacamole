'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Package,
  ChevronRight,
  Loader2,
  CheckCircle,
  Truck,
  Home,
  Box,
  XCircle,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import apiClient from '@/lib/axios';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Types
interface OrderItemDTO {
  id: number;
  productNameSnapshot: string;
  variantInfoSnapshot: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface OrderDTO {
  id: number;
  orderCode: string;
  userId: number;
  customerName: string;
  customerEmail: string;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
  shippingAddress: string;
  phone: string;
  note?: string;
  items: OrderItemDTO[];
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

interface PaymentDTO {
  id: number;
  method: 'COD' | 'BANK_TRANSFER';
  amount: number;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  transactionCode?: string;
  paidAt?: string;
}

const statusBadgeStyles: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-black text-white',
  CANCELLED: 'bg-red-100 text-red-800',
};

const statusDisplayText: Record<string, string> = {
  PENDING: 'CHỜ XÁC NHẬN',
  CONFIRMED: 'ĐÃ XÁC NHẬN',
  SHIPPED: 'ĐANG GIAO',
  DELIVERED: 'ĐÃ GIAO',
  COMPLETED: 'HOÀN THÀNH',
  CANCELLED: 'ĐÃ HỦY',
};

const paymentMethodText: Record<string, string> = {
  COD: 'Thanh toán khi nhận hàng',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng',
};

const paymentStatusText: Record<string, string> = {
  PENDING: 'Chờ thanh toán',
  PAID: 'Đã thanh toán',
  FAILED: 'Thanh toán thất bại',
  REFUNDED: 'Đã hoàn tiền',
};

function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + 'đ';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Timeline steps
const timelineSteps = [
  { status: 'PENDING', label: 'Đặt hàng', icon: Box },
  { status: 'CONFIRMED', label: 'Xác nhận', icon: CheckCircle },
  { status: 'SHIPPED', label: 'Đang giao', icon: Truck },
  { status: 'COMPLETED', label: 'Hoàn thành', icon: Home },
];

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, token } = useAuthStore();
  const orderCode = params.orderCode as string;

  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [payments, setPayments] = useState<PaymentDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // CRITICAL: Only fetch when token is available to avoid 500 error
    if (!token) {
      console.log('[OrderDetail] Waiting for token...');
      return;
    }
    
    // Prevent double fetch in StrictMode
    if (hasFetched) return;
    
    if (orderCode) {
      setHasFetched(true);
      fetchOrderDetail();
    }
  }, [isAuthenticated, token, router, orderCode, hasFetched]);

  const fetchOrderDetail = async () => {
    setIsLoading(true);
    try {
      console.log('[OrderDetail] Fetching order:', orderCode);
      
      // Fetch order details
      const orderResponse = await apiClient.get(`/orders/${orderCode}`);
      if (orderResponse.data.success) {
        setOrder(orderResponse.data.data);
      }

      // Fetch payments (optional - don't fail if this errors)
      try {
        const paymentsResponse = await apiClient.get(`/orders/${orderCode}/payments`);
        if (paymentsResponse.data.success) {
          setPayments(paymentsResponse.data.data);
        }
      } catch (paymentError) {
        // Payments fetch is optional, just log don't error
        console.log('[OrderDetail] Payments fetch optional error');
      }
    } catch (error: any) {
      console.error('[OrderDetail] Failed to fetch order:', error.response?.status);
      
      // Handle specific error cases
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
        router.push('/login');
        return;
      } else if (error.response?.status === 404) {
        toast.error('Không tìm thấy đơn hàng');
      } else {
        toast.error('Không thể tải thông tin đơn hàng');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;

    try {
      const response = await apiClient.post(`/orders/${orderCode}/cancel`);
      if (response.data.success) {
        toast.success('Đã hủy đơn hàng');
        fetchOrderDetail();
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Không thể hủy đơn hàng';
      toast.error(message);
    }
  };

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    if (order.status === 'CANCELLED') return -1;
    const index = timelineSteps.findIndex((step) => step.status === order.status);
    return index >= 0 ? index : timelineSteps.length - 1;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />
        <main className="flex-1 pt-24 pb-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />
        <main className="flex-1 pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-lg text-neutral-600">Không tìm thấy đơn hàng</p>
            <Link
              href="/orders"
              className="mt-4 inline-block px-6 py-3 bg-black text-white text-sm font-bold uppercase tracking-wider"
            >
              QUAY LẠI DANH SÁCH
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentStepIndex = getCurrentStepIndex();
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-neutral-600 mb-8">
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              TRANG CHỦ
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/orders" className="hover:text-neutral-900 transition-colors">
              ĐƠN HÀNG CỦA TÔI
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-neutral-900">{order.orderCode}</span>
          </nav>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black uppercase text-neutral-900">
                Chi tiết đơn hàng
              </h1>
              <p className="text-neutral-600 mt-1">
                Mã đơn: <span className="font-bold">{order.orderCode}</span>
              </p>
            </div>
            <span
              className={`inline-block px-4 py-2 text-xs font-bold uppercase tracking-wider ${
                statusBadgeStyles[order.status]
              }`}
            >
              {statusDisplayText[order.status]}
            </span>
          </div>

          {/* Timeline - Only show if not cancelled */}
          {!isCancelled && (
            <div className="bg-white border border-neutral-200 p-6 mb-6">
              <div className="relative">
                <div className="flex items-center justify-between">
                  {timelineSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                      <div key={step.status} className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isActive
                              ? isCurrent
                                ? 'bg-black text-white'
                                : 'bg-neutral-900 text-white'
                              : 'bg-neutral-200 text-neutral-400'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span
                          className={`mt-2 text-xs font-bold uppercase ${
                            isActive ? 'text-neutral-900' : 'text-neutral-400'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {/* Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-neutral-200 -z-10">
                  <div
                    className="h-full bg-neutral-900 transition-all"
                    style={{
                      width: `${(currentStepIndex / (timelineSteps.length - 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Cancelled Notice */}
          {isCancelled && (
            <div className="bg-red-50 border border-red-200 p-6 mb-6">
              <div className="flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-600" />
                <div>
                  <p className="font-bold text-red-900">Đơn hàng đã bị hủy</p>
                  <p className="text-sm text-red-700">
                    Đơn hàng này đã bị hủy và không thể tiếp tục xử lý.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Order Info */}
            <div className="space-y-6">
              {/* Order Details */}
              <div className="bg-white border border-neutral-200 p-6">
                <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-900 mb-4">
                  Thông tin đơn hàng
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Mã đơn hàng</span>
                    <span className="font-medium">{order.orderCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Ngày đặt</span>
                    <span className="font-medium">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Trạng thái</span>
                    <span className="font-medium">{statusDisplayText[order.status]}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-white border border-neutral-200 p-6">
                <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-900 mb-4">
                  Thông tin giao hàng
                </h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-neutral-600 block">Người nhận</span>
                    <span className="font-medium">{order.customerName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-600 block">Số điện thoại</span>
                    <span className="font-medium">{order.phone}</span>
                  </div>
                  <div>
                    <span className="text-neutral-600 block">Địa chỉ</span>
                    <span className="font-medium">{order.shippingAddress}</span>
                  </div>
                  <div>
                    <span className="text-neutral-600 block">Ghi chú</span>
                    <span className="font-medium">{order.note || 'Không có'}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white border border-neutral-200 p-6">
                <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-900 mb-4">
                  Thông tin thanh toán
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Phương thức</span>
                    <span className="font-medium">
                      {payments.length > 0
                        ? paymentMethodText[payments[0].method]
                        : 'Chưa xác định'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Trạng thái</span>
                    <span className="font-medium">
                      {payments.length > 0
                        ? paymentStatusText[payments[0].status]
                        : 'Chưa xác định'}
                    </span>
                  </div>
                  {payments[0]?.transactionCode && (
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Mã giao dịch</span>
                      <span className="font-medium">{payments[0].transactionCode}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Items & Total */}
            <div>
              <div className="bg-white border border-neutral-200 p-6">
                <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-900 mb-4">
                  Sản phẩm đã đặt
                </h2>

                {/* Items List */}
                <div className="divide-y divide-neutral-200">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-4 flex justify-between">
                      <div>
                        <p className="font-medium text-neutral-900">
                          {item.productNameSnapshot}
                        </p>
                        <p className="text-sm text-neutral-500">{item.variantInfoSnapshot}</p>
                        <p className="text-sm text-neutral-600 mt-1">x{item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(item.subtotal)}</p>
                        <p className="text-xs text-neutral-500">
                          {formatPrice(item.unitPrice)} / sp
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t border-neutral-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">Tổng sản phẩm</span>
                    <span className="font-medium">{order.totalItems}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-lg font-bold uppercase">Tổng cộng</span>
                    <span className="text-xl font-black text-neutral-900">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-6">
                  <Link
                    href="/orders"
                    className="flex-1 text-center py-3 border border-neutral-900 text-neutral-900 text-sm font-bold uppercase tracking-wider hover:bg-neutral-900 hover:text-white transition-colors"
                  >
                    QUAY LẠI
                  </Link>
                  {order.status === 'PENDING' && (
                    <button
                      onClick={handleCancelOrder}
                      className="flex-1 py-3 bg-red-600 text-white text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-colors"
                    >
                      HỦY ĐƠN
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
