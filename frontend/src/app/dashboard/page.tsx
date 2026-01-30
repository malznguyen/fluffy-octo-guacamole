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
  Package,
  LogOut,
  Save,
  Lock,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
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

type TabType = 'profile' | 'orders' | 'password';

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

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
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
            {/* LEFT SIDEBAR */}
            <div className="lg:col-span-3">
              <nav className="space-y-2">
                {/* Profile Tab */}
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-black text-white'
                      : 'border border-neutral-200 text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  THÔNG TIN CÁ NHÂN
                </button>

                {/* Orders Tab */}
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-black text-white'
                      : 'border border-neutral-200 text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  ĐƠN HÀNG CỦA TÔI
                </button>

                {/* Password Tab */}
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
                    activeTab === 'password'
                      ? 'bg-black text-white'
                      : 'border border-neutral-200 text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  ĐỔI MẬT KHẨU
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider text-red-600 border-t border-neutral-200 mt-4 pt-4 hover:text-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  ĐĂNG XUẤT
                </button>
              </nav>
            </div>

            {/* RIGHT CONTENT */}
            <div className="lg:col-span-9">
              {/* TAB 1: PROFILE */}
              {activeTab === 'profile' && (
                <div className="bg-white border border-neutral-200 p-6 md:p-8">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-[0.1em] text-neutral-600 mb-2">
                        HỌ VÀ TÊN
                      </label>
                      <input
                        type="text"
                        {...register('fullName')}
                        placeholder="Nguyễn Văn A"
                        className="w-full border border-neutral-300 py-3 px-4 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                      />
                      {errors.fullName && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-[0.1em] text-neutral-600 mb-2">
                        EMAIL
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full border border-neutral-300 bg-neutral-100 py-3 px-4 text-neutral-500 cursor-not-allowed"
                      />
                      <p className="mt-2 text-xs text-neutral-500">
                        Email không thể thay đổi
                      </p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-[0.1em] text-neutral-600 mb-2">
                        SỐ ĐIỆN THOẠI (KHÔNG BẮT BUỘC)
                      </label>
                      <input
                        type="tel"
                        {...register('phone')}
                        placeholder="0901234567"
                        className="w-full border border-neutral-300 py-3 px-4 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                      />
                      {errors.phone && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-3 border border-neutral-900 text-neutral-900 text-sm font-bold uppercase tracking-wider hover:bg-neutral-100 transition-colors"
                      >
                        HỦY
                      </button>
                      <button
                        type="submit"
                        disabled={!isDirty || isSubmitting}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ĐANG LƯU...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            LƯU THAY ĐỔI
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: ORDERS */}
              {activeTab === 'orders' && (
                <div className="bg-white border border-neutral-200 p-6 md:p-8">
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
                        className="mt-6 w-full flex items-center justify-center px-6 py-3 border border-neutral-900 text-neutral-900 text-sm font-bold uppercase tracking-wider hover:bg-neutral-900 hover:text-white transition-colors"
                      >
                        XEM TẤT CẢ ĐƠN HÀNG
                      </Link>
                    </>
                  )}
                </div>
              )}

              {/* TAB 3: CHANGE PASSWORD */}
              {activeTab === 'password' && (
                <div className="bg-white border border-neutral-200 p-6 md:p-8">
                  <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-900 mb-6">
                    THAY ĐỔI MẬT KHẨU
                  </h2>

                  <div className="space-y-6">
                    {/* Current Password */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-[0.1em] text-neutral-600 mb-2">
                        MẬT KHẨU HIỆN TẠI
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          disabled
                          placeholder="••••••••"
                          className="w-full border border-neutral-300 bg-neutral-100 py-3 px-4 pr-12 text-neutral-500 cursor-not-allowed"
                        />
                        <button
                          type="button"
                          disabled
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 cursor-not-allowed"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-[0.1em] text-neutral-600 mb-2">
                        MẬT KHẨU MỚI
                      </label>
                      <input
                        type="password"
                        disabled
                        placeholder="Tính năng đang được phát triển"
                        className="w-full border border-neutral-300 bg-neutral-100 py-3 px-4 text-neutral-500 cursor-not-allowed"
                      />
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-[0.1em] text-neutral-600 mb-2">
                        XÁC NHẬN MẬT KHẨU MỚI
                      </label>
                      <input
                        type="password"
                        disabled
                        placeholder="Tính năng đang được phát triển"
                        className="w-full border border-neutral-300 bg-neutral-100 py-3 px-4 text-neutral-500 cursor-not-allowed"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      disabled
                      className="w-full px-6 py-3 bg-neutral-300 text-white text-sm font-bold uppercase tracking-wider cursor-not-allowed"
                    >
                      CẬP NHẬT MẬT KHẨU
                    </button>
                  </div>

                  <div className="mt-6 p-4 bg-neutral-50 border border-neutral-200">
                    <p className="text-sm text-neutral-600">
                      Tính năng đang được phát triển
                    </p>
                  </div>
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
