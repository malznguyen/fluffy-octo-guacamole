'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductDTO } from '@/types/product';
import { formatPrice } from '@/lib/utils';
import { useWishlistStore } from '@/stores/wishlist-store';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';

interface ProductCardProps {
  product: ProductDTO;
  showNewBadge?: boolean;
  showHotBadge?: boolean;
}

export default function ProductCard({ product, showNewBadge = false, showHotBadge = false }: ProductCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  
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
  const price = variants.length > 0
    ? Math.min(...variants.map(v => v.finalPrice))
    : product.basePrice;

  // Handle heart click
  const handleHeartClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
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

  return (
    <div className="group relative">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative overflow-hidden bg-neutral-100">
          {/* Product Image */}
          <div className="aspect-[3/4] overflow-hidden">
            <Image
              src={imageUrl}
              alt={product.name}
              width={300}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Badges */}
          {isNew && (
            <span className="absolute top-3 left-3 bg-neutral-900 text-white text-xs font-bold px-3 py-1.5 uppercase tracking-wider">
              Mới
            </span>
          )}
          {showHotBadge && !isNew && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 uppercase tracking-wider">
              Hot
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-neutral-900 uppercase truncate">
            {product.name}
          </h3>
          <p className="text-base font-bold text-neutral-900 mt-1">
            {formatPrice(price)}
          </p>
        </div>
      </Link>

      {/* Heart Button */}
      <button
        onClick={handleHeartClick}
        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          inWishlist 
            ? 'bg-red-50 shadow-md' 
            : 'bg-white/90 opacity-0 group-hover:opacity-100 shadow-sm hover:bg-red-50'
        } ${isHeartAnimating ? 'scale-125' : 'scale-100'}`}
        title={inWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
      >
        <Heart 
          className={`w-4 h-4 transition-colors ${
            inWishlist 
              ? 'text-red-500 fill-red-500' 
              : 'text-neutral-600 hover:text-red-500'
          }`} 
        />
      </button>
    </div>
  );
}
