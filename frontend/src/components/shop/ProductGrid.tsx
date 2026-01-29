'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { ProductDTO } from '@/lib/api/types';

interface ProductGridProps {
  products: ProductDTO[];
  isLoading: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

function ProductCard({ product }: { product: ProductDTO }) {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get primary image or first image, with fallback
  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  
  // Build image URL with fallback to placeholder
  const getImageUrl = (image?: ProductDTO['images'][0]): string => {
    if (!image?.imageUrl) {
      return 'https://placehold.co/600x800/e5e5e5/171717?text=FASH.ON';
    }
    // Handle local paths by prepending backend URL
    if (image.imageUrl.startsWith('/backend/')) {
      return `http://localhost:8080${image.imageUrl}`;
    }
    return image.imageUrl;
  };
  
  const imageUrl = getImageUrl(primaryImage);
  
  // Safe price handling
  const basePrice = Number(product.basePrice || 0);
  const salePrice = product.salePrice ? Number(product.salePrice) : undefined;
  const displayPrice = salePrice || basePrice;
  const originalPrice = salePrice ? basePrice : null;

  return (
    <motion.div
      variants={itemVariants}
      layout
      className="group"
    >
      <Link href={`/san-pham/${product.slug}`} className="block">
        {/* Image Container - 3:4 Aspect Ratio */}
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-4">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Hover Overlay with Add to Cart */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                className="bg-white text-neutral-900 px-6 py-3 text-xs font-medium tracking-wider uppercase hover:bg-neutral-900 hover:text-white transition-colors duration-200 flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Add to cart functionality
                }}
              >
                <ShoppingBag className="h-4 w-4" />
                Thêm Vào Giỏ
              </button>
            </div>
          </div>

          {/* Discount Badge */}
          {product.discount && product.discount > 0 && (
            <div className="absolute top-3 left-3 bg-neutral-900 text-white px-2 py-1 text-xs font-medium">
              -{product.discount}%
            </div>
          )}

          {/* New Badge */}
          {product.isNew && !product.discount && (
            <div className="absolute top-3 left-3 bg-white text-neutral-900 px-2 py-1 text-xs font-medium">
              Mới
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          {/* Category */}
          <p className="text-xs text-neutral-500 tracking-wide">
            {product.categoryName}
          </p>

          {/* Name */}
          <h3 className="text-sm font-medium text-neutral-900 uppercase truncate">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-neutral-900">
              {formatPrice(displayPrice)}
            </span>
            {originalPrice && (
              <span className="text-xs text-neutral-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ProductSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className="space-y-4"
    >
      {/* Image Skeleton */}
      <div className="aspect-[3/4] bg-neutral-200 animate-pulse" />

      {/* Text Skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-16 bg-neutral-200 animate-pulse" />
        <div className="h-4 w-full max-w-[200px] bg-neutral-200 animate-pulse" />
        <div className="h-4 w-20 bg-neutral-200 animate-pulse" />
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full py-20 text-center"
    >
      <p className="text-neutral-500 text-sm tracking-wide">
        Không tìm thấy sản phẩm phù hợp.
      </p>
    </motion.div>
  );
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductSkeleton key={index} index={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </motion.div>
  );
}
