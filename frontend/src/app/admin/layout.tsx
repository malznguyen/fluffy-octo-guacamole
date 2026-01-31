'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, Package, Grid, ShoppingCart,
  Users, CreditCard, ArrowLeft, LogOut
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  // Đợi Zustand rehydrate từ localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Guard: Chi ADMIN duoc vao
  useEffect(() => {
    if (!isHydrated) return;

    const checkAuth = setTimeout(() => {
      setIsLoading(false);

      if (!isAuthenticated) {
        router.push('/login?redirect=' + encodeURIComponent(pathname));
        return;
      }
      if (user?.role !== 'ADMIN') {
        router.push('/');
      }
    }, 100);

    return () => clearTimeout(checkAuth);
  }, [isHydrated, isAuthenticated, user, router, pathname]);

  const handleAdminLogout = () => {
    useAuthStore.getState().logout();
    document.cookie = 'fashon-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/');
  };

  // Hiển thị loading trong khi check auth
  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-semibold text-sm text-neutral-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* SIDEBAR - Fixed */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-neutral-900 text-white overflow-y-auto z-50 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-neutral-700">
          <Link href="/admin" className="text-2xl font-black tracking-widest">
            FASH.ON
          </Link>
          <p className="text-xs text-neutral-400 mt-1">
            Trang quản trị
          </p>
        </div>

        {/* Admin Info */}
        <div className="p-4 border-b border-neutral-700">
          <p className="text-sm font-semibold text-white">{user.fullName}</p>
          <p className="text-xs text-neutral-400">Quản trị viên</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <NavItem href="/admin" icon={LayoutDashboard} label="Tổng quan" />
          <NavItem href="/admin/products" icon={Package} label="Sản phẩm" />
          <NavItem href="/admin/categories" icon={Grid} label="Danh mục" />
          <NavItem href="/admin/orders" icon={ShoppingCart} label="Đơn hàng" />
          <NavItem href="/admin/users" icon={Users} label="Khách hàng" />
        </nav>

        {/* Footer Actions */}
        <div className="border-t border-neutral-700 p-4">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-300 hover:bg-neutral-800 transition-colors rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại shop
          </Link>
          <button
            onClick={handleAdminLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-900/20 transition-colors mt-2 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT - Scrollable */}
      <main className="ml-64 flex-1 min-h-screen bg-neutral-50">
        {children}
      </main>
    </div>
  );
}

// Component NavItem
function NavItem({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors border-l-4 border-transparent hover:border-blue-500"
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}
