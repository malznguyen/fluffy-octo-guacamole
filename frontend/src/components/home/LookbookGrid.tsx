'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTopSellingProducts } from '@/hooks/useProducts';
import { useAddToCart } from '@/hooks/useCart';
import { ProductDTO } from '@/lib/api/types';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Check } from 'lucide-react';

// Format price in VND
function formatPrice(price: number | undefined | null): string {
  if (price === undefined || price === null || isNaN(price)) {
    return 'Liên hệ';
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
}

// Fallback products if API fails
const fallbackProducts: ProductDTO[] = [
  {
    id: 1,
    name: 'Áo Sơ Mi Nam Cao Cấp',
    slug: 'ao-so-mi-nam-cao-cap',
    price: 850000,
    salePrice: 680000,
    categoryId: 1,
    categoryName: 'Áo Nam',
    images: [{ id: 1, url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80', alt: 'Áo sơ mi nam', isPrimary: true }],
    variants: [{ id: 1, size: 'M', color: 'Trắng', stockQuantity: 10 }],
    isNew: true,
    discount: 20,
  },
  {
    id: 2,
    name: 'Váy Liền Nữ Elegance',
    slug: 'vay-lien-nu-elegance',
    price: 1200000,
    categoryId: 2,
    categoryName: 'Áo Nữ',
    images: [{ id: 2, url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80', alt: 'Váy liền nữ', isPrimary: true }],
    variants: [{ id: 2, size: 'S', color: 'Đen', stockQuantity: 5 }],
    isNew: true,
  },
  {
    id: 3,
    name: 'Blazer Nam Premium',
    slug: 'blazer-nam-premium',
    price: 2500000,
    salePrice: 2000000,
    categoryId: 1,
    categoryName: 'Áo Nam',
    images: [{ id: 3, url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80', alt: 'Blazer nam', isPrimary: true }],
    variants: [{ id: 3, size: 'L', color: 'Xanh Navy', stockQuantity: 8 }],
    discount: 20,
  },
  {
    id: 4,
    name: 'Túi Xách Da Thật',
    slug: 'tui-xach-da-that',
    price: 1800000,
    categoryId: 3,
    categoryName: 'Phụ Kiện',
    images: [{ id: 4, url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80', alt: 'Túi xách', isPrimary: true }],
    variants: [{ id: 4, stockQuantity: 15 }],
  },
  {
    id: 5,
    name: 'Giày Lườ Nam Classic',
    slug: 'giay-luoi-nam-classic',
    price: 1500000,
    salePrice: 1200000,
    categoryId: 4,
    categoryName: 'Giày Dép',
    images: [{ id: 5, url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&q=80', alt: 'Giày lườ', isPrimary: true }],
    variants: [{ id: 5, size: '42', color: 'Nâu', stockQuantity: 12 }],
    discount: 20,
  },
  {
    id: 6,
    name: 'Áo Khoác Dù Unisex',
    slug: 'ao-khoac-du-unisex',
    price: 950000,
    categoryId: 1,
    categoryName: 'Áo Nam',
    images: [{ id: 6, url: 'https://images.unsplash.com/photo-1551028919-ac76c9028d1e?w=600&q=80', alt: 'Áo khoác dù', isPrimary: true }],
    variants: [{ id: 6, size: 'XL', color: 'Xám', stockQuantity: 20 }],
    isNew: true,
  },
];

interface ProductCardProps {
  product: ProductDTO;
  index: number;
}

function ProductCard({ product, index }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const addToCart = useAddToCart();

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    await addToCart.mutateAsync({
      productId: product.id,
      variantId: product.variants[0]?.id,
      quantity: 1,
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
  const hasDiscount = product.discount && product.discount > 0;
  const hasValidPrice = product.price !== undefined && product.price !== null && !isNaN(product.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Link href={`/san-pham/${product.slug}`}>
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-4">
          <Image
            src={primaryImage?.url || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="px-3 py-1 bg-neutral-900 text-white text-[10px] font-medium tracking-wider uppercase">
                MỚI
              </span>
            )}
            {hasDiscount && (
              <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-medium tracking-wider uppercase">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Quick Add Button */}
          <AnimatePresence>
            {isHovered && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                onClick={handleQuickAdd}
                disabled={addToCart.isPending}
                className="absolute bottom-4 left-4 right-4 py-3 bg-white/95 backdrop-blur-sm text-neutral-900 text-xs font-medium tracking-[0.1em] uppercase flex items-center justify-center gap-2 hover:bg-white transition-colors"
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    ĐÃ THÊM
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    THÊM NHANH
                  </>
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <p className="text-[10px] text-neutral-500 tracking-[0.1em] uppercase">
            {product.categoryName || 'Danh mục'}
          </p>
          <h3 className="font-medium text-neutral-900 text-sm leading-tight line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            {hasValidPrice ? (
              hasDiscount && product.salePrice ? (
                <>
                  <span className="font-semibold text-neutral-900">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-sm text-neutral-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="font-semibold text-neutral-900">
                  {formatPrice(product.price)}
                </span>
              )
            ) : (
              <span className="font-semibold text-neutral-900">
                Liên hệ
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function LookbookGrid() {
  const { data: products, isLoading, isError } = useTopSellingProducts();
  
  // Use fallback products if API fails or returns empty
  const displayProducts = (isError || !products || products.length === 0) 
    ? fallbackProducts 
    : products;

  if (isLoading) {
    return (
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-[1800px]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[3/4] bg-neutral-200 animate-pulse" />
                <div className="h-4 bg-neutral-200 animate-pulse w-2/3" />
                <div className="h-4 bg-neutral-200 animate-pulse w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="mx-auto max-w-[1800px]">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="text-xs font-medium tracking-[0.3em] text-neutral-500 uppercase">
            Bán Chạy Nhất
          </span>
          <h2 className="mt-4 font-display text-5xl sm:text-6xl lg:text-7xl font-semibold text-neutral-900 tracking-tight">
            SẢN PHẨM NỔI BẬT
          </h2>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {displayProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link
            href="/cua-hang"
            className="inline-flex items-center gap-2 px-8 py-4 border border-neutral-900 text-neutral-900 text-xs font-medium tracking-[0.15em] uppercase hover:bg-neutral-900 hover:text-white transition-all duration-300"
          >
            Xem Tất Cả Sản Phẩm
            <svg 
              className="w-4 h-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
