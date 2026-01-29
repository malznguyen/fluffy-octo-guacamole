'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCart, useUpdateCartItem, useRemoveCartItem } from '@/hooks/useCart';
import { toast } from 'sonner';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
}

export default function CartPage() {
  const router = useRouter();
  const { data: cart, isLoading } = useCart();
  const { mutate: updateCartItem } = useUpdateCartItem();
  const { mutate: removeCartItem } = useRemoveCartItem();

  const handleUpdateQuantity = (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    updateCartItem(
      { itemId, quantity },
      {
        onError: () => {
          toast.error('Không thể cập nhật số lượng');
        },
      }
    );
  };

  const handleRemoveItem = (itemId: number) => {
    removeCartItem(itemId, {
      onSuccess: () => {
        toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
      },
      onError: () => {
        toast.error('Không thể xóa sản phẩm');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <h1 className="text-2xl font-bold mb-8">Giỏ Hàng</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Giỏ Hàng Trống</h1>
          <p className="text-muted-foreground mb-6">
            Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá cửa hàng và thêm sản phẩm yêu thích!
          </p>
          <Link href="/shop">
            <Button size="lg" className="gap-2">
              <Package className="h-5 w-5" />
              Tiếp Tục Mua Sắm
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
      <h1 className="text-2xl font-bold mb-8">Giỏ Hàng ({cart.totalItems} sản phẩm)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Sản phẩm</TableHead>
                    <TableHead>Thông tin</TableHead>
                    <TableHead className="text-right">Đơn giá</TableHead>
                    <TableHead className="text-center">Số lượng</TableHead>
                    <TableHead className="text-right">Thành tiền</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="relative w-20 h-20 bg-muted rounded-lg overflow-hidden">
                          <div className="relative w-20 h-20 bg-muted rounded-lg overflow-hidden">
                            <Image
                              src={item.imageUrl || '/placeholder.png'}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.color && ' / '}
                          {item.color && `Màu: ${item.color}`}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPrice(item.unitPrice)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatPrice(item.subtotal)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Link href="/shop">
              <Button variant="outline" className="gap-2">
                <ArrowRight className="h-4 w-4 rotate-180" />
                Tiếp Tục Mua Sắm
              </Button>
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Tóm Tắt Đơn Hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tạm tính</span>
                <span>{formatPrice(cart.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Giảm giá</span>
                <span>0 đ</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold text-lg">Tổng cộng</span>
                <span className="font-bold text-2xl text-primary">
                  {formatPrice(cart.totalAmount)}
                </span>
              </div>
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={() => router.push('/checkout')}
              >
                Tiến Hành Thanh Toán
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Phí vận chuyển sẽ được tính tại trang thanh toán
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
