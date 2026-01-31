'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, ShoppingBag, ChevronDown, Package, LogOut, Shield, Heart, UserCog, Settings } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';

export default function Header() {
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Auth store
  const { user, isAuthenticated, logout } = useAuthStore();
  
  // Cart store
  const { cart, fetchCart } = useCartStore();

  // Wishlist store
  const { items: wishlistItems, fetchWishlist } = useWishlistStore();

  // Fetch cart and wishlist when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    }
  }, [isAuthenticated, fetchCart, fetchWishlist]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    document.cookie = 'fashon-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Admin logout ve trang chu store, khach hang ve login
    if (user?.role === 'ADMIN') {
      router.push('/');
    } else {
      router.push('/login');
    }
    
    setIsUserMenuOpen(false);
  };

  // Get user initials for avatar
  const getUserInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get cart item count
  const cartItemCount = cart?.totalItems || 0;

  // Get wishlist item count
  const wishlistCount = wishlistItems.length;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-black tracking-[0.2em] uppercase text-neutral-900">
            FASH.ON
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              href="/products"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Sản phẩm
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Liên hệ
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-neutral-100 rounded-full transition-colors"
                  aria-label="Tài khoản"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
                    {getUserInitials(user.fullName)}
                  </div>
                  {/* Name - hidden on mobile */}
                  <span className="hidden md:block text-sm font-medium text-neutral-900 max-w-[100px] truncate">
                    {user.fullName}
                  </span>
                  <ChevronDown 
                    className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                  />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 origin-top-right animate-in fade-in zoom-in-95 duration-200 ease-out">
                    {/* Arrow indicator */}
                    <div className="absolute -top-1.5 right-4 w-3 h-3 bg-white border-l border-t border-neutral-200 rotate-45 transform" />
                    
                    {/* Menu container */}
                    <div className="relative bg-white rounded-xl border border-neutral-200 shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] overflow-hidden">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-neutral-100">
                        <p className="font-bold text-neutral-900 truncate text-sm">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-neutral-500 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="p-1.5">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 rounded-lg transition-colors"
                        >
                          <User className="w-4 h-4 text-neutral-400" />
                          Tài khoản
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 rounded-lg transition-colors"
                        >
                          <Package className="w-4 h-4 text-neutral-400" />
                          Đơn hàng
                        </Link>
                        
                        {/* Admin Link */}
                        {user?.role === 'ADMIN' && (
                          <>
                            <div className="border-t border-neutral-100 my-1.5" />
                            <Link
                              href="/admin"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200"
                            >
                              <UserCog className="w-4 h-4" />
                              Trang quản trị
                            </Link>
                          </>
                        )}
                        
                        <div className="border-t border-neutral-100 my-1.5" />
                        
                        {/* Logout */}
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Tài khoản"
              >
                <User className="w-5 h-5 text-neutral-900" />
              </Link>
            )}

            {/* Wishlist Link with Badge */}
            <Link
              href="/wishlist"
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors relative"
              aria-label="Danh sách yêu thích"
            >
              <Heart className="w-5 h-5 text-neutral-900" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link with Badge */}
            <Link
              href="/cart"
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors relative"
              aria-label="Giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5 text-neutral-900" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
