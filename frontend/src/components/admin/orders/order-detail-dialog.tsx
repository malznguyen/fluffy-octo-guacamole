'use client';

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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { OrderDTO, OrderItemDTO } from '@/types/order';
import { OrderStatus } from '@/types/enums';
import { formatPrice } from '@/lib/utils';
import { Calendar, CreditCard, MapPin, Package, Phone, User as UserIcon, Mail, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface OrderDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: OrderDTO | null;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
    [OrderStatus.PENDING]: { label: 'Chờ xác nhận', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    [OrderStatus.CONFIRMED]: { label: 'Đã xác nhận', className: 'bg-blue-100 text-blue-800 border-blue-200' },
    [OrderStatus.PROCESSING]: { label: 'Đang xử lý', className: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    [OrderStatus.SHIPPED]: { label: 'Đang giao', className: 'bg-purple-100 text-purple-800 border-purple-200' },
    [OrderStatus.DELIVERED]: { label: 'Đã giao', className: 'bg-orange-100 text-orange-800 border-orange-200' },
    [OrderStatus.COMPLETED]: { label: 'Hoàn thành', className: 'bg-green-100 text-green-800 border-green-200' },
    [OrderStatus.CANCELLED]: { label: 'Đã hủy', className: 'bg-red-100 text-red-800 border-red-200' },
};

function formatDate(dateString: string) {
    try {
        return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
        return dateString;
    }
}

export function OrderDetailDialog({
    open,
    onOpenChange,
    order,
}: OrderDetailDialogProps) {
    if (!order) return null;

    const statusConfig = STATUS_CONFIG[order.status] || { label: order.status, className: 'bg-slate-100 text-slate-800' };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-4 border-b">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            Đơn hàng <span className="font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded">{order.orderCode}</span>
                        </DialogTitle>
                        <Badge variant="outline" className={`${statusConfig.className} px-3 py-1`}>
                            {statusConfig.label}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(order.createdAt)}
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Customer Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                <UserIcon className="w-4 h-4" />
                                Thông tin khách hàng
                            </h3>
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Họ tên:</span>
                                    <span className="font-medium">{order.customerName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 flex items-center gap-1"><Mail className="w-3 h-3" /> Email:</span>
                                    <span className="font-medium">{order.customerEmail}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 flex items-center gap-1"><Phone className="w-3 h-3" /> SĐT:</span>
                                    <span className="font-medium">{order.phone}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Địa chỉ giao hàng & Ghi chú
                            </h3>
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3 text-sm h-full">
                                <div className="flex flex-col gap-1">
                                    <span className="text-slate-500 text-xs uppercase tracking-wider">Địa chỉ:</span>
                                    <p className="font-medium">{order.shippingAddress}</p>
                                </div>
                                {order.note && (
                                    <>
                                        <Separator className="my-2" />
                                        <div className="flex flex-col gap-1">
                                            <span className="text-slate-500 text-xs uppercase tracking-wider">Ghi chú:</span>
                                            <p className="italic text-slate-600">"{order.note}"</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-4 mb-6">
                        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Danh sách sản phẩm ({order.totalItems})
                        </h3>
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50">
                                        <TableHead>Sản phẩm</TableHead>
                                        <TableHead className="text-center">Đơn giá</TableHead>
                                        <TableHead className="text-center">Số lượng</TableHead>
                                        <TableHead className="text-right">Thành tiền</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="font-medium">{item.productNameSnapshot}</div>
                                                <div className="text-sm text-slate-500">{item.variantInfoSnapshot}</div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {formatPrice(item.unitPrice)}
                                            </TableCell>
                                            <TableCell className="text-center font-medium">
                                                x{item.quantity}
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">
                                                {formatPrice(item.subtotal)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="flex flex-col items-end gap-2 border-t pt-4">
                        <div className="flex items-center gap-8 text-sm">
                            <span className="text-slate-500">Tạm tính:</span>
                            <span>{formatPrice(order.total)}</span>
                            {/* Assuming total is subtotal allowed for simplicty since no shipping fee field in DTO */}
                        </div>
                        {/* If we had shipping/discount fields they would go here */}
                        <div className="flex items-center gap-8 text-lg font-bold text-slate-900 mt-2">
                            <span>Tổng cộng:</span>
                            <span>{formatPrice(order.total)}</span>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
