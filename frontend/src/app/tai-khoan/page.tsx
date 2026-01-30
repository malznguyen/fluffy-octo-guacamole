'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ArrowRight, AlertTriangle } from 'lucide-react';

import { useAuthStore } from '@/lib/store/use-auth-store';
import { authApi } from '@/lib/api/services';
import { UpdateProfileRequest } from '@/lib/api/types';
import { AccountLayout } from '@/components/layout/AccountLayout';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Validation schema
const profileSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Họ tên không được để trống')
    .max(255, 'Họ tên không được quá 255 ký tự'),
  phone: z
    .string()
    .regex(/^[0-9]*$/, 'Số điện thoại chỉ được chứa số')
    .optional()
    .or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Underline Input Component
function UnderlineField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}

// Underline Input
function UnderlineInput({
  error,
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <input
      className={`
        w-full bg-transparent border-0 border-b border-gray-200
        text-lg text-black placeholder:text-gray-300
        focus:border-b-2 focus:border-black focus:outline-none
        py-2 transition-all duration-200
        ${error ? 'border-red-400 focus:border-red-500' : ''}
        ${className}
      `}
      {...props}
    />
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, setUser, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      phone: '',
    },
  });

  // Check authentication and populate form
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/dang-nhap');
      return;
    }

    // Populate form with user data
    if (user) {
      reset({
        fullName: user.fullName || '',
        phone: user.phone || '',
      });
    }
  }, [isAuthenticated, user, reset, router]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const updateData: UpdateProfileRequest = {
        fullName: data.fullName,
        phone: data.phone || undefined,
      };

      const updatedUser = await authApi.updateProfile(updateData);
      setUser(updatedUser);
      reset(data);
      toast.success('Cập nhật thông tin thành công!');
    } catch (error) {
      toast.error('Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await authApi.deleteAccount();
      toast.success('Tài khoản đã được xóa thành công!');
      logout();
    } catch (error) {
      toast.error('Xóa tài khoản thất bại. Vui lòng thử lại.');
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <AccountLayout>
      <div className="max-w-2xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-xl font-bold uppercase tracking-[0.15em] text-black">
            Thông tin cá nhân
          </h1>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Avatar Section */}
          <div className="flex items-center gap-6 mb-10">
            <div className="w-20 h-20 bg-black flex items-center justify-center flex-shrink-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName || user.email}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {getInitials(user.fullName || user.email)}
                </span>
              )}
            </div>
            <div>
              <p className="text-lg font-medium text-black">
                {user.fullName || 'Chưa cập nhật'}
              </p>
              <p className="text-sm text-gray-400">
                {user.email}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-8">
            {/* Row 1: Full Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <UnderlineField label="Họ và tên" error={errors.fullName?.message}>
                <UnderlineInput
                  {...register('fullName')}
                  placeholder="Nhập họ và tên"
                  error={errors.fullName?.message}
                />
              </UnderlineField>

              <UnderlineField label="Số điện thoại" error={errors.phone?.message}>
                <UnderlineInput
                  {...register('phone')}
                  placeholder="Nhập số điện thoại"
                  error={errors.phone?.message}
                />
              </UnderlineField>
            </div>

            {/* Row 2: Email (Read-only) */}
            <UnderlineField label="Email">
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-transparent border-0 border-b border-gray-200 text-lg text-gray-400 py-2 cursor-not-allowed"
              />
            </UnderlineField>
          </div>

          {/* Action Button */}
          <div className="mt-12 flex justify-end">
            <Button
              type="submit"
              disabled={!isDirty || isLoading}
              className="h-12 px-8 bg-black hover:bg-neutral-800 text-white text-xs font-bold tracking-widest uppercase rounded-none disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </form>

        {/* Delete Account Link */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-sm text-red-500 hover:text-red-600 underline underline-offset-4 transition-colors duration-200"
          >
            Xóa tài khoản
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md border border-gray-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-black font-bold uppercase tracking-tight">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Xác nhận xóa tài khoản
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-2">
              Bạn có chắc chắn muốn xóa tài khoản này? Hành động này{' '}
              <strong className="text-red-500">KHÔNG THỂ HOÀN TÁC</strong>.
              Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-gray-50 border border-gray-200 p-4 my-4">
            <p className="text-sm text-gray-600">
              <strong>Lưu ý:</strong> Bạn sẽ mất:
            </p>
            <ul className="mt-2 text-sm text-gray-500 list-disc list-inside space-y-1">
              <li>Tất cả thông tin cá nhân</li>
              <li>Lịch sử đơn hàng</li>
              <li>Giỏ hàng hiện tại</li>
            </ul>
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
              className="w-full sm:w-auto border-gray-300 text-gray-600 rounded-none"
            >
              Hủy bỏ
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600 rounded-none"
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa tài khoản'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AccountLayout>
  );
}
