'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  ArrowLeft,
  User,
  ShoppingBag,
  Package,
  LogOut,
  Save,
  ChevronRight,
  Loader2,
  Mail,
  Phone,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { FloatingInput } from '@/components/ui/floating-input';
import { Input } from '@/components/ui/input';
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

// Validation schema
const profileSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Vui lòng nhập họ tên')
    .max(255, 'Họ tên không được vượt quá 255 ký tự'),
  phone: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === '') return true;
      return /^(0|84|\+84)[35789]\d{8}$/.test(val.replace(/\s/g, ''));
    }, 'Số điện thoại không hợp lệ'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

type TabType = 'profile' | 'orders';

const statusBadgeStyles: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800 border border-amber-200',
  CONFIRMED: 'bg-blue-100 text-blue-800 border border-blue-200',
  SHIPPED: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
  DELIVERED: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  COMPLETED: 'bg-rose-100 text-rose-800 border border-rose-200',
  CANCELLED: 'bg-red-100 text-red-800 border border-red-200',
};

const statusDisplayText: Record<string, string> = {
  PENDING: 'CHỜ XÁC NHẬN',
  CONFIRMED: 'ĐÃ XÁC NHẬN',
  SHIPPED: 'ĐANG GIAO',
  DELIVERED: 'ĐÃ GIAO',
  COMPLETED: 'HOÀN THÀNH',
  CANCELLED: 'ĐÃ HỦY',
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Orders state
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: user?.fullName || '',
      phone: user?.phone || '',
    },
  });

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        phone: user.phone || '',
      });
    }
  }, [user, reset]);

  // Sync cookie on load
  useEffect(() => {
    const { token } = useAuthStore.getState();
    if (token) {
      document.cookie = `fashon-token=${token}; path=/; SameSite=Lax`;
    }
  }, []);

  // Fetch orders when orders tab is active
  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated) {
      fetchOrders();
    }
  }, [activeTab, isAuthenticated]);

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      // CRITICAL: Use /api/v1/orders (customer endpoint) - returns only current user's orders
      console.log('[Dashboard] Fetching orders from /api/v1/orders...');
      const response = await apiClient.get('/orders', {
        params: { page: 0, size: 5 }, // Get latest 5 orders
      });
      console.log('[Dashboard] Orders response:', response.data);
      
      if (response.data.success) {
        setOrders(response.data.data.content);
      }
    } catch (error: any) {
      console.error('[Dashboard] Failed to fetch orders:', error.response?.status, error.response?.data);
      if (error.response?.status === 403) {
        toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
      }
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const response = await apiClient.put('/users/me', {
        fullName: data.fullName,
        phone: data.phone || undefined,
      });

      if (response.data.success) {
        // Update Zustand store with new user data
        setUser({
          ...user,
          fullName: data.fullName,
          phone: data.phone,
        });

        // Reset form with new values
        reset({
          fullName: data.fullName,
          phone: data.phone || '',
        });

        toast.success('Cập nhật thông tin thành công');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      reset({
        fullName: user.fullName,
        phone: user.phone || '',
      });
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Navigation */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-neutral-900 hover:text-neutral-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            QUAY LẠI CỬA HÀNG
          </Link>

          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black uppercase text-neutral-900 mb-2">
              XIN CHÀO, {user.fullName}
            </h1>
            <p className="text-neutral-600">
              Quản lý thông tin cá nhân và đơn hàng của bạn
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT SIDEBAR - Vertical Tabs */}
            <div className="lg:col-span-3">
              <nav className="bg-white border border-neutral-200 rounded-xl overflow-hidden lg:border-r lg:border-y-0 lg:border-l-0 lg:-ml-px">
                {/* Profile Tab */}
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all duration-200 ease-in-out relative ${
                    activeTab === 'profile'
                      ? 'border-l-4 border-l-rose-600 bg-rose-50 text-rose-900 font-semibold'
                      : 'border-l-4 border-l-transparent text-neutral-500 hover:bg-rose-50/50 hover:text-rose-700'
                  }`}
                >
                  <User className={`w-5 h-5 transition-colors duration-200 ${
                    activeTab === 'profile' ? 'text-rose-600' : 'text-neutral-400'
                  }`} />
                  <span>Thông tin cá nhân</span>
                </button>

                {/* Orders Tab */}
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all duration-200 ease-in-out relative ${
                    activeTab === 'orders'
                      ? 'border-l-4 border-l-rose-600 bg-rose-50 text-rose-900 font-semibold'
                      : 'border-l-4 border-l-transparent text-neutral-500 hover:bg-rose-50/50 hover:text-rose-700'
                  }`}
                >
                  <ShoppingBag className={`w-5 h-5 transition-colors duration-200 ${
                    activeTab === 'orders' ? 'text-rose-600' : 'text-neutral-400'
                  }`} />
                  <span>Lịch sử đơn hàng</span>
                </button>

                {/* Divider */}
                <div className="mx-6 my-2 border-t border-neutral-200" />

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-6 py-4 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 border-l-4 border-l-transparent"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Đăng xuất</span>
                </button>
              </nav>
            </div>

            {/* RIGHT CONTENT */}
            <div className="lg:col-span-9 lg:pl-8">
              {/* TAB 1: PROFILE */}
              {activeTab === 'profile' && (
                <div className="bg-white border border-neutral-200 rounded-xl p-6 md:p-8 animate-in fade-in duration-200 slide-in-from-right-4">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Full Name */}
                    <FloatingInput
                      {...register('fullName')}
                      type="text"
                      label="Họ và tên"
                      error={errors.fullName?.message}
                      icon={User}
                    />

                    {/* Email - Disabled with icon */}
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 pointer-events-none z-10" />
                      <Input
                        type="email"
                        value={user.email}
                        disabled
                        className="pl-12 bg-neutral-50 text-neutral-500 cursor-not-allowed"
                      />
                      <p className="mt-2 text-xs text-neutral-500 ml-1">
                        Email không thể thay đổi
                      </p>
                    </div>

                    {/* Phone */}
                    <FloatingInput
                      {...register('phone')}
                      type="tel"
                      label="Số điện thoại (không bắt buộc)"
                      error={errors.phone?.message}
                      icon={Phone}
                    />

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="h-14 px-8 border-2 border-neutral-200 text-neutral-700 text-sm font-bold uppercase tracking-wider rounded-xl hover:border-neutral-400 hover:bg-neutral-50 transition-all duration-200"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={!isDirty || isSubmitting}
                        className="h-14 inline-flex items-center justify-center gap-2 px-8 bg-rose-600 text-white text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-500/20 hover:-translate-y-0.5 transition-all duration-200 disabled:bg-neutral-300 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            Lưu thay đổi
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: ORDERS */}
              {activeTab === 'orders' && (
                <div className="bg-white border border-neutral-200 rounded-xl p-6 md:p-8 animate-in fade-in duration-200 slide-in-from-right-4">
                  <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-900 mb-6">
                    ĐƠN HÀNG GẦN ĐÂY
                  </h2>

                  {isLoadingOrders ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                      <p className="text-neutral-600">Bạn chưa có đơn hàng nào</p>
                    </div>
                  ) : (
                    <>
                      {/* Orders List */}
                      <div className="divide-y divide-neutral-200">
                        {orders.map((order) => (
                          <div
                            key={order.orderCode}
                            className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                          >
                            <div>
                              <p className="font-bold text-neutral-900 uppercase">
                                {order.orderCode}
                              </p>
                              <p className="text-sm text-neutral-500 mt-1">
                                Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                              </p>
                              <p className="text-sm font-medium text-neutral-900 mt-1">
                                Tổng tiền: {order.total.toLocaleString('vi-VN')}đ
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span
                                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                                  statusBadgeStyles[order.status]
                                }`}
                              >
                                {statusDisplayText[order.status]}
                              </span>
                              <Link
                                href={`/orders/${order.orderCode}`}
                                className="text-sm font-bold text-neutral-900 hover:text-neutral-600 transition-colors flex items-center gap-1"
                              >
                                Chi tiết
                                <ChevronRight className="w-4 h-4" />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* View All Button */}
                      <Link
                        href="/orders"
                        className="mt-6 w-full flex items-center justify-center px-6 py-3 border border-neutral-900 text-neutral-900 text-sm font-bold uppercase tracking-wider hover:bg-neutral-900 hover:text-white transition-colors rounded-lg"
                      >
                        XEM TẤT CẢ ĐƠN HÀNG
                      </Link>
                    </>
                  )}
                </div>
              )}


            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
