'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { OrderStatus } from '@/types/enums';
import { OrderDTO } from '@/types/order';
import { Loader2 } from 'lucide-react';

interface StatusUpdateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (status: OrderStatus) => void;
    order: OrderDTO | null;
    isPending: boolean;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'Chờ xác nhận',
    [OrderStatus.CONFIRMED]: 'Đã xác nhận',
    [OrderStatus.PROCESSING]: 'Đang xử lý',
    [OrderStatus.SHIPPED]: 'Đang giao hàng',
    [OrderStatus.DELIVERED]: 'Đã giao hàng',
    [OrderStatus.COMPLETED]: 'Hoàn thành',
    [OrderStatus.CANCELLED]: 'Đã hủy',
};

// Logical flow: PENDING -> CONFIRMED -> SHIPPED -> DELIVERED -> COMPLETED
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
    [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.CANCELLED],
    [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED], // Cannot cancel once shipped usually, but let's follow prompt "Tru khi da COMPLETED/CANCELLED"
    [OrderStatus.DELIVERED]: [OrderStatus.COMPLETED],
    [OrderStatus.COMPLETED]: [],
    [OrderStatus.CANCELLED]: [],
};

// Prompt says: "Hoac Huy bat ky luc nao (tru khi da COMPLETED/CANCELLED)"
// So I will add CANCELLED to all except COMPLETED/CANCELLED.

export function StatusUpdateDialog({
    open,
    onOpenChange,
    onConfirm,
    order,
    isPending,
}: StatusUpdateDialogProps) {
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');

    useEffect(() => {
        if (open) {
            setSelectedStatus('');
        }
    }, [open]);

    if (!order) return null;

    const currentStatus = order.status;

    // Calculate available options
    let availableStatuses: OrderStatus[] = [];

    if (currentStatus in ALLOWED_TRANSITIONS) {
        availableStatuses = [...ALLOWED_TRANSITIONS[currentStatus]];
    }

    // Add CANCELLED if not already there and not finished
    if (
        currentStatus !== OrderStatus.COMPLETED &&
        currentStatus !== OrderStatus.CANCELLED
    ) {
        availableStatuses.push(OrderStatus.CANCELLED);
    }

    // De-duplicate
    availableStatuses = Array.from(new Set(availableStatuses));

    const handleSave = () => {
        if (selectedStatus) {
            onConfirm(selectedStatus);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cập nhật trạng thái</DialogTitle>
                    <DialogDescription>
                        Thay đổi trạng thái cho đơn hàng <span className="font-mono font-bold text-neutral-900">{order.orderCode}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="current-status" className="text-right">
                            Hiện tại
                        </Label>
                        <div className="col-span-3 font-medium text-neutral-700">
                            {STATUS_LABELS[currentStatus]}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-status" className="text-right">
                            Mới
                        </Label>
                        <div className="col-span-3">
                            <Select
                                value={selectedStatus}
                                onValueChange={(val) => setSelectedStatus(val as OrderStatus)}
                            >
                                <SelectTrigger id="new-status">
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableStatuses.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {STATUS_LABELS[status]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                        Hủy bỏ
                    </Button>
                    <Button onClick={handleSave} disabled={!selectedStatus || isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang lưu...
                            </>
                        ) : (
                            'Lưu thay đổi'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
