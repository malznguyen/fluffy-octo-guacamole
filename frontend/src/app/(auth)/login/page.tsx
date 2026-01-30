'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth-store';
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
    <div className="bg-white border border-neutral-200 p-8">
      <h1 className="text-3xl font-black uppercase tracking-tight text-center text-neutral-900 mb-8">
        Đăng nhập
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-900 mb-2">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            placeholder="email@example.com"
            className="w-full px-4 py-3 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-900 mb-2">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="••••••"
              className="w-full px-4 py-3 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors pr-12"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 rounded transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-neutral-500" />
              ) : (
                <Eye className="w-5 h-5 text-neutral-500" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* API Error */}
        {apiError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm">
            {apiError}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-neutral-900 text-white py-4 font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>
      </form>

      {/* Footer Links */}
      <div className="mt-6 text-center space-y-3">
        <Link
          href="#"
          className="block text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          Quên mật khẩu?
        </Link>
        <p className="text-sm text-neutral-600">
          Chưa có tài khoản?{' '}
          <Link
            href="/register"
            className="font-bold text-neutral-900 hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
