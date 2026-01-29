"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { useTopSellingProducts } from "@/hooks/useProducts";

export function ProductGrid() {
  const { data: products, isLoading, error } = useTopSellingProducts();

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black font-display mb-4">
              SẢN PHẨM BÁN CHẠY
            </h2>
            <p className="text-neutral-600 max-w-xl">
              Những sản phẩm được yêu thích nhất với chất lượng và phong cách vượt trội
            </p>
          </div>
          <Link
            href="/cua-hang"
            className="hidden sm:inline-flex items-center gap-2 mt-4 sm:mt-0 text-sm font-medium text-black hover:text-red-600 transition-colors uppercase tracking-wider"
          >
            Xem Tất Cả
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16 bg-white rounded-lg">
            <p className="text-neutral-500 mb-2">
              Không thể tải sản phẩm.
            </p>
            <p className="text-sm text-neutral-400">
              Vui lòng thử lại sau.
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && products && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!products || products.length === 0) && (
          <div className="text-center py-16 bg-white rounded-lg">
            <p className="text-neutral-500">Chưa có sản phẩm nào.</p>
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/cua-hang"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-sm font-medium uppercase tracking-wider"
          >
            Xem Tất Cả
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
