'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag, Star, Truck, ShieldCheck, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTopSellingProducts, useCategories } from '@/hooks/useProducts';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
}

export default function HomePage() {
  const { data: topSelling, isLoading: isLoadingTopSelling } = useTopSellingProducts();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-sm font-medium">
              <Star className="h-4 w-4 text-primary" />
              Thời Trang Của Bạn
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Phong Cách Tự Tin
              <br />
              Từ Những Chi Tiết Đắt Giá
            </h1>
            <p className="text-muted-foreground text-lg">
              Khám phá bộ sưu tập mới với thiết kế tinh gọn, chất liệu cao cấp và giá trị bền vững.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/shop">
                <Button size="lg" className="gap-2">
                  Mua Sắm Ngay
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/shop">
                <Button size="lg" variant="outline" className="gap-2">
                  Xem Bộ Sưu Tập
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl bg-muted overflow-hidden">
              <Image
                src="/placeholder.png"
                alt="Bộ sưu tập nổi bật"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-background border shadow-lg rounded-2xl p-4 w-56">
              <div className="text-sm text-muted-foreground">Sản phẩm bán chạy</div>
              <div className="text-2xl font-bold">2.500+</div>
              <div className="text-xs text-muted-foreground">Khách hàng tin tưởng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Selling */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Sản Phẩm Bán Chạy</h2>
            <p className="text-muted-foreground">Lựa chọn nổi bật được yêu thích nhất</p>
          </div>
          <Link href="/shop">
            <Button variant="outline" className="gap-2">
              Xem tất cả
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        {isLoadingTopSelling ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {topSelling?.map((product) => (
              <Card key={product.id} className="overflow-hidden border-0 shadow-sm">
                <div className="relative aspect-[3/4] bg-muted">
                  <Image
                    src={product.images?.[0]?.imageUrl || '/placeholder.png'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">{product.categoryName || 'Thời trang'}</div>
                  <div className="font-medium line-clamp-2 mb-2">{product.name}</div>
                  <div className="font-bold">{formatPrice(product.basePrice)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Danh Mục Nổi Bật</h2>
            <p className="text-muted-foreground">Khám phá theo phong cách bạn yêu thích</p>
          </div>
          <Link href="/shop">
            <Button variant="outline" className="gap-2">
              Xem cửa hàng
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        {isLoadingCategories ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories?.slice(0, 8).map((category) => (
              <Link key={category.id} href={`/shop?categoryId=${category.id}`}>
                <Card className="border-0 bg-muted/50 hover:bg-muted transition-colors">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{category.name}</div>
                      <div className="text-sm text-muted-foreground">Xem sản phẩm</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 bg-muted/50">
            <CardContent className="p-6 space-y-2">
              <Truck className="h-6 w-6 text-primary" />
              <div className="font-semibold">Giao hàng nhanh</div>
              <div className="text-sm text-muted-foreground">Miễn phí vận chuyển đơn từ 500K</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-muted/50">
            <CardContent className="p-6 space-y-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <div className="font-semibold">Chính hãng 100%</div>
              <div className="text-sm text-muted-foreground">Cam kết chất lượng và nguồn gốc rõ ràng</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-muted/50">
            <CardContent className="p-6 space-y-2">
              <Headphones className="h-6 w-6 text-primary" />
              <div className="font-semibold">Hỗ trợ 24/7</div>
              <div className="text-sm text-muted-foreground">Tư vấn phong cách và chăm sóc khách hàng</div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
