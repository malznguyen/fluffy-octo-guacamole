'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { AuthLayout } from '@/components/auth/AuthLayout';
import { UnderlineInput } from '@/components/ui/underline-input';
import { RegisterSchema, type RegisterFormData } from '@/lib/validators/auth';
import { apiClient } from '@/lib/api/client';

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            fullName: '',
            phone: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        try {
            await apiClient.post('/auth/register', data);
            toast.success('Đăng ký thành công');
            router.push('/dang-nhap');
        } catch (error: unknown) {
            const message =
                (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Đăng ký thất bại. Vui lòng thử lại.';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            imageUrl="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop"
            imagePosition="right"
        >
            <div className="space-y-8">
                {/* Header */}
                <div className="space-y-4">
                    <h1 className="font-display text-5xl lg:text-6xl font-bold tracking-tight">
                        TẠO TÀI KHOẢN
                    </h1>
                    <p className="text-neutral-500 text-lg">
                        Tham gia FASH.ON ngay hôm nay
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <UnderlineInput
                        type="text"
                        placeholder="Họ tên"
                        {...register('fullName')}
                        error={errors.fullName?.message}
                        disabled={isLoading}
                    />

                    <UnderlineInput
                        type="tel"
                        placeholder="Số điện thoại"
                        {...register('phone')}
                        error={errors.phone?.message}
                        disabled={isLoading}
                    />

                    <UnderlineInput
                        type="email"
                        placeholder="Email"
                        {...register('email')}
                        error={errors.email?.message}
                        disabled={isLoading}
                    />

                    <UnderlineInput
                        type="password"
                        placeholder="Mật khẩu"
                        {...register('password')}
                        error={errors.password?.message}
                        disabled={isLoading}
                    />

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white py-4 px-8 text-sm font-medium uppercase tracking-widest
                       hover:bg-white hover:text-black hover:ring-1 hover:ring-black
                       transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                ĐANG XỬ LÝ...
                            </>
                        ) : (
                            'TẠO TÀI KHOẢN'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="pt-8 border-t border-neutral-200">
                    <p className="text-center text-neutral-500">
                        Đã có tài khoản?{' '}
                        <Link
                            href="/dang-nhap"
                            className="text-black font-medium hover:underline underline-offset-4"
                        >
                            ĐĂNG NHẬP
                        </Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
