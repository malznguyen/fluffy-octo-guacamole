'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTopSellingProducts } from '@/lib/hooks/use-products';
import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export function BestSellersGrid() {
    const { data: products, isLoading, error } = useTopSellingProducts(8);

    if (error) {
        return (
            <section className="py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-gray-500">
                        Không thể tải sản phẩm. Vui lòng thử lại sau.
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
                    <div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Sản Phẩm Bán Chạy
                        </h2>
                        <p className="text-gray-600 max-w-2xl">
                            Những sản phẩm được yêu thích nhất từ cộng đồng FASH.ON
                        </p>
                    </div>
                    <Link href="/cua-hang?sort=best-selling" className="mt-6 lg:mt-0">
                        <Button variant="outline" className="group">
                            Xem Tất Cả
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
                    {isLoading ? (
                        // Skeleton loading
                        Array.from({ length: 8 }).map((_, index) => (
                            <div key={index} className="space-y-4">
                                <Skeleton className="aspect-[3/4] rounded-2xl" />
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-6 w-1/2" />
                            </div>
                        ))
                    ) : products && products.length > 0 ? (
                        // Actual products
                        products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        // Fallback empty state
                        <div className="col-span-full text-center py-12 text-gray-500">
                            Chưa có sản phẩm nào.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
