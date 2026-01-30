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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    User,
    ShoppingBag,
    ShieldCheck
} from 'lucide-react';
import { UserDTO, Role } from '@/types/user';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface UserTableProps {
    users: UserDTO[];
    isLoading: boolean;
    onEdit: (user: UserDTO) => void;
    onDelete: (user: UserDTO) => void;
    onView: (user: UserDTO) => void;
    onViewOrders: (user: UserDTO) => void;
}

export function UserTable({
    users,
    isLoading,
    onEdit,
    onDelete,
    onView,
    onViewOrders
}: UserTableProps) {
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
        } catch {
            return dateString;
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50">
                            <TableHead className="w-16">Avatar</TableHead>
                            <TableHead>Thông tin</TableHead>
                            <TableHead>Điện thoại</TableHead>
                            <TableHead className="text-center">Vai trò</TableHead>
                            <TableHead>Ngày tham gia</TableHead>
                            <TableHead className="w-16"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                {Array.from({ length: 6 }).map((_, j) => (
                                    <TableCell key={j}>
                                        <div className="h-4 bg-slate-100 rounded animate-pulse" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-16 text-center">
                <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    Không tìm thấy người dùng nào
                </h3>
                <p className="text-slate-500">
                    Thử thay đổi bộ lọc tìm kiếm
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50">
                        <TableHead className="w-16">Avatar</TableHead>
                        <TableHead>Thông tin</TableHead>
                        <TableHead>Điện thoại</TableHead>
                        <TableHead className="text-center">Vai trò</TableHead>
                        <TableHead>Ngày tham gia</TableHead>
                        <TableHead className="w-16"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => {
                        const isDeleted = !!user.deletedAt;

                        return (
                            <TableRow key={user.id} className={`group hover:bg-slate-50 ${isDeleted ? 'opacity-60 bg-slate-50' : ''}`}>
                                {/* Avatar */}
                                <TableCell>
                                    <Avatar className="w-10 h-10 border border-slate-200">
                                        <AvatarImage src={user.avatarUrl || ''} />
                                        <AvatarFallback className="bg-slate-100 text-slate-400">
                                            <User className="w-5 h-5" />
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>

                                {/* Info */}
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-900 flex items-center gap-2">
                                            {user.fullName}
                                            {isDeleted && <Badge variant="destructive" className="text-[10px] px-1 h-4">Đã xóa</Badge>}
                                        </span>
                                        <span className="text-xs text-slate-500">{user.email}</span>
                                    </div>
                                </TableCell>

                                {/* Phone */}
                                <TableCell>
                                    <span className="text-sm text-slate-600">
                                        {user.phone || <span className="text-slate-400 italic">Chưa cập nhật</span>}
                                    </span>
                                </TableCell>

                                {/* Role */}
                                <TableCell className="text-center">
                                    {user.role === Role.ADMIN ? (
                                        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200">
                                            <ShieldCheck className="w-3 h-3 mr-1" />
                                            Quản trị
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
                                            <User className="w-3 h-3 mr-1" />
                                            Khách hàng
                                        </Badge>
                                    )}
                                </TableCell>

                                {/* Date */}
                                <TableCell>
                                    <span className="text-sm text-slate-500">
                                        {formatDate(user.createdAt)}
                                    </span>
                                </TableCell>

                                {/* Actions */}
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" side="bottom" className="z-50 w-48">
                                            <DropdownMenuItem onClick={() => onView(user)}>
                                                <Eye className="w-4 h-4 mr-2" />
                                                Xem chi tiết
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onViewOrders(user)}>
                                                <ShoppingBag className="w-4 h-4 mr-2" />
                                                Xem đơn hàng
                                            </DropdownMenuItem>

                                            {!isDeleted && (
                                                <>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => onEdit(user)}>
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Chỉnh sửa
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                        onClick={() => onDelete(user)}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Xóa tài khoản
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
