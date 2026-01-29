'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Eye, ShoppingBag } from 'lucide-react';
import { formatVND } from '@/lib/api';
import { useCart } from '@/lib/hooks/use-cart';
import type { Product } from '@/types';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const addToCart = useCart((state) => state.addToCart);

    const mainImage = product.images?.[0]?.url || `https://placehold.co/400x500/e2e8f0/64748b?text=${encodeURIComponent(product.name)}`;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        addToCart({
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: product.basePrice,
            image: mainImage,
        });
    };

    return (
        <Link href={`/san-pham/${product.slug}`} className="group block">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
                {/* Product Image */}
                <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                        onClick={handleAddToCart}
                        className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-900 hover:bg-purple-600 hover:text-white transition-all duration-200 transform translate-y-4 group-hover:translate-y-0"
                        aria-label="Thêm vào giỏ hàng"
                    >
                        <ShoppingBag className="w-5 h-5" />
                    </button>
                    <button
                        className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-900 hover:bg-purple-600 hover:text-white transition-all duration-200 transform translate-y-4 group-hover:translate-y-0 delay-75"
                        aria-label="Xem nhanh"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                </div>

                {/* Sale Badge (if applicable) */}
                {product.soldCount && product.soldCount > 100 && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-semibold">
                        Bán Chạy
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="mt-4 space-y-2">
                <h3 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {product.name}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                        {formatVND(product.basePrice)}
                    </span>
                </div>
                {product.categoryName && (
                    <p className="text-sm text-gray-500">{product.categoryName}</p>
                )}
            </div>
        </Link>
    );
}
