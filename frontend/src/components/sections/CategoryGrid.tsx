"use client";

import Link from "next/link";
import { useCategoriesTree } from "@/hooks/useCategories";
import { Category } from "@/lib/api/types";

function CategoryCard({ category }: { category: Category }) {
  // Generate a consistent color based on category id
  const colors = [
    "bg-neutral-900",
    "bg-red-700",
    "bg-orange-600",
    "bg-neutral-700",
    "bg-red-600",
  ];
  const colorClass = colors[category.id % colors.length];

  return (
    <Link
      href={`/cua-hang?category=${category.slug}`}
      className="group relative block overflow-hidden aspect-[4/5]"
    >
      {/* Background */}
      <div
        className={`absolute inset-0 ${colorClass} transition-transform duration-700 group-hover:scale-110`}
      />

      {/* Placeholder Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        <h3 className="text-2xl sm:text-3xl font-bold text-white font-display mb-2 transition-transform duration-500 group-hover:-translate-y-2">
          {category.name}
        </h3>
        <span className="inline-flex items-center text-sm text-white/80 font-medium uppercase tracking-wider opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          Khám Phá Ngay
          <svg
            className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </span>
      </div>

      {/* Border on hover */}
      <div className="absolute inset-0 border-4 border-white/0 transition-all duration-500 group-hover:border-white/30" />
    </Link>
  );
}

function CategorySkeleton() {
  return (
    <div className="relative overflow-hidden aspect-[4/5] bg-neutral-200 animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3/4 h-8 bg-neutral-300 rounded" />
      </div>
    </div>
  );
}

export function CategoryGrid() {
  const { data: categories, isLoading, error } = useCategoriesTree();

  // Take top 4-5 categories
  const featuredCategories = categories?.slice(0, 5) || [];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black font-display mb-4">
            DANH MỤC NỔI BẬT
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Khám phá các danh mục sản phẩm đa dạng với phong cách thờI trang hiện đại
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {[...Array(5)].map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-neutral-500">
              Không thể tải danh mục. Vui lòng thử lại sau.
            </p>
          </div>
        )}

        {/* Categories Grid */}
        {!isLoading && !error && featuredCategories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {featuredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && featuredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-500">Chưa có danh mục nào.</p>
          </div>
        )}
      </div>
    </section>
  );
}
