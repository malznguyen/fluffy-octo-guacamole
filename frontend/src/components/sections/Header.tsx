"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  ShoppingCart,
  Package,
} from "lucide-react";
import { useUser, useLogout } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useCategoriesTree } from "@/hooks/useCategories";

export function Header() {
  const router = useRouter();
  const { data: user } = useUser();
  const { data: cart } = useCart();
  const { data: categories } = useCategoriesTree();
  const logout = useLogout();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cartItemCount = cart?.totalItems || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/cua-hang?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navItems = [
    { name: "Trang Chủ", href: "/" },
    { name: "Cửa Hàng", href: "/cua-hang" },
    { name: "Danh Mục", href: "#", hasDropdown: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-neutral-200">
      {/* Top Bar */}
      <div className="bg-black text-white py-2 text-center text-xs tracking-wide">
        <p className="font-medium">MIỄN PHÍ VẬN CHUYỂN CHO ĐƠN HÀNG TỪ 500.000Đ</p>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 -ml-2 text-black hover:text-neutral-600 transition-colors"
            aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl lg:text-3xl font-black tracking-tighter text-black font-display">
              FASH.ON
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setIsCategoryMenuOpen(true)}
                onMouseLeave={() => item.hasDropdown && setIsCategoryMenuOpen(false)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 text-sm font-medium text-black hover:text-neutral-600 transition-colors uppercase tracking-wider"
                >
                  {item.name}
                  {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                </Link>

                {/* Categories Dropdown */}
                {item.hasDropdown && isCategoryMenuOpen && categories && (
                  <div className="absolute top-full left-0 w-64 bg-white shadow-lg border border-neutral-200 py-2 mt-0">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/cua-hang?category=${category.slug}`}
                        className="block px-4 py-2 text-sm text-black hover:bg-neutral-100 transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-black hover:text-neutral-600 transition-colors"
              aria-label="Tìm kiếm"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/yeu-thich"
              className="hidden sm:block p-2 text-black hover:text-neutral-600 transition-colors"
              aria-label="Yêu thích"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <Link
              href="/gio-hang"
              className="relative p-2 text-black hover:text-neutral-600 transition-colors"
              aria-label="Giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </Link>

            {/* User */}
            <div className="relative">
              {user ? (
                <div
                  onMouseEnter={() => setIsUserMenuOpen(true)}
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <button
                    className="flex items-center gap-1 p-2 text-black hover:text-neutral-600 transition-colors"
                    aria-label="Tài khoản"
                  >
                    <User className="w-5 h-5" />
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full w-56 bg-white shadow-lg border border-neutral-200 py-2">
                      <div className="px-4 py-2 border-b border-neutral-200">
                        <p className="text-sm font-medium text-black">{user.fullName}</p>
                        <p className="text-xs text-neutral-500">{user.email}</p>
                      </div>
                      <Link
                        href="/tai-khoan"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-black hover:bg-neutral-100 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Tài Khoản
                      </Link>
                      <Link
                        href="/don-hang"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-black hover:bg-neutral-100 transition-colors"
                      >
                        <Package className="w-4 h-4" />
                        Đơn Hàng
                      </Link>
                      {user.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-black hover:bg-neutral-100 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Quản Trị
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng Xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/dang-nhap"
                  className="p-2 text-black hover:text-neutral-600 transition-colors"
                  aria-label="Đăng nhập"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-neutral-200 shadow-lg animate-slide-down">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="flex-1 px-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors"
                autoFocus
              />
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white font-medium hover:bg-neutral-800 transition-colors"
              >
                Tìm Kiếm
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="px-4 py-3 border border-neutral-300 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-neutral-200 shadow-lg">
          <nav className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.hasDropdown ? (
                  <div>
                    <button
                      onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                      className="flex items-center justify-between w-full py-2 text-sm font-medium text-black uppercase tracking-wider"
                    >
                      {item.name}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isCategoryMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isCategoryMenuOpen && categories && (
                      <div className="pl-4 space-y-1">
                        {categories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/cua-hang?category=${category.slug}`}
                            onClick={() => setIsMenuOpen(false)}
                            className="block py-2 text-sm text-neutral-600 hover:text-black transition-colors"
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-sm font-medium text-black uppercase tracking-wider"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <hr className="my-4" />
            {user ? (
              <>
                <Link
                  href="/tai-khoan"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-sm text-black"
                >
                  <User className="w-4 h-4" />
                  Tài Khoản
                </Link>
                <Link
                  href="/don-hang"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-sm text-black"
                >
                  <Package className="w-4 h-4" />
                  Đơn Hàng
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 py-2 text-sm text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng Xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/dang-nhap"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-sm text-black"
                >
                  <User className="w-4 h-4" />
                  Đăng Nhập
                </Link>
                <Link
                  href="/dang-ky"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-sm text-black"
                >
                  <User className="w-4 h-4" />
                  Đăng Ký
                </Link>
              </>
            )}
            <Link
              href="/yeu-thich"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-sm text-black"
            >
              <Heart className="w-4 h-4" />
              Yêu Thích
            </Link>
            <Link
              href="/gio-hang"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-sm text-black"
            >
              <ShoppingCart className="w-4 h-4" />
              Giỏ Hàng {cartItemCount > 0 && `(${cartItemCount})`}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
