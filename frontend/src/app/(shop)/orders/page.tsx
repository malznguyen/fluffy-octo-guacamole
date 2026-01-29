'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, Package, Clock, CheckCircle, Truck, XCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useOrders, useCancelOrder } from '@/hooks/useOrders';
import { Order, OrderStatus } from '@/types';
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
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusConfig(status: OrderStatus) {
  const configs: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
    PENDING: {
      label: 'Chờ xác nhận',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: <Clock className="h-4 w-4" />,
    },
    CONFIRMED: {
      label: 'Đã xác nhận',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: <CheckCircle className="h-4 w-4" />,
    },
    PROCESSING: {
      label: 'Đang xử lý',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: <Package className="h-4 w-4" />,
    },
    SHIPPED: {
      label: 'Đang giao',
      color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      icon: <Truck className="h-4 w-4" />,
    },
    DELIVERED: {
      label: 'Hoàn thành',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: <CheckCircle className="h-4 w-4" />,
    },
    CANCELLED: {
      label: 'Đã hủy',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: <XCircle className="h-4 w-4" />,
    },
  };
  return configs[status] || configs.PENDING;
}

function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    COD: 'Thanh toán khi nhận hàng',
    BANK_TRANSFER: 'Chuyển khoản ngân hàng',
  };
  return labels[method] || method;
}

function OrderDetailDialog({
  order,
  open,
  onClose,
}: {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!order) return null;

  const statusConfig = getStatusConfig(order.status);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi Tiết Đơn Hàng #{order.orderNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Trạng thái</div>
              <Badge className={`mt-1 ${statusConfig.color}`}>
                <span className="flex items-center gap-1">
                  {statusConfig.icon}
                  {statusConfig.label}
                </span>
              </Badge>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Ngày đặt</div>
              <div className="font-medium">{formatDate(order.createdAt)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Phương thức thanh toán</div>
              <div className="font-medium">{getPaymentMethodLabel(order.paymentMethod)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Trạng thái thanh toán</div>
              <Badge variant={order.paymentStatus === 'PAID' ? 'default' : 'secondary'}>
                {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Shipping Info */}
          <div>
            <h3 className="font-semibold mb-3">Thông tin giao hàng</h3>
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div>
                <span className="text-muted-foreground">Ngườ nhận: </span>
                <span className="font-medium">{order.shippingName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Số điện thoại: </span>
                <span className="font-medium">{order.shippingPhone}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Địa chỉ: </span>
                <span className="font-medium">{order.shippingAddress}</span>
              </div>
              {order.note && (
                <div>
                  <span className="text-muted-foreground">Ghi chú: </span>
                  <span className="font-medium">{order.note}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-3">Sản phẩm</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-muted rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={item.productImage || '/placeholder.png'}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.productName}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.size && `Size: ${item.size}`}
                      {item.size && item.color && ' / '}
                      {item.color && `Màu: ${item.color}`}
                    </div>
                    <div className="text-sm">
                      {formatPrice(item.price)} x {item.quantity}
                    </div>
                  </div>
                  <div className="font-medium">{formatPrice(item.subtotal)}</div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tạm tính</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Phí vận chuyển</span>
              <span>{formatPrice(order.shippingFee)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Giảm giá</span>
                <span className="text-green-600">-{formatPrice(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2">
              <span className="font-semibold text-lg">Tổng cộng</span>
              <span className="font-bold text-xl text-primary">
                {formatPrice(order.finalAmount)}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function OrdersPage() {
  const { data: ordersData, isLoading } = useOrders(0, 20);
  const { mutate: cancelOrder } = useCancelOrder();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleCancelOrder = (orderId: number) => {
    if (confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
      cancelOrder(orderId, {
        onSuccess: () => {
          toast.success('Đã hủy đơn hàng thành công');
        },
        onError: () => {
          toast.error('Không thể hủy đơn hàng');
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <h1 className="text-2xl font-bold mb-8">Đơn Hàng Củ Tôi</h1>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const orders = ordersData?.content || [];

  if (orders.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Chưa Có Đơn Hàng</h1>
          <p className="text-muted-foreground mb-6">
            Bạn chưa có đơn hàng nào. Hãy khám phá cửa hàng và đặt hàng ngay!
          </p>
          <Link href="/shop">
            <Button size="lg" className="gap-2">
              <ShoppingBag className="h-5 w-5" />
              Mua Sắm Ngay
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
      <h1 className="text-2xl font-bold mb-8">Đơn Hàng Củ Tôi</h1>

      {/* Desktop View */}
      <div className="hidden md:block">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn hàng</TableHead>
                  <TableHead>Ngày đặt</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.orderNumber}</TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell className="font-semibold">
                        {formatPrice(order.finalAmount)}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusConfig.color}>
                          <span className="flex items-center gap-1">
                            {statusConfig.icon}
                            {statusConfig.label}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {order.status === 'PENDING' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleCancelOrder(order.id)}
                            >
                              Hủy
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => {
          const statusConfig = getStatusConfig(order.status);
          return (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-medium">#{order.orderNumber}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <Badge className={statusConfig.color}>
                    <span className="flex items-center gap-1">
                      {statusConfig.icon}
                      {statusConfig.label}
                    </span>
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-bold text-lg text-primary">
                    {formatPrice(order.finalAmount)}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Xem
                    </Button>
                    {order.status === 'PENDING' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Hủy
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Order Detail Dialog */}
      <OrderDetailDialog
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
