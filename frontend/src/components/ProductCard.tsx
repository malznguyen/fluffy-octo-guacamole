"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Eye, Heart } from "lucide-react";
import { Product } from "@/lib/api/types";
import { useAddToCart } from "@/hooks/useCart";

interface ProductCardProps {
  product: Product;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const addToCart = useAddToCart();

  const mainImage =
    product.images?.[0]?.imageUrl ||
    `https://placehold.co/400x500/0a0a0a/ffffff?text=${encodeURIComponent(
      product.name
    )}`;

  const hasDiscount = product.salePrice && product.salePrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.basePrice - (product.salePrice || 0)) / product.basePrice) * 100
      )
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart.mutate({
      productId: product.id,
      quantity: 1,
    });
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/san-pham/${product.slug}`}>
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-4">
          {/* Main Image */}
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1">
              -{discountPercent}%
            </div>
          )}

          {/* New Badge */}
          {product.createdAt &&
            new Date(product.createdAt) >
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
              <div className="absolute top-3 right-3 bg-black text-white text-xs font-bold px-2 py-1">
                MỚI
              </div>
            )}

          {/* Hover Actions */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-4 flex gap-2 transition-all duration-500 ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <button
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-black text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              <ShoppingCart className="w-4 h-4" />
              Thêm Giỏ
            </button>
            <button className="w-12 flex items-center justify-center bg-white text-black hover:bg-neutral-100 transition-colors">
              <Eye className="w-4 h-4" />
            </button>
            <button className="w-12 flex items-center justify-center bg-white text-black hover:bg-neutral-100 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          {/* Category */}
          <p className="text-xs text-neutral-500 uppercase tracking-wider">
            {product.categoryName || "ThờI Trang"}
          </p>

          {/* Name */}
          <h3 className="text-sm font-medium text-black line-clamp-2 group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-lg font-bold text-red-600">
                  {formatPrice(product.salePrice || 0)}
                </span>
                <span className="text-sm text-neutral-400 line-through">
                  {formatPrice(product.basePrice)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-black">
                {formatPrice(product.basePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Image Skeleton */}
      <div className="aspect-[3/4] bg-neutral-200 animate-pulse" />

      {/* Text Skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-1/3 bg-neutral-200 rounded animate-pulse" />
        <div className="h-4 w-full bg-neutral-200 rounded animate-pulse" />
        <div className="h-5 w-1/2 bg-neutral-200 rounded animate-pulse" />
      </div>
    </div>
  );
}
