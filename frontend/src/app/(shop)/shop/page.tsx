'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Eye, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { useAddToCart } from '@/hooks/useCart';
import { Product, ProductFilter } from '@/types';
import { toast } from 'sonner';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
}

function ProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView: (product: Product) => void;
}) {
  const mainImage = product.images?.[0]?.imageUrl || '/placeholder.png';
  const price = product.basePrice;

  return (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.soldCount && product.soldCount > 0 && (
          <div className="absolute top-2 left-2 bg-black/75 text-white text-xs font-medium px-2 py-1 rounded">
            Đã bán {product.soldCount}
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button
            variant="secondary"
            size="sm"
            className="gap-2"
            onClick={(e) => {
              e.preventDefault();
              onQuickView(product);
            }}
          >
            <Eye className="h-4 w-4" />
            Xem Nhanh
          </Button>
        </div>
      </div>
      <Link href={`/product/${product.slug}`}>
        <CardContent className="p-4">
          <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{formatPrice(price)}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

function QuickViewDialog({
  product,
  open,
  onClose,
}: {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}) {
  const { mutate: addToCart, isPending } = useAddToCart();
  const [selectedVariant, setSelectedVariant] = useState<number | undefined>();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedVariant(product.variants[0].id);
    } else {
      setSelectedVariant(undefined);
    }
    setQuantity(1);
  }, [product]);

  if (!product) return null;

  const mainImage = product.images?.[0]?.imageUrl || '/placeholder.png';
  const price = product.basePrice;

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
          onClose();
        },
        onError: () => {
          toast.error('Không thể thêm vào giỏ hàng');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Xem Nhanh Sản Phẩm</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">{formatPrice(price)}</span>
            </div>
            <p className="text-muted-foreground">{product.description}</p>

            {product.variants.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Chọn biến thể:</label>
                <Select
                  value={selectedVariant?.toString()}
                  onValueChange={(value) => setSelectedVariant(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn biến thể" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants.map((variant) => (
                      <SelectItem key={variant.id} value={variant.id.toString()}>
                        {variant.size} {variant.color && `- ${variant.color}`}
                        {variant.priceAdjustment > 0 && ` (+${formatPrice(variant.priceAdjustment)})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Số lượng:</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="flex-1" onClick={handleAddToCart} disabled={isPending}>
                {isPending ? 'Đang thêm...' : 'Thêm Vào Giỏ'}
              </Button>
              <Link href={`/product/${product.slug}`}>
                <Button variant="outline">Xem Chi Tiết</Button>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShopPageContent() {
  const searchParams = useSearchParams();
  const initialCategoryId = searchParams.get('categoryId');

  const [filters, setFilters] = useState<ProductFilter>({
    categoryId: initialCategoryId ? Number(initialCategoryId) : undefined,
    page: 0,
    size: 20,
  });
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { data: productsData, isLoading: isLoadingProducts } = useProducts(filters);
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const handleFilterChange = (key: keyof ProductFilter, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 0 }));
  };

  const clearFilters = () => {
    setFilters({ page: 0, size: 20 });
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Cửa Hàng</h1>
          <p className="text-muted-foreground mt-1">
            {productsData?.totalElements || 0} sản phẩm
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 md:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Lọc
          </Button>
          <Select
            value={filters.sortBy || 'newest'}
            onValueChange={(value) => handleFilterChange('sortBy', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="price_asc">Giá tăng dần</SelectItem>
              <SelectItem value="price_desc">Giá giảm dần</SelectItem>
              <SelectItem value="bestselling">Bán chạy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className={`w-64 shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Bộ Lọc</h3>
                {(filters.categoryId || filters.minPrice || filters.maxPrice) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Xóa tất cả
                  </Button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-sm font-medium mb-3">Danh mục</h4>
              {isLoadingCategories ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={!filters.categoryId}
                      onChange={() => handleFilterChange('categoryId', undefined)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Tất cả</span>
                  </label>
                  {categories?.map((category) => (
                    <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.categoryId === category.id}
                        onChange={() => handleFilterChange('categoryId', category.id)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{category.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Price Filter */}
            <div>
              <h4 className="text-sm font-medium mb-3">Khoảng giá</h4>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Từ"
                  value={filters.minPrice || ''}
                  onChange={(e) =>
                    handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-24"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Đến"
                  value={filters.maxPrice || ''}
                  onChange={(e) =>
                    handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-24"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
              ))}
            </div>
          ) : productsData?.content && productsData.content.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {productsData.content.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">Không tìm thấy sản phẩm nào</p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            </div>
          )}

          {/* Pagination */}
          {productsData && productsData.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                disabled={filters.page === 0}
                onClick={() => handleFilterChange('page', (filters.page || 0) - 1)}
              >
                Trước
              </Button>
              <span className="flex items-center px-4">
                Trang {(filters.page || 0) + 1} / {productsData.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={filters.page === productsData.totalPages - 1}
                onClick={() => handleFilterChange('page', (filters.page || 0) + 1)}
              >
                Sau
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Dialog */}
      <QuickViewDialog
        product={quickViewProduct}
        open={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}

// Wrap in Suspense for static generation
export default function ShopPageWrapper() {
  return (
    <Suspense fallback={
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    }>
      <ShopPageContent />
    </Suspense>
  );
}
