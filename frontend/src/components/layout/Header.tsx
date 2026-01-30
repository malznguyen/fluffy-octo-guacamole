'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Search, User, ShoppingBag, ChevronDown, X, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/hooks/use-cart';
import { useAuthStore } from '@/lib/store/use-auth-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { publicApi } from '@/lib/api/services';
import { ProductDTO } from '@/lib/api/types';

const navItems = [
  { label: 'TRANG CHỦ', href: '/' },
  { label: 'CỬA HÀNG', href: '/cua-hang' },
  { label: 'BỘ SƯU TẬP', href: '/bo-suu-tap' },
  { label: 'VỀ CHÚNG TÔI', href: '/ve-chung-toi' },
];

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

function MagneticButton({ children, className = '', onClick }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.2);
    y.set((e.clientY - centerY) * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.button>
  );
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProductDTO[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { data: cart } = useCart();
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // FIX HYDRATION: Wait until client mounts before checking auth state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check auth on mount
  useEffect(() => {
    useAuthStore.getState().checkAuth();
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await publicApi.getProductsPaginated({
          search: searchQuery,
          size: 5,
        });
        setSearchResults(response.content);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
      router.push(`/cua-hang?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleProductClick = (slug: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    router.push(`/san-pham/${slug}`);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debugging logic
  console.log('HEADER STATE:', { isMounted, isAuthenticated, user });

  const cartItemCount = cart?.totalItems || 0;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass border-b border-neutral-200/50'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <motion.span
              className="font-display text-xl font-medium tracking-[0.3em] text-neutral-900"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              F A S H . O N
            </motion.span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Link
                  href={item.href}
                  className="relative text-xs font-medium tracking-[0.15em] text-neutral-700 hover:text-neutral-900 transition-colors group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-neutral-900 transition-all duration-300 group-hover:w-full" />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <MagneticButton
              className="p-3 hover:bg-neutral-100/50 transition-colors"
              aria-label="Tìm kiếm"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-5 h-5 text-neutral-700" />
            </MagneticButton>

            {/* User Icon / Dropdown */}
            {!isMounted ? (
              // While loading/hydrating, show a skeleton (safe default to prevent layout shift)
              <div className="p-3">
                <User className="w-5 h-5 text-neutral-400" />
              </div>
            ) : isAuthenticated ? (
              // AUTHENTICATED STATE: DROPDOWN ONLY - NO LINK WRAPPER
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-3 hover:bg-neutral-100/50 transition-colors flex items-center gap-1 outline-none focus:outline-none">
                    <User className="w-5 h-5 text-neutral-900" />
                    <ChevronDown className="w-3 h-3 text-neutral-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="font-semibold text-neutral-900">
                      {user?.fullName || user?.email}
                    </p>
                    <p className="text-xs text-neutral-500 font-normal">{user?.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/tai-khoan" className="cursor-pointer">
                      Tài Khoản
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/don-hang" className="cursor-pointer">
                      Đơn Hàng
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                      window.location.href = '/';
                    }}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    Đăng Xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // GUEST STATE: LINK TO LOGIN
              <Link href="/dang-nhap">
                <MagneticButton
                  className="p-3 hover:bg-neutral-100/50 transition-colors"
                  aria-label="Tài khoản"
                >
                  <User className="w-5 h-5 text-neutral-700" />
                </MagneticButton>
              </Link>
            )}

            <Link href="/gio-hang">
              <MagneticButton
                className="relative p-3 hover:bg-neutral-100/50 transition-colors"
                aria-label="Giỏ hàng"
              >
                <ShoppingBag className="w-5 h-5 text-neutral-700" />
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-neutral-900 text-white text-[10px] font-medium"
                  >
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </motion.span>
                )}
              </MagneticButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsSearchOpen(false)}
            />

            {/* Search Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-0 left-0 right-0 bg-white z-50 shadow-lg"
            >
              <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-6">
                {/* Search Header */}
                <div className="flex items-center gap-4 mb-6">
                  <Search className="w-6 h-6 text-neutral-400" />
                  <form onSubmit={handleSearchSubmit} className="flex-1">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Tìm kiếm sản phẩm..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-lg bg-transparent border-none outline-none placeholder:text-neutral-400 text-neutral-900"
                    />
                  </form>
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 hover:bg-neutral-100 transition-colors"
                    aria-label="Đóng"
                  >
                    <X className="w-6 h-6 text-neutral-500" />
                  </button>
                </div>

                {/* Search Results */}
                <div className="border-t border-neutral-200 pt-4">
                  {isSearching ? (
                    <div className="py-8 text-center">
                      <div className="inline-block w-6 h-6 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
                    </div>
                  ) : searchQuery.trim() && searchResults.length === 0 ? (
                    <div className="py-8 text-center text-neutral-500">
                      Không tìm thấy sản phẩm nào
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-4">
                      <p className="text-xs uppercase tracking-wider text-neutral-500 mb-4">
                        Sản phẩm ({searchResults.length})
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleProductClick(product.slug)}
                            className="flex items-center gap-4 p-3 hover:bg-neutral-50 transition-colors text-left group"
                          >
                            <div className="relative w-16 h-16 bg-neutral-100 flex-shrink-0 overflow-hidden">
                              {product.images?.[0]?.imageUrl ? (
                                <Image
                                  src={product.images[0].imageUrl.startsWith('/backend/')
                                    ? `http://localhost:8080${product.images[0].imageUrl}`
                                    : product.images[0].imageUrl}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ShoppingBag className="w-6 h-6 text-neutral-300" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-neutral-900 truncate group-hover:text-neutral-600 transition-colors">
                                {product.name}
                              </p>
                              <p className="text-sm text-neutral-500 font-mono">
                                {formatPrice(product.finalPrice || product.basePrice)}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                      <div className="pt-4 border-t border-neutral-200">
                        <button
                          onClick={handleSearchSubmit}
                          className="flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors"
                        >
                          Xem tất cả kết quả
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-neutral-500">
                      Nhập từ khóa để tìm kiếm sản phẩm
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
