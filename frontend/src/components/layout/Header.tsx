'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingBag, X } from 'lucide-react';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

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
              <Link
                href="/login"
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Tài khoản"
              >
                <User className="w-5 h-5 text-neutral-900" />
              </Link>
              <Link
                href="/cart"
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors relative"
                aria-label="Giỏ hàng"
              >
                <ShoppingBag className="w-5 h-5 text-neutral-900" />
                <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  0
                </span>
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
