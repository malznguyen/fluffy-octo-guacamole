'use client';

import { useState, useEffect } from 'react';
import { Loader2, Mail, Phone, User, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { UserDTO, UpdateUserRequest, Role } from '@/types/user';

interface UserFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: UpdateUserRequest) => void;
    user: UserDTO | null;
    isLoading: boolean;
}

export function UserFormDialog({
    isOpen,
    onClose,
    onSubmit,
    user,
    isLoading,
}: UserFormDialogProps) {
    const [formData, setFormData] = useState<UpdateUserRequest>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen && user) {
            setFormData({
                fullName: user.fullName,
                phone: user.phone || '',
                role: user.role,
            });
            setErrors({});
        }
    }, [isOpen, user]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName?.trim()) {
            newErrors.fullName = 'Họ tên là bắt buộc';
        } else if (formData.fullName.length > 255) {
            newErrors.fullName = 'Họ tên không quá 255 ký tự';
        }

        if (formData.phone) {
            if (!/^\d{10,15}$/.test(formData.phone)) {
                newErrors.phone = 'Số điện thoại phải từ 10-15 số';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
                    <DialogDescription>
                        Cập nhật thông tin cho tài khoản {user.email}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">

                    {/* Email (Read only) */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-slate-500" />
                            Email
                        </Label>
                        <Input
                            id="email"
                            value={user.email}
                            disabled
                            className="bg-slate-50 text-slate-500 border-slate-200"
                        />
                    </div>

                    {/* Full Name */}
                    <div className="space-y-2">
                        <Label htmlFor="fullName" className="flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-500" />
                            Họ và tên <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="fullName"
                            value={formData.fullName || ''}
                            onChange={(e) => {
                                setFormData(prev => ({ ...prev, fullName: e.target.value }));
                                if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
                            }}
                            className={errors.fullName ? 'border-red-500' : ''}
                        />
                        {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-500" />
                            Số điện thoại
                        </Label>
                        <Input
                            id="phone"
                            value={formData.phone || ''}
                            onChange={(e) => {
                                setFormData(prev => ({ ...prev, phone: e.target.value }));
                                if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                            }}
                            placeholder="0901234567"
                            className={errors.phone ? 'border-red-500' : ''}
                        />
                        {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <Label htmlFor="role" className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-slate-500" />
                            Vai trò
                        </Label>
                        <Select
                            value={formData.role}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as Role }))}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={Role.CUSTOMER}>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                                        Khách hàng
                                    </div>
                                </SelectItem>
                                <SelectItem value={Role.ADMIN}>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-purple-600" />
                                        Quản trị viên
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {formData.role === Role.ADMIN && (
                            <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100">
                                <AlertCircle className="w-3 h-3" />
                                User này sẽ có toàn quyền truy cập trang quản trị.
                            </div>
                        )}
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                'Lưu thay đổi'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
