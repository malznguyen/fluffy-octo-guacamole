'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Package, ChevronRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { getOrders, cancelOrder } from '@/lib/api/order';
import type { OrderDTO, OrderItemDTO } from '@/lib/api/order';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Types - re-export from API for local usage
type OrderStatusLocal = 'ALL' | 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';

type OrderStatus = OrderStatusLocal;

const statusLabels: Record<OrderStatus, string> = {
  ALL: 'TẤT CẢ',
  PENDING: 'CHỜ XÁC NHẬN',
  CONFIRMED: 'ĐÃ XÁC NHẬN',
  SHIPPED: 'ĐANG GIAO',
  DELIVERED: 'ĐÃ GIAO',
  COMPLETED: 'HOÀN THÀNH',
  CANCELLED: 'ĐÃ HỦY',
};

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

function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + 'đ';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderDTO[]>([]);
  const [activeTab, setActiveTab] = useState<OrderStatus>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // CRITICAL: Only fetch when token is available
    if (!token) {
      console.log('[Orders] Waiting for token...');
      return;
    }
    
    // Prevent double fetch in StrictMode
    if (hasFetched && currentPage === 0) return;
    
    setHasFetched(true);
    fetchOrders();
  }, [isAuthenticated, token, router, currentPage]);

  useEffect(() => {
    if (activeTab === 'ALL') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === activeTab));
    }
  }, [activeTab, orders]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const ordersData = await getOrders(currentPage, 10);
      setOrders(ordersData.content);
      setFilteredOrders(ordersData.content);
      setTotalPages(ordersData.totalPages);
    } catch (error) {
      console.error('[Orders] Failed to fetch orders:', error);
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderCode: string) => {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;

    try {
      await cancelOrder(orderCode);
      toast.success('Đã hủy đơn hàng');
      fetchOrders(); // Refresh list
    } catch (error) {
      toast.error('Không thể hủy đơn hàng');
    }
  };

  const tabs: OrderStatus[] = ['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED'];

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

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <h1 className="text-3xl font-black uppercase text-neutral-900 mb-8">
            ĐƠN HÀNG CỦA TÔI
          </h1>

          {orders.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-20">
              <Package className="w-16 h-16 text-neutral-300 mb-6" strokeWidth={1} />
              <p className="text-lg text-neutral-600 mb-8">Bạn chưa có đơn hàng nào</p>
              <Link
                href="/products"
                className="px-8 py-4 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                MUA SẮM NGAY
              </Link>
            </div>
          ) : (
            <>
              {/* Status Tabs */}
              <div className="flex flex-wrap gap-2 mb-8">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                      activeTab === tab
                        ? 'bg-black text-white'
                        : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {statusLabels[tab]}
                  </button>
                ))}
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12 text-neutral-500">
                    Không có đơn hàng nào trong trạng thái này
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <div
                      key={order.orderCode}
                      className="bg-white border border-neutral-200 p-6"
                    >
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div>
                          <p className="font-bold text-neutral-900 uppercase">
                            Mã đơn: {order.orderCode}
                          </p>
                          <p className="text-sm text-neutral-500 mt-1">
                            Ngày đặt: {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <span
                          className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                            statusBadgeStyles[order.status]
                          }`}
                        >
                          {statusDisplayText[order.status]}
                        </span>
                      </div>

                      {/* Items Summary */}
                      <div className="border-t border-neutral-200 pt-4">
                        <p className="text-right text-sm text-neutral-600">
                          Tổng {order.totalItems} sản phẩm -{' '}
                          <span className="font-bold text-neutral-900">
                            Thành tiền: {formatPrice(order.total)}
                          </span>
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-4 mt-4">
                        {order.status === 'PENDING' && (
                          <button
                            onClick={() => handleCancelOrder(order.orderCode)}
                            className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
                          >
                            HỦY ĐƠN
                          </button>
                        )}
                        <Link
                          href={`/orders/${order.orderCode}`}
                          className="inline-flex items-center gap-1 px-4 py-2 border border-neutral-900 text-neutral-900 text-xs font-bold uppercase tracking-wider hover:bg-neutral-900 hover:text-white transition-colors"
                        >
                          CHI TIẾT
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-10 h-10 text-sm font-bold transition-colors ${
                        currentPage === i
                          ? 'bg-black text-white'
                          : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
