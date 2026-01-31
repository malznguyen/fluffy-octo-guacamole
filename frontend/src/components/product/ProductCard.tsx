'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductDTO } from '@/types/product';
import { formatPrice, cn } from '@/lib/utils';
import { useWishlistStore } from '@/stores/wishlist-store';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: ProductDTO;
  showNewBadge?: boolean;
  showHotBadge?: boolean;
}

export default function ProductCard({ product, showNewBadge = false, showHotBadge = false }: ProductCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { fetchCart } = useCartStore();
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const inWishlist = isInWishlist(product.id);

  // Get primary image or first image
  const images = product.images || [];
  const primaryImage = images.find(img => img.isPrimary) || images[0];
  const imageUrl = primaryImage?.imageUrl || '/placeholder-product.jpg';

  // Check if product is new (created within 7 days)
  const isNew = showNewBadge && (() => {
    const createdAt = new Date(product.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  })();

  // Get the lowest price from variants
  const variants = product.variants || [];
  const hasVariants = variants.length > 0;
  const lowestPrice = hasVariants
    ? Math.min(...variants.map(v => v.finalPrice))
    : product.basePrice;
  const highestPrice = hasVariants
    ? Math.max(...variants.map(v => v.finalPrice))
    : product.basePrice;
  
  // Check if product has discount
  const hasDiscount = variants.length > 0 && variants.some(v => v.discountPercent > 0);
  const maxDiscount = hasVariants
    ? Math.max(...variants.map(v => v.discountPercent || 0))
    : 0;
  
  // Check if out of stock
  const isOutOfStock = hasVariants && variants.every(v => v.stockQuantity === 0);

  // Handle wishlist toggle
  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào yêu thích');
      router.push('/login');
      return;
    }

    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 300);

    try {
      await toggleWishlist(product.id);
      if (inWishlist) {
        toast.success('Đã xóa khỏi danh sách yêu thích');
      } else {
        toast.success('Đã thêm vào danh sách yêu thích');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  // Handle add to cart
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
      router.push('/login');
      return;
    }

    if (!hasVariants) {
      toast.error('Sản phẩm không có sẵn');
      return;
    }

    // Find first available variant
    const availableVariant = variants.find(v => v.stockQuantity > 0);
    if (!availableVariant) {
      toast.error('Sản phẩm đã hết hàng');
      return;
    }

    setIsAddingToCart(true);
    try {
      await apiClient.post('/cart/items', {
        variantId: availableVariant.id,
        quantity: 1,
      });
      await fetchCart();
      toast.success('Đã thêm vào giỏ hàng');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại';
      toast.error(message);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="group relative">
      {/* Card Container with hover lift effect */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden transition-all duration-300 ease-out will-change-transform hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-900/5 hover:border-rose-200">
        {/* Image Container */}
        <Link href={`/products/${product.slug}`} className="block relative">
          <div className="relative overflow-hidden aspect-[3/4] bg-neutral-100">
            {/* Product Image with zoom */}
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            
            {/* Out of Stock Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-[2px]">
                <span className="bg-neutral-900 text-white text-sm font-bold px-4 py-2 rounded-lg">
                  Hết hàng
                </span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {/* Discount Badge */}
              {maxDiscount > 0 && (
                <span className="bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                  -{maxDiscount}%
                </span>
              )}
              {/* New Badge */}
              {isNew && (
                <span className="bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                  Mới
                </span>
              )}
              {/* Hot Badge */}
              {showHotBadge && !isNew && !maxDiscount && (
                <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                  Hot
                </span>
              )}
            </div>

            {/* Quick Actions - Bottom overlay when hover */}
            {!isOutOfStock && (
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
                {/* Add to Cart - Primary Button */}
                <Button 
                  className="flex-1 h-11 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-medium shadow-lg"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Thêm
                    </>
                  )}
                </Button>
                
                {/* Wishlist - Secondary Button (Icon only) */}
                <Button
                  variant="outline"
                  className={cn(
                    "w-11 h-11 p-0 rounded-lg border-2 bg-white hover:bg-rose-50",
                    inWishlist 
                      ? "border-rose-500 text-rose-600" 
                      : "border-neutral-200 text-neutral-600 hover:border-rose-200 hover:text-rose-600"
                  )}
                  onClick={handleWishlistToggle}
                >
                  <Heart className={cn("h-5 w-5", inWishlist && "fill-rose-600")} />
                </Button>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Product Name */}
            <h3 className="text-base font-semibold text-neutral-900 truncate mb-1 group-hover:text-rose-700 transition-colors">
              {product.name}
            </h3>
            
            {/* Category */}
            <p className="text-sm text-neutral-500 mb-2">
              {product.categoryName || 'Thời trang'}
            </p>
            
            {/* Rating */}
            {product.reviewCount && product.reviewCount > 0 ? (
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs text-neutral-600">
                  {product.averageRating?.toFixed(1) || '0.0'}
                </span>
                <span className="text-xs text-neutral-400">
                  ({product.reviewCount})
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-3.5 h-3.5 text-neutral-300" />
                <span className="text-xs text-neutral-400">Chưa có đánh giá</span>
              </div>
            )}
            
            {/* Price */}
            <div className="flex items-center gap-2">
              <p className="text-base font-bold text-neutral-900">
                {formatPrice(lowestPrice)}
              </p>
              {hasVariants && lowestPrice !== highestPrice && (
                <span className="text-sm text-neutral-400">-</span>
              )}
              {hasVariants && lowestPrice !== highestPrice && (
                <p className="text-sm text-neutral-500">
                  {formatPrice(highestPrice)}
                </p>
              )}
            </div>
            
            {/* Discount Original Price */}
            {maxDiscount > 0 && (
              <p className="text-xs text-neutral-400 line-through mt-1">
                {formatPrice(Math.max(...variants.map(v => v.price)))}
              </p>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
