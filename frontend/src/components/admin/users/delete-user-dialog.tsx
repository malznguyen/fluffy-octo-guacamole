'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useUserOrders } from '@/hooks/use-admin-users';

interface DeleteUserDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userName: string;
    userId: number | null;
    isLoading: boolean;
}

export function DeleteUserDialog({
    isOpen,
    onClose,
    onConfirm,
    userName,
    userId,
    isLoading,
}: DeleteUserDialogProps) {
    // Fetch orders to check count
    const { data: orders = [], isLoading: isLoadingOrders } = useUserOrders(isOpen ? userId : null);
    const orderCount = orders.length;

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận xóa tài khoản</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3">
                        <p>
                            Bạn chắc chắn muốn xóa tài khoản <span className="font-semibold text-slate-900">&quot;{userName}&quot;</span>?
                            Tài khoản sẽ bị khóa và không thể đăng nhập.
                        </p>

                        {!isLoadingOrders && orderCount > 0 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-2 text-amber-800">
                                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <span className="font-semibold">Lưu ý:</span> User này đang có <span className="font-bold">{orderCount}</span> đơn hàng trong hệ thống.
                                    Dữ liệu đơn hàng vẫn được giữ lại nhưng user sẽ bị vô hiệu hóa.
                                </div>
                            </div>
                        )}

                        <span className="text-sm text-slate-500 block mt-2">
                            (Đây là thao tác soft delete - dữ liệu có thể được khôi phục bởi quản trị viên cấp cao)
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose} disabled={isLoading}>
                        Hủy
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                        disabled={isLoading || isLoadingOrders}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang xóa...
                            </>
                        ) : (
                            'Xóa tài khoản'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
