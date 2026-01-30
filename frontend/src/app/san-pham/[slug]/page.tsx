'use client';

import { useProductDetail } from '@/hooks/useProductDetail';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default function ProductPage({ params }: ProductPageProps) {
    const { slug } = use(params);
    const { data: product, isLoading, isError, error } = useProductDetail(slug);

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                    <p className="text-sm text-neutral-500 uppercase tracking-widest">
                        Đang tải...
                    </p>
                </div>
            </div>
        );
    }

    // Error State
    if (isError || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-6 max-w-md px-4">
                    <h1 className="text-2xl font-display font-bold uppercase">
                        Không tìm thấy sản phẩm
                    </h1>
                    <p className="text-neutral-600">
                        {error?.message || 'Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.'}
                    </p>
                    <Link
                        href="/cua-hang"
                        className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest hover:underline underline-offset-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Quay lại cửa hàng
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-20">
            {/* Product Content */}
            <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left Column - Product Gallery (60-65%) */}
                    <div className="lg:col-span-7">
                        <ProductGallery
                            images={product.images}
                            productName={product.name}
                        />
                    </div>

                    {/* Right Column - Product Info (35-40%) - Sticky */}
                    <div className="lg:col-span-5 relative">
                        <div className="lg:sticky lg:top-24">
                            <ProductInfo product={product} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Back to Shop Link */}
            <div className="border-t border-neutral-200">
                <div className="container mx-auto px-4 lg:px-8 py-8">
                    <Link
                        href="/cua-hang"
                        className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest hover:underline underline-offset-4 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Tiếp tục mua sắm
                    </Link>
                </div>
            </div>
        </main>
    );
}
