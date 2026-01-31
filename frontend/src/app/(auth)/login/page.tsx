'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth-store';
import { FloatingInput } from '@/components/ui/floating-input';
import apiClient from '@/lib/axios';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: 'CUSTOMER' | 'ADMIN';
}

interface UserResponse {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setApiError('');

    try {
      // Step 1: Login to get token
      const loginResponse = await apiClient.post<{ success: boolean; data: AuthResponse; message?: string }>(
        '/auth/login',
        {
          email: data.email,
          password: data.password,
        }
      );

      if (!loginResponse.data.success) {
        setApiError(loginResponse.data.message || 'Email hoặc mật khẩu không đúng');
        return;
      }

      const { token, email, fullName, role } = loginResponse.data.data;

      // Step 2: Fetch user profile
      const userResponse = await apiClient.get<{ success: boolean; data: UserResponse }>(
        '/users/me',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (userResponse.data.success) {
        const user = userResponse.data.data;
        
        // Save to store
        login(token, {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          role: user.role,
        });

        toast.success('Đăng nhập thành công');
        router.push(redirect);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Email hoặc mật khẩu không đúng';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-8">
      <h1 className="text-3xl font-bold tracking-tight text-center text-neutral-900 mb-8">
        Đăng nhập
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <FloatingInput
          {...register('email')}
          type="email"
          label="Email"
          error={errors.email?.message}
          icon={Mail}
          disabled={isLoading}
        />

        {/* Password */}
        <div className="relative">
          <FloatingInput
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            label="Mật khẩu"
            error={errors.password?.message}
            icon={Lock}
            disabled={isLoading}
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-neutral-100 rounded-lg transition-colors z-10"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 text-neutral-500" />
            ) : (
              <Eye className="w-5 h-5 text-neutral-500" />
            )}
          </button>
        </div>

        {/* API Error */}
        {apiError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {apiError}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 bg-neutral-900 text-white rounded-xl font-semibold hover:bg-neutral-800 hover:shadow-lg hover:shadow-neutral-900/20 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Đang xử lý...
            </span>
          ) : (
            'Đăng nhập'
          )}
        </button>
      </form>

      {/* Footer Links */}
      <div className="mt-8 text-center space-y-4">
        <Link
          href="#"
          className="block text-sm text-neutral-600 hover:text-rose-600 transition-colors"
        >
          Quên mật khẩu?
        </Link>
        <p className="text-sm text-neutral-600">
          Chưa có tài khoản?{' '}
          <Link
            href="/register"
            className="font-bold text-rose-600 hover:text-rose-700 transition-colors"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
