'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, ChevronLeft, Minus, Plus, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useProduct } from '@/hooks/useProducts';
import { useAddToCart } from '@/hooks/useCart';
import { toast } from 'sonner';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: product, isLoading } = useProduct(slug);
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<number | undefined>();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-20 h-20" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
        <p className="text-muted-foreground mb-6">
          Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Link href="/shop">
          <Button>Quay Lại Cửa Hàng</Button>
        </Link>
      </div>
    );
  }

  const images = product.images || [];
  const mainImage = images[selectedImage]?.imageUrl || '/placeholder.png';
  const price = product.basePrice;

  const selectedVariantData = product.variants.find((v) => v.id === selectedVariant);
  const finalPrice = selectedVariantData ? selectedVariantData.finalPrice : price;

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Vui lòng chọn biến thể trước khi thêm vào giỏ hàng');
      return;
    }
    addToCart(
      {
        productId: product.id,
        variantId: selectedVariant,
        quantity,
      },
      {
        onSuccess: () => {
          toast.success('Đã thêm vào giỏ hàng');
        },
        onError: () => {
          toast.error('Không thể thêm vào giỏ hàng. Vui lòng thử lại.');
        },
      }
    );
  };

  // Mock reviews - in a real app, these would come from the API
  const reviews = [
    {
      id: 1,
      userName: 'Nguyễn Văn A',
      rating: 5,
      comment: 'Sản phẩm rất đẹp, chất lượng tốt, giao hàng nhanh!',
      date: '2025-01-20T10:00:00Z',
    },
    {
      id: 2,
      userName: 'Trần Thị B',
      rating: 4,
      comment: 'Đúng như hình, màu sắc đẹp, đáng mua.',
      date: '2025-01-15T14:30:00Z',
    },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary">
          Trang Chủ
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-primary">
          Cửa Hàng
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image.imageUrl}
                    alt={image.altText || product.name}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Danh mục: {product.categoryName || 'Chưa phân loại'}</span>
              <span>•</span>
              <span>SKU: {product.variants[0]?.sku || 'N/A'}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">(4.0/5 - 2 đánh giá)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(finalPrice)}</span>
            </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Mô tả sản phẩm</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description || 'Chưa có mô tả cho sản phẩm này.'}
            </p>
          </div>

          {/* Variants */}
          {product.variants.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Chọn biến thể</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant.id)}
                    disabled={!variant.inStock}
                    className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                      selectedVariant === variant.id
                        ? 'border-primary bg-primary text-primary-foreground'
                        : !variant.inStock
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 hover:border-primary'
                    }`}
                  >
                    {variant.size}
                    {variant.color && ` / ${variant.color}`}
                    {variant.priceAdjustment > 0 && ` (+${formatPrice(variant.priceAdjustment)})`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="font-semibold mb-3">Số lượng</h3>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium text-lg">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              size="lg"
              className="flex-1 gap-2"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {isAddingToCart ? 'Đang thêm...' : 'Thêm Vào Giỏ Hàng'}
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">7</div>
              <div className="text-xs text-muted-foreground">Ngày đổi trả</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-xs text-muted-foreground">Chính hãng</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Freeship</div>
              <div className="text-xs text-muted-foreground">Đơn từ 500K</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Đánh Giá Sản Phẩm</h2>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium">{review.userName}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(review.date)}
                      </div>
                    </div>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Chưa có đánh giá nào cho sản phẩm này.</p>
        )}
      </div>

      {/* Back Button */}
      <div className="mt-12">
        <Link href="/shop">
          <Button variant="outline" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Quay Lại Cửa Hàng
          </Button>
        </Link>
      </div>
    </div>
  );
}
