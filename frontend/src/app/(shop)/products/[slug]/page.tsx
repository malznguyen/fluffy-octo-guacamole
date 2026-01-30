'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw,
  Heart,
  Share2,
  PackageX,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { fetchProductBySlug, fetchAllProducts } from '@/lib/api';
import { ProductDTO, ProductVariantDTO, ProductImageDTO } from '@/types/product';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';
import ProductCard from '@/components/product/ProductCard';

// Mock reviews data
const mockReviews = [
  { id: 1, userName: 'Nguyễn Văn A', rating: 5, date: '2026-01-15', content: 'Sản phẩm rất đẹp, chất lượng tốt, giao hàng nhanh!', avatar: 'NA' },
  { id: 2, userName: 'Trần Thị B', rating: 4, date: '2026-01-10', content: 'Đúng như mô tả, size vừa vặn. Sẽ mua thêm lần sau.', avatar: 'TB' },
  { id: 3, userName: 'Lê Văn C', rating: 5, date: '2026-01-05', content: 'Chất liệu cao cấp, đáng đồng tiền bát gạo.', avatar: 'LC' },
];

// Get image URL with base URL
const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/placeholder-product.jpg';

  // Nếu đã là full URL (http/https) thì return ngay
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Nếu là relative path (/uploads/...), nối với API base
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';
  // Bỏ /api/v1 nếu có, vì ảnh thường ở root hoặc /uploads
  const domain = baseUrl.replace('/api/v1', '');
  return `${domain}${imagePath}`;
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // Cart store
  const { addItem, isLoading: isAddingToCart } = useCartStore();

  // Product data states
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI states
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantDTO | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'details'>('description');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewContent, setReviewContent] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fetch product data
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);

      const productData = await fetchProductBySlug(slug);

      if (productData) {
        setProduct(productData);

        // Fetch related products from same category
        const allProducts = await fetchAllProducts();
        const related = allProducts
          .filter(p => p.categoryId === productData.categoryId && p.id !== productData.id)
          .slice(0, 4);
        setRelatedProducts(related);

        // Auto-select if only one variant
        if (productData.variants.length === 1) {
          const variant = productData.variants[0];
          setSelectedColor(variant.color);
          setSelectedSize(variant.size);
          setSelectedVariant(variant);
        }
      } else {
        setError('Sản phẩm không tồn tại');
      }

      setLoading(false);
    };

    if (slug) {
      loadProduct();
    }
  }, [slug]);

  // Sort images by sortOrder
  const sortedImages = useMemo(() => {
    if (!product) return [];
    return [...product.images].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }, [product]);

  // Get main image
  const mainImage = sortedImages[selectedImageIndex] || sortedImages[0];

  // Get unique colors and sizes
  const { colors, sizes } = useMemo(() => {
    if (!product) return { colors: [], sizes: [] };

    const colorSet = new Set<string>();
    const sizeSet = new Set<string>();

    product.variants.forEach(v => {
      if (v.color) colorSet.add(v.color);
      if (v.size) sizeSet.add(v.size);
    });

    return {
      colors: Array.from(colorSet),
      sizes: Array.from(sizeSet),
    };
  }, [product]);

  // Get available sizes for selected color
  const availableSizesForColor = useMemo(() => {
    if (!product || !selectedColor) return sizes;
    return product.variants
      .filter(v => v.color === selectedColor && v.isAvailable)
      .map(v => v.size);
  }, [product, selectedColor, sizes]);

  // Get available colors for selected size
  const availableColorsForSize = useMemo(() => {
    if (!product || !selectedSize) return colors;
    return product.variants
      .filter(v => v.size === selectedSize && v.isAvailable)
      .map(v => v.color);
  }, [product, selectedSize, colors]);

  // Check if color is available (has at least one available variant)
  const isColorAvailable = (color: string): boolean => {
    if (!product) return false;
    return product.variants.some(v => v.color === color && v.isAvailable);
  };

  // Check if size is available for selected color
  const isSizeAvailable = (size: string): boolean => {
    if (!product) return false;
    if (!selectedColor) return product.variants.some(v => v.size === size && v.isAvailable);
    return product.variants.some(v => v.size === size && v.color === selectedColor && v.isAvailable);
  };

  // Update selected variant when color or size changes
  useEffect(() => {
    if (product && selectedColor && selectedSize) {
      const variant = product.variants.find(
        v => v.color === selectedColor && v.size === selectedSize
      );
      setSelectedVariant(variant || null);
      setQuantity(1);
    }
  }, [selectedColor, selectedSize, product]);

  // Handle image navigation
  const handlePrevImage = () => {
    setSelectedImageIndex(prev => (prev === 0 ? sortedImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex(prev => (prev === sortedImages.length - 1 ? 0 : prev + 1));
  };

  // Handle quantity change
  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    const maxQty = selectedVariant?.stockQuantity || 1;
    if (newQty >= 1 && newQty <= maxQty) {
      setQuantity(newQty);
    }
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error('Vui lòng chọn màu sắc và kích thước');
      return;
    }

    if (!selectedVariant.inStock || selectedVariant.stockQuantity < 1) {
      toast.error('Sản phẩm đã hết hàng');
      return;
    }

    try {
      await addItem(selectedVariant.id, quantity);
      toast.success('Đã thêm vào giỏ hàng!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Không thể thêm vào giỏ hàng';
      // Handle specific error cases
      if (error.response?.status === 403) {
        toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
      } else if (error.response?.status === 400) {
        toast.error(message);
      } else {
        toast.error(message);
      }
    }
  };

  // Handle buy now
  const handleBuyNow = async () => {
    if (!selectedVariant) {
      toast.error('Vui lòng chọn màu sắc và kích thước');
      return;
    }

    if (!selectedVariant.inStock || selectedVariant.stockQuantity < 1) {
      toast.error('Sản phẩm đã hết hàng');
      return;
    }

    try {
      await addItem(selectedVariant.id, quantity);
      router.push('/checkout');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Không thể thêm vào giỏ hàng';
      if (error.response?.status === 403) {
        toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
      } else {
        toast.error(message);
      }
    }
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép liên kết!');
    }
  };

  // Handle review submit
  const handleReviewSubmit = () => {
    alert('Cảm ơn bạn đã đánh giá! Tính năng đang được phát triển.');
    setReviewRating(0);
    setReviewContent('');
  };

  // Calculate average rating
  const averageRating = useMemo(() => {
    const total = mockReviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / mockReviews.length).toFixed(1);
  }, []);

  // Get current price
  const currentPrice = selectedVariant?.finalPrice || product?.basePrice || 0;
  const hasDiscount = selectedVariant && selectedVariant.priceAdjustment > 0;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-4 w-48 bg-neutral-200 animate-pulse mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-[3/4] bg-neutral-200 animate-pulse" />
            <div className="space-y-6">
              <div className="h-10 w-3/4 bg-neutral-200 animate-pulse" />
              <div className="h-8 w-1/3 bg-neutral-200 animate-pulse" />
              <div className="h-4 w-full bg-neutral-200 animate-pulse" />
              <div className="h-4 w-2/3 bg-neutral-200 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col items-center justify-center text-center">
            <PackageX className="w-20 h-20 text-neutral-300 mb-6" strokeWidth={1} />
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">Sản phẩm không tồn tại</h1>
            <p className="text-neutral-600 mb-8">Sản phẩm bạn tìm kiếm không có hoặc đã bị xóa.</p>
            <Link
              href="/products"
              className="px-8 py-4 bg-neutral-900 text-white font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
            >
              Về trang sản phẩm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm uppercase tracking-wider text-neutral-600 flex items-center flex-wrap gap-2">
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link
              href={`/products?categoryId=${product.categoryId}`}
              className="hover:text-neutral-900 transition-colors"
            >
              {product.categoryName}
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Image Gallery */}
            <div>
              {/* Main Image */}
              <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden group">
                {mainImage ? (
                  <Image
                    src={getImageUrl(mainImage.imageUrl)}
                    alt={mainImage.altText || product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    unoptimized={true}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400">
                    Không có ảnh
                  </div>
                )}

                {/* Navigation Arrows */}
                {sortedImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="Ảnh trước"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="Ảnh sau"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {sortedImages.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {sortedImages.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-20 h-20 flex-shrink-0 overflow-hidden border-2 transition-colors ${index === selectedImageIndex
                        ? 'border-neutral-900'
                        : 'border-neutral-200 opacity-70 hover:opacity-100'
                        }`}
                    >
                      <Image
                        src={getImageUrl(img.imageUrl)}
                        alt={img.altText || ''}
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized={true}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              {/* Product Name */}
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-neutral-900 mb-4">
                {product.name}
              </h1>

              {/* Price Section */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-bold text-neutral-900">
                  {formatPrice(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-neutral-400 line-through">
                    {formatPrice(product.basePrice)}
                  </span>
                )}
              </div>

              {/* SKU & Stock */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm text-neutral-500">
                  Mã: {selectedVariant?.sku || 'Chưa chọn'}
                </span>
                {selectedVariant && (
                  <span
                    className={`text-sm font-bold uppercase ${selectedVariant.inStock && selectedVariant.stockQuantity > 0
                      ? 'text-green-600'
                      : 'text-red-600'
                      }`}
                  >
                    {selectedVariant.inStock && selectedVariant.stockQuantity > 0
                      ? 'Còn hàng'
                      : 'Hết hàng'}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-neutral-600 mb-6 leading-relaxed">
                {product.description.length > 200
                  ? product.description.slice(0, 200) + '...'
                  : product.description}
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 mb-8 py-4 border-y border-neutral-200">
                <div className="flex items-center gap-2 text-xs text-neutral-600">
                  <Truck className="w-5 h-5" />
                  <span>Giao hàng toàn quốc</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-600">
                  <Shield className="w-5 h-5" />
                  <span>Bảo hành 30 ngày</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-600">
                  <RotateCcw className="w-5 h-5" />
                  <span>Đổi trả miễn phí</span>
                </div>
              </div>

              {/* Variant Selection */}
              <div className="space-y-6 py-6 border-t border-neutral-200">
                {/* Color Selection */}
                {colors.length > 0 && (
                  <div>
                    <label className="text-sm font-bold uppercase tracking-wider mb-3 block text-neutral-900">
                      Màu sắc
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {colors.map(color => {
                        const isAvailable = isColorAvailable(color);
                        const isSelected = selectedColor === color;
                        const isColorHex = /^#[0-9A-F]{6}$/i.test(color);

                        return (
                          <button
                            key={color}
                            onClick={() => isAvailable && setSelectedColor(color)}
                            disabled={!isAvailable}
                            className={`relative min-w-[2.5rem] h-10 px-2 rounded-md border-2 transition-all ${isSelected
                              ? 'ring-2 ring-black ring-offset-2'
                              : 'hover:scale-110'
                              } ${!isAvailable
                                ? 'opacity-50 cursor-not-allowed'
                                : 'cursor-pointer'
                              }`}
                            style={
                              isColorHex
                                ? { backgroundColor: color, borderColor: isSelected ? 'black' : '#e5e5e5' }
                                : { borderColor: isSelected ? 'black' : '#e5e5e5' }
                            }
                            title={color}
                          >
                            {!isColorHex && (
                              <span className="text-xs font-medium">{color}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {selectedColor && (
                      <p className="text-sm text-neutral-600 mt-2">Đã chọn: {selectedColor}</p>
                    )}
                  </div>
                )}

                {/* Size Selection */}
                {sizes.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                        Kích thước
                      </label>
                      <button className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors">
                        Bảng size
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {sizes.map(size => {
                        const isAvailable = isSizeAvailable(size);
                        const isSelected = selectedSize === size;

                        return (
                          <button
                            key={size}
                            onClick={() => isAvailable && setSelectedSize(size)}
                            disabled={!isAvailable}
                            className={`px-6 py-3 border text-sm font-medium uppercase transition-colors ${isSelected
                              ? 'bg-neutral-900 text-white border-neutral-900'
                              : isAvailable
                                ? 'border-neutral-300 hover:border-neutral-900'
                                : 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                              }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity & Actions */}
              <div className="space-y-6 py-6 border-t border-neutral-200">
                {/* Quantity */}
                <div>
                  <label className="text-sm font-bold uppercase tracking-wider mb-3 block text-neutral-900">
                    Số lượng
                  </label>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-12 h-12 border border-neutral-300 flex items-center justify-center hover:border-neutral-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      readOnly
                      className="w-16 h-12 border-t border-b border-neutral-300 text-center font-medium"
                    />
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={!selectedVariant || quantity >= (selectedVariant?.stockQuantity || 1)}
                      className="w-12 h-12 border border-neutral-300 flex items-center justify-center hover:border-neutral-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                    {selectedVariant && (
                      <span className="ml-4 text-sm text-neutral-500">
                        Còn {selectedVariant.stockQuantity} sản phẩm
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedVariant || !selectedVariant.inStock || isAddingToCart}
                    className="flex items-center justify-center gap-2 w-full bg-neutral-900 text-white py-4 font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAddingToCart ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <ShoppingBag className="w-5 h-5" />
                    )}
                    Thêm vào giỏ
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="w-full border-2 border-neutral-900 text-neutral-900 py-4 font-bold uppercase tracking-wider hover:bg-neutral-900 hover:text-white transition-colors"
                  >
                    Mua ngay
                  </button>
                </div>

                {/* Wishlist/Share */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`flex items-center gap-2 text-sm transition-colors ${isWishlisted ? 'text-red-600' : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    Yêu thích
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    Chia sẻ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Description Tabs */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex gap-8 border-b border-neutral-200 mb-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === 'description'
                ? 'text-neutral-900'
                : 'text-neutral-500 hover:text-neutral-900'
                }`}
            >
              Mô tả sản phẩm
              {activeTab === 'description' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === 'details'
                ? 'text-neutral-900'
                : 'text-neutral-500 hover:text-neutral-900'
                }`}
            >
              Chi tiết
              {activeTab === 'details' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'description' ? (
            <div className="prose max-w-none">
              <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-neutral-200">
                  <span className="text-neutral-600">Danh mục</span>
                  <span className="font-medium">{product.categoryName}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-neutral-200">
                  <span className="text-neutral-600">Chất liệu</span>
                  <span className="font-medium">Đang cập nhật</span>
                </div>
                <div className="flex justify-between py-3 border-b border-neutral-200">
                  <span className="text-neutral-600">Xuất xứ</span>
                  <span className="font-medium">Việt Nam</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-neutral-200">
                  <span className="text-neutral-600">Mã sản phẩm</span>
                  <span className="font-medium">{product.slug.toUpperCase()}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-neutral-200">
                  <span className="text-neutral-600">Hướng dẫn bảo quản</span>
                  <span className="font-medium">Giặt tay hoặc giặt máy 30°C</span>
                </div>
                <div className="flex justify-between py-3 border-b border-neutral-200">
                  <span className="text-neutral-600">Đã bán</span>
                  <span className="font-medium">{product.soldCount} sản phẩm</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-12 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold uppercase tracking-tight text-neutral-900">
              Đánh giá sản phẩm
            </h2>
            <span className="text-neutral-600">({mockReviews.length} đánh giá)</span>
          </div>

          {/* Rating Summary */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-neutral-200">
            <span className="text-5xl font-black text-neutral-900">{averageRating}</span>
            <div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${star <= Math.round(parseFloat(averageRating))
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-neutral-300'
                      }`}
                  />
                ))}
              </div>
              <p className="text-sm text-neutral-600 mt-1">Dựa trên {mockReviews.length} đánh giá</p>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-6 mb-12">
            {mockReviews.map(review => (
              <div key={review.id} className="flex gap-4 pb-6 border-b border-neutral-200 last:border-0">
                <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-neutral-600">{review.avatar}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-neutral-900">{review.userName}</span>
                    <span className="text-xs text-neutral-500">{review.date}</span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-neutral-300'
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-neutral-700">{review.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Review Form */}
          <div className="bg-neutral-50 p-8">
            <h3 className="text-lg font-bold uppercase tracking-wider mb-6">Viết đánh giá</h3>

            {/* Star Rating Input */}
            <div className="mb-6">
              <label className="text-sm text-neutral-600 mb-2 block">Đánh giá của bạn</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    onMouseEnter={() => setReviewRating(star)}
                    className="transition-colors"
                  >
                    <Star
                      className={`w-6 h-6 ${star <= reviewRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-neutral-300'
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review Content */}
            <div className="mb-6">
              <label className="text-sm text-neutral-600 mb-2 block">Nội dung đánh giá</label>
              <textarea
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors"
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
              />
            </div>

            <button
              onClick={handleReviewSubmit}
              className="px-8 py-3 bg-neutral-900 text-white font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
            >
              Gửi đánh giá
            </button>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 border-t border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold uppercase tracking-tight text-neutral-900">
                Sản phẩm liên quan
              </h2>
              <Link
                href={`/products?categoryId=${product.categoryId}`}
                className="flex items-center text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Xem tất cả
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
