import Link from 'next/link';
import Image from 'next/image';
import { ProductDTO } from '@/types/product';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: ProductDTO;
  showNewBadge?: boolean;
  showHotBadge?: boolean;
}

export default function ProductCard({ product, showNewBadge = false, showHotBadge = false }: ProductCardProps) {
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

  return (
    <Link href={`/products/${product.slug}`} className="group block">
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
  );
}
