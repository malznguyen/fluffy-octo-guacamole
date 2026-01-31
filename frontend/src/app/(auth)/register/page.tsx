'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth-store';
import { FloatingInput } from '@/components/ui/floating-input';
import apiClient from '@/lib/axios';

const registerSchema = z.object({
  fullName: z.string().min(1, 'Vui lòng nhập họ tên').max(255, 'Họ tên tối đa 255 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
  confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu không khớp',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

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

export default function RegisterPage() {
  const router = useRouter();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setApiError('');

    try {
      // Step 1: Register
      const registerResponse = await apiClient.post<{ success: boolean; data: AuthResponse; message?: string }>(
        '/auth/register',
        {
          email: data.email,
          password: data.password,
          fullName: data.fullName,
          phone: data.phone || undefined,
        }
      );

      if (!registerResponse.data.success) {
        setApiError(registerResponse.data.message || 'Đăng ký thất bại');
        return;
      }

      const { token, email, fullName, role } = registerResponse.data.data;

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
        
        // Save to store (auto login)
        login(token, {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          role: user.role,
        });

        toast.success('Đăng ký thành công');
        router.push('/dashboard');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      // Check for specific error messages
      if (message.includes('Email') && message.includes('exists')) {
        setApiError('Email đã tồn tại');
      } else {
        setApiError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-8">
      <h1 className="text-3xl font-bold tracking-tight text-center text-neutral-900 mb-8">
        Đăng ký tài khoản
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name */}
        <FloatingInput
          {...register('fullName')}
          type="text"
          label="Họ và tên"
          error={errors.fullName?.message}
          icon={User}
          disabled={isLoading}
        />

        {/* Email */}
        <FloatingInput
          {...register('email')}
          type="email"
          label="Email"
          error={errors.email?.message}
          icon={Mail}
          disabled={isLoading}
        />

        {/* Phone */}
        <FloatingInput
          {...register('phone')}
          type="tel"
          label="Số điện thoại (không bắt buộc)"
          error={errors.phone?.message}
          icon={Phone}
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

        {/* Confirm Password */}
        <div className="relative">
          <FloatingInput
            {...register('confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            label="Xác nhận mật khẩu"
            error={errors.confirmPassword?.message}
            icon={Lock}
            disabled={isLoading}
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-neutral-100 rounded-lg transition-colors z-10"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
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
            'Đăng ký'
          )}
        </button>
      </form>

      {/* Footer Links */}
      <div className="mt-8 text-center">
        <p className="text-sm text-neutral-600">
          Đã có tài khoản?{' '}
          <Link
            href="/login"
            className="font-bold text-rose-600 hover:text-rose-700 transition-colors"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
