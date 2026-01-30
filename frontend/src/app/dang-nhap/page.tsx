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
import { LoginSchema, type LoginFormData } from '@/lib/validators/auth';
import { authApi } from '@/lib/api/services';
import { useAuthStore } from '@/lib/store/use-auth-store';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
            const response = await authApi.login(data);
            await login(response);
            toast.success('Đăng nhập thành công');
            router.push('/');
        } catch (error: unknown) {
            const message =
                (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Đăng nhập thất bại. Vui lòng thử lại.';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="space-y-4">
                    <h1 className="font-display text-5xl lg:text-6xl font-bold tracking-tight">
                        ĐĂNG NHẬP
                    </h1>
                    <p className="text-neutral-500 text-lg">
                        Chào mừng trở lại với FASH.ON
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                            'ĐĂNG NHẬP'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="pt-8 border-t border-neutral-200">
                    <p className="text-center text-neutral-500">
                        Chưa có tài khoản?{' '}
                        <Link
                            href="/dang-ky"
                            className="text-black font-medium hover:underline underline-offset-4"
                        >
                            ĐĂNG KÝ NGAY
                        </Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
