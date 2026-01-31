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

interface DeleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    categoryName: string;
    hasChildren?: boolean;
    isLoading: boolean;
}

export function DeleteDialog({
    isOpen,
    onClose,
    onConfirm,
    categoryName,
    hasChildren = false,
    isLoading,
}: DeleteDialogProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có chắc muốn xóa danh mục{' '}
                        <span className="font-semibold text-neutral-900">&quot;{categoryName}&quot;</span>?{' '}
                        Hành động này không thể hoàn tác.
                        <br />
                        <span className="text-sm text-neutral-500">
                            (Danh mục sẽ được ẩn khỏi hệ thống nhưng vẫn giữ lại trong cơ sở dữ liệu)
                        </span>
                    </AlertDialogDescription>

                    {hasChildren && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-red-800 text-sm">Cảnh báo quan trọng</p>
                                <p className="text-sm text-red-700 mt-1">
                                    Xóa danh mục này cũng sẽ xóa tất cả danh mục con bên trong!
                                    Vui lòng cân nhắc kỹ trước khi thực hiện.
                                </p>
                            </div>
                        </div>
                    )}
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
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang xóa...
                            </>
                        ) : (
                            'Xóa danh mục'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
