'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, User, ShoppingBag, X, ChevronDown, Package, LogOut, Shield, Heart } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';

export default function Header() {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
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
    <>
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
                TRANG CHỦ
              </Link>
              <Link
                href="/products"
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                SẢN PHẨM
              </Link>
              <div
                className="relative"
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onMouseLeave={() => setIsCategoriesOpen(false)}
              >
                <button className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors flex items-center">
                  DANH MỤC
                </button>
                {/* Categories Dropdown - Placeholder for future implementation */}
                {isCategoriesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-neutral-200 rounded-md shadow-lg py-2">
                    <div className="px-4 py-2 text-sm text-neutral-500">
                      Tải danh mục...
                    </div>
                  </div>
                )}
              </div>
              <Link
                href="/contact"
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                LIÊN HỆ
              </Link>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Tìm kiếm"
              >
                <Search className="w-5 h-5 text-neutral-900" />
              </button>

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
                      className={`w-4 h-4 text-neutral-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 shadow-xl z-50">
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-neutral-200">
                        <p className="font-bold uppercase text-neutral-900 truncate">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-neutral-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Tài khoản
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 transition-colors"
                        >
                          <Package className="w-4 h-4" />
                          Đơn hàng
                        </Link>
                      </div>

                      {/* Admin Link */}
                      {user?.role === 'ADMIN' && (
                        <>
                          <div className="border-t border-neutral-100 my-2" />
                          <Link
                            href="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium uppercase tracking-wider bg-black text-white hover:bg-neutral-800 transition-colors"
                          >
                            <Shield className="w-4 h-4" />
                            VÀO TRANG QUẢN TRỊ
                          </Link>
                          <div className="border-t border-neutral-100 my-2" />
                        </>
                      )}

                      {/* Divider */}
                      <div className="border-t border-neutral-100" />

                      {/* Logout */}
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-3 text-sm uppercase tracking-wider text-red-600 hover:bg-neutral-50 transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          Đăng xuất
                        </button>
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
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
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
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-start justify-center pt-32">
          <div className="bg-white w-full max-w-2xl mx-4 rounded-lg shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Tìm kiếm</h2>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
