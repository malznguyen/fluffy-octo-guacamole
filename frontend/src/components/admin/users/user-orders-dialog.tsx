'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { OrderTable } from '@/components/admin/orders/order-table';
import { useUserOrders } from '@/hooks/use-admin-users';
import { OrderDTO } from '@/types/order';

interface UserOrdersDialogProps {
    isOpen: boolean;
    onClose: () => void;
    userId: number | null;
    userName: string;
}

export function UserOrdersDialog({
    isOpen,
    onClose,
    userId,
    userName,
}: UserOrdersDialogProps) {
    const { data: orders = [], isLoading } = useUserOrders(isOpen ? userId : null);

    // Handlers for OrderTable (view only context)
    const handleViewOrder = (order: OrderDTO) => {
        // Open order details externally or in new tab?
        // User requested "Xem don hang cua User ... Hien thi danh sach cac don hang".
        // For now, maybe just redirect or do nothing if we don't have a handler to open OrderDetailDialog from here easily.
        // Or we can just let existing OrderTable behavior apply if it had navigation.
        // OrderTable calls onView, onUpdateStatus, onCancel.
        // We can just log or show toast "Chuc nang nay dang o trang Don hang".
        // Better: Open the order detail page in new tab.
        window.open(`/admin/orders?code=${order.orderCode}`, '_blank');
    };

    const handleNoOp = () => { };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Lịch sử đơn hàng: {userName}</DialogTitle>
                </DialogHeader>

                <div className="mt-4">
                    <OrderTable
                        orders={orders}
                        isLoading={isLoading}
                        onView={handleViewOrder}
                        onUpdateStatus={handleNoOp}
                        onCancel={handleNoOp}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
