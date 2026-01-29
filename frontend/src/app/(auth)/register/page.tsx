'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If already authenticated, show message with link to home
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Bạn đã đăng nhập</h1>
          <p className="text-muted-foreground mb-6">
            Bạn đã đăng nhập vào hệ thống. Vui lòng đăng xuất để tạo tài khoản mới.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-900">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950">
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <Link href="/" className="text-3xl font-bold tracking-tight">
              Fash.On
            </Link>
          </div>
          
          <div className="max-w-md">
            <blockquote className="text-2xl font-light leading-relaxed">
              "Hãy để phong cách của bạn tỏa sáng. Đăng ký ngay để nhận ưu đãi đặc biệt."
            </blockquote>
            <p className="mt-4 text-neutral-400">
              Tham gia cùng hàng nghìn khách hàng đang tận hưởng trải nghiệm mua sắm tuyệt vờ tại Fash.On.
            </p>
          </div>
          
          <div className="text-sm text-neutral-500">
            Fash.On - Thờ trang cho mọi phong cách
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <Link href="/" className="text-3xl font-bold tracking-tight">
              Fash.On
            </Link>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-center lg:text-left">
              Đăng Ký Tài Khoản
            </h1>
            <p className="text-muted-foreground text-center lg:text-left">
              Tạo tài khoản để nhận ưu đãi đặc biệt và theo dõi đơn hàng dễ dàng
            </p>
          </div>

          <div className="bg-card p-6 sm:p-8 rounded-xl border shadow-sm">
            <RegisterForm />
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Bằng việc đăng ký, bạn đồng ý với{' '}
            <Link href="#" className="underline underline-offset-2 hover:text-primary">
              Điều khoản sử dụng
            </Link>{' '}
            và{' '}
            <Link href="#" className="underline underline-offset-2 hover:text-primary">
              Chính sách bảo mật
            </Link>{' '}
            của chúng tôi.
          </p>
        </div>
      </div>
    </div>
  );
}
