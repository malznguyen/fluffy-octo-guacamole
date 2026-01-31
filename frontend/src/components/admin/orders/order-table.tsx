'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OrderDTO } from '@/types/order';
import { OrderStatus } from '@/types/enums';
import { formatPrice } from '@/lib/utils';
import {
    MoreHorizontal,
    Eye,
    Pencil,
    Ban,
    ShoppingBag,
    User,
    Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface OrderTableProps {
    orders: OrderDTO[];
    isLoading: boolean;
    onView: (order: OrderDTO) => void;
    onUpdateStatus: (order: OrderDTO) => void;
    onCancel: (order: OrderDTO) => void;
}

const STATUS_BADGES: Record<OrderStatus, { label: string; className: string }> = {
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

export function OrderTable({
    orders,
    isLoading,
    onView,
    onUpdateStatus,
    onCancel
}: OrderTableProps) {

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-neutral-50">
                            <TableHead className="w-[140px]">Mã đơn hàng</TableHead>
                            <TableHead>Khách hàng</TableHead>
                            <TableHead className="text-right">Tổng tiền</TableHead>
                            <TableHead className="text-center w-[150px]">Trạng thái</TableHead>
                            <TableHead className="w-[160px]">Ngày đặt</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                {Array.from({ length: 6 }).map((_, j) => (
                                    <TableCell key={j}>
                                        <div className="h-4 bg-neutral-100 rounded animate-pulse" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-16 text-center">
                <ShoppingBag className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                    Không tìm thấy đơn hàng nào
                </h3>
                <p className="text-neutral-500">
                    Hãy thử thay đổi bộ lọc hoặc tìm kiếm.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-neutral-50">
                        <TableHead className="w-[180px]">Mã đơn hàng</TableHead>
                        <TableHead>Khách hàng</TableHead>
                        <TableHead className="text-right">Tổng tiền</TableHead>
                        <TableHead className="text-center w-[150px]">Trạng thái</TableHead>
                        <TableHead className="w-[180px]">Ngày đặt</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => {
                        const statusStyle = STATUS_BADGES[order.status] || { label: order.status, className: 'bg-neutral-100 text-neutral-800' };
                        const isFinalState = order.status === OrderStatus.COMPLETED || order.status === OrderStatus.CANCELLED;

                        return (
                            <TableRow key={order.id} className="group hover:bg-neutral-50">
                                <TableCell>
                                    <span className="font-mono font-medium text-neutral-700 bg-neutral-100 px-2 py-1 rounded">
                                        {order.orderCode}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-neutral-900">{order.customerName}</span>
                                        <span className="text-xs text-neutral-500">{order.customerEmail}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-medium text-neutral-900">
                                    {formatPrice(order.total)}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline" className={`${statusStyle.className} border whitespace-nowrap`}>
                                        {statusStyle.label}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-neutral-500">
                                    {formatDate(order.createdAt)}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="z-50 w-[160px]">
                                            <DropdownMenuItem onClick={() => onView(order)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Chi tiết
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onUpdateStatus(order)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Cập nhật trạng thái
                                            </DropdownMenuItem>
                                            {!isFinalState && (
                                                <>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => onCancel(order)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                                        <Ban className="mr-2 h-4 w-4" />
                                                        Hủy đơn hàng
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
