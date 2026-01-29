'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

export default function ProductDetailPage() {
    const params = useParams();
    const slug = params.slug as string;

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-32 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                        <Link href="/" className="hover:text-purple-600 transition-colors">
                            Trang Chủ
                        </Link>
                        <span>/</span>
                        <Link href="/cua-hang" className="hover:text-purple-600 transition-colors">
                            Cửa Hàng
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">{slug}</span>
                    </nav>

                    {/* Placeholder Content */}
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center mb-6">
                            <Package className="w-12 h-12 text-purple-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Trang Chi Tiết Sản Phẩm
                        </h1>
                        <p className="text-gray-600 mb-2 max-w-md">
                            Đang hiển thị sản phẩm: <span className="font-semibold text-purple-600">{slug}</span>
                        </p>
                        <p className="text-gray-500 mb-8 max-w-md">
                            Trang này đang được phát triển. Vui lòng quay lại sau.
                        </p>
                        <Link href="/">
                            <Button variant="outline" className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Quay Về Trang Chủ
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
