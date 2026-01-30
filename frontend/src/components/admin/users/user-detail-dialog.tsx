'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    User, Mail, Phone, Calendar, Shield, ShoppingBag,
    CreditCard, ExternalLink
} from 'lucide-react';
import { UserDTO, Role } from '@/types/user';
import { useUserOrders } from '@/hooks/use-admin-users';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { formatPrice } from '@/lib/utils';
import { UserOrdersDialog } from './user-orders-dialog';

interface UserDetailDialogProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserDTO | null;
}

export function UserDetailDialog({
    isOpen,
    onClose,
    user,
}: UserDetailDialogProps) {
    const [showOrdersDialog, setShowOrdersDialog] = useState(false);

    // Fetch orders stats
    const { data: orders = [] } = useUserOrders(isOpen && user ? user.id : null);

    const orderCount = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

    if (!user) return null;

    const formatDate = (date: string) => {
        try {
            return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: vi });
        } catch {
            return 'N/A';
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Thông tin chi tiết</DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                        {/* Left Column: Avatar & Basic Identity */}
                        <div className="flex flex-col items-center text-center space-y-4 md:border-r md:pr-6 border-slate-100">
                            <Avatar className="w-24 h-24 border-4 border-slate-50">
                                <AvatarImage src={user.avatarUrl || ''} />
                                <AvatarFallback className="text-2xl bg-slate-100 text-slate-400">
                                    {user.fullName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div>
                                <h3 className="font-bold text-lg text-slate-900">{user.fullName}</h3>
                                <p className="text-sm text-slate-500">ID: #{user.id}</p>
                            </div>

                            <Badge
                                variant="secondary"
                                className={
                                    user.role === Role.ADMIN
                                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-100'
                                        : 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                                }
                            >
                                <Shield className="w-3 h-3 mr-1" />
                                {user.role === Role.ADMIN ? 'Quản trị viên' : 'Khách hàng'}
                            </Badge>
                        </div>

                        {/* Right Column: Details & Stats */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Contact Info */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Thông tin liên hệ</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                                        <Mail className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm">{user.phone || 'Chưa cập nhật'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-400">Ngày tham gia</span>
                                            <span className="text-sm">{formatDate(user.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Stats */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Thống kê mua sắm</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-xl">
                                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                                            <ShoppingBag className="w-4 h-4" />
                                            <span className="text-xs font-semibold uppercase">Đơn hàng</span>
                                        </div>
                                        <span className="text-2xl font-bold text-blue-700">{orderCount}</span>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-xl">
                                        <div className="flex items-center gap-2 text-green-600 mb-1">
                                            <CreditCard className="w-4 h-4" />
                                            <span className="text-xs font-semibold uppercase">Đã chi tiêu</span>
                                        </div>
                                        <span className="text-2xl font-bold text-green-700">{formatPrice(totalSpent)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button className="w-full" onClick={() => setShowOrdersDialog(true)}>
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Xem lịch sử đơn hàng
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <UserOrdersDialog
                isOpen={showOrdersDialog}
                onClose={() => setShowOrdersDialog(false)}
                userId={user.id}
                userName={user.fullName}
            />
        </>
    );
}
