'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ChevronLeft, Truck, CreditCard, Package, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useCart } from '@/hooks/useCart';
import { useCreateOrder } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const checkoutSchema = z.object({
  shippingName: z.string().min(2, 'Vui lòng nhập họ tên'),
  shippingPhone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  shippingAddress: z.string().min(10, 'Vui lòng nhập địa chỉ đầy đủ'),
  note: z.string().optional(),
  paymentMethod: z.enum(['COD', 'BANK_TRANSFER']),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cart, isLoading: isLoadingCart } = useCart();
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  const { user, isAuthenticated } = useAuth();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingName: user?.fullName || '',
      shippingPhone: user?.phone || '',
      shippingAddress: user?.address || '',
      note: '',
      paymentMethod: 'COD',
    },
  });

  useEffect(() => {
    if (!isLoadingCart && (!cart || cart.items.length === 0)) {
      router.push('/cart');
    }
  }, [cart, isLoadingCart, router]);

  const onSubmit = (data: CheckoutFormData) => {
    createOrder(
      {
        shippingName: data.shippingName,
        shippingPhone: data.shippingPhone,
        shippingAddress: data.shippingAddress,
        note: data.note,
        paymentMethod: data.paymentMethod,
      },
      {
        onSuccess: () => {
          toast.success('Đặt hàng thành công!');
          router.push('/orders');
        },
        onError: () => {
          toast.error('Không thể đặt hàng. Vui lòng thử lại.');
        },
      }
    );
  };

  if (isLoadingCart) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return null;
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
      <Link href="/cart">
        <Button variant="ghost" className="gap-2 mb-6">
          <ChevronLeft className="h-4 w-4" />
          Quay Lại Giỏ Hàng
        </Button>
      </Link>

      <h1 className="text-2xl font-bold mb-8">Thanh Toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Checkout Form */}
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Thông Tin Giao Hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="shippingName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input placeholder="Nguyễn Văn A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shippingPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input placeholder="0901234567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shippingAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ nhận hàng</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Số nhà, đường, phường, quận, thành phố"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ghi chú (tùy chọn)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ghi chú về đơn hàng, thờ gian giao hàng..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Phương Thức Thanh Toán
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-3"
                          >
                            <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
                              <RadioGroupItem value="COD" id="cod" />
                              <Label htmlFor="cod" className="flex-1 cursor-pointer">
                                <div className="flex items-center gap-3">
                                  <Truck className="h-5 w-5 text-primary" />
                                  <div>
                                    <div className="font-medium">Thanh toán khi nhận hàng (COD)</div>
                                    <div className="text-sm text-muted-foreground">
                                      Thanh toán bằng tiền mặt khi nhận hàng
                                    </div>
                                  </div>
                                </div>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
                              <RadioGroupItem value="BANK_TRANSFER" id="bank" />
                              <Label htmlFor="bank" className="flex-1 cursor-pointer">
                                <div className="flex items-center gap-3">
                                  <CreditCard className="h-5 w-5 text-primary" />
                                  <div>
                                    <div className="font-medium">Chuyển khoản ngân hàng</div>
                                    <div className="text-sm text-muted-foreground">
                                      Chuyển khoản qua tài khoản ngân hàng
                                    </div>
                                  </div>
                                </div>
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Button
                type="submit"
                className="w-full gap-2"
                size="lg"
                disabled={isCreatingOrder}
              >
                <Package className="h-5 w-5" />
                {isCreatingOrder ? 'Đang xử lý...' : 'Đặt Hàng'}
              </Button>
            </form>
          </Form>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Tóm Tắt Đơn Hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.productImage || '/placeholder.png'}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{item.productName}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && ' / '}
                        {item.color && `Màu: ${item.color}`}
                      </div>
                      <div className="text-sm">
                        {formatPrice(item.price)} x {item.quantity}
                      </div>
                    </div>
                    <div className="font-medium text-sm">
                      {formatPrice(item.subtotal)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
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
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Tổng cộng</span>
                <span className="font-bold text-2xl text-primary">
                  {formatPrice(cart.totalAmount)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
