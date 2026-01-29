'use client';

import Link from 'next/link';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/lib/hooks/use-cart';

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    const getCartCount = useCart((state) => state.getCartCount);
    const items = useCart((state) => state.items);

    useEffect(() => {
        setCartCount(getCartCount());
    }, [items, getCartCount]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/95 backdrop-blur-md shadow-lg'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <span className="text-3xl font-black text-gray-900 tracking-tight">
                            FASH.ON
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            href="/"
                            className={`text-sm font-medium transition-colors hover:text-purple-600 ${isScrolled ? 'text-gray-900' : 'text-gray-900'
                                }`}
                        >
                            Trang Chủ
                        </Link>
                        <Link
                            href="/cua-hang"
                            className={`text-sm font-medium transition-colors hover:text-purple-600 ${isScrolled ? 'text-gray-900' : 'text-gray-900'
                                }`}
                        >
                            Cửa Hàng
                        </Link>
                        <div className="relative group">
                            <button
                                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-purple-600 ${isScrolled ? 'text-gray-900' : 'text-gray-900'
                                    }`}
                            >
                                Danh Mục
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            {/* Dropdown menu placeholder */}
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <div className="py-2">
                                    <Link
                                        href="/cua-hang?category=1"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                                    >
                                        Áo Nam
                                    </Link>
                                    <Link
                                        href="/cua-hang?category=2"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                                    >
                                        Áo Nữ
                                    </Link>
                                    <Link
                                        href="/cua-hang?category=3"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                                    >
                                        Quần Jeans
                                    </Link>
                                    <Link
                                        href="/cua-hang?category=4"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                                    >
                                        Phụ Kiện
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Icons */}
                    <div className="flex items-center gap-4">
                        <button
                            className={`p-2 rounded-full transition-colors hover:bg-gray-100 ${isScrolled ? 'text-gray-900' : 'text-gray-900'
                                }`}
                            aria-label="Tìm kiếm"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                        <button
                            className={`p-2 rounded-full transition-colors hover:bg-gray-100 ${isScrolled ? 'text-gray-900' : 'text-gray-900'
                                }`}
                            aria-label="Yêu thích"
                        >
                            <Heart className="w-5 h-5" />
                        </button>
                        <Link
                            href="/gio-hang"
                            className={`relative p-2 rounded-full transition-colors hover:bg-gray-100 ${isScrolled ? 'text-gray-900' : 'text-gray-900'
                                }`}
                            aria-label="Giỏ hàng"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {cartCount > 0 && (
                                <Badge
                                    variant="cart"
                                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] p-0"
                                >
                                    {cartCount > 99 ? '99+' : cartCount}
                                </Badge>
                            )}
                        </Link>
                        <Link
                            href="/dang-nhap"
                            className={`p-2 rounded-full transition-colors hover:bg-gray-100 ${isScrolled ? 'text-gray-900' : 'text-gray-900'
                                }`}
                            aria-label="Tài khoản"
                        >
                            <User className="w-5 h-5" />
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 rounded-full hover:bg-gray-100"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <nav className="flex flex-col gap-4">
                            <Link
                                href="/"
                                className="text-sm font-medium text-gray-900 hover:text-purple-600"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Trang Chủ
                            </Link>
                            <Link
                                href="/cua-hang"
                                className="text-sm font-medium text-gray-900 hover:text-purple-600"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Cửa Hàng
                            </Link>
                            <Link
                                href="/cua-hang"
                                className="text-sm font-medium text-gray-900 hover:text-purple-600"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Danh Mục
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
