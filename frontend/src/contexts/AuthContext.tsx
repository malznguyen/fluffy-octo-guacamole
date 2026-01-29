'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { User, AuthResponse } from '@/types';
import apiClient from '@/lib/axios';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; fullName: string; phone?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper functions for cookie management
function setCookie(name: string, value: string, days: number = 7) {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Inner component that uses useSearchParams
function AuthProviderInner({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const loadUserFromStorage = useCallback(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        // Ensure cookie is set for middleware
        setCookie('token', token);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        deleteCookie('token');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post<{ success: boolean; data: AuthResponse; message?: string }>('/api/v1/auth/login', { email, password });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Email hoặc mật khẩu không đúng.');
      }
      
      const { token, user } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setCookie('token', token);
      setUser(user);
      
      toast.success('Đăng nhập thành công! Chào mừng bạn quay trở lại.');
      
      // Redirect to return URL or home
      const returnUrl = searchParams.get('returnUrl');
      router.push(returnUrl || '/');
      router.refresh();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Email hoặc mật khẩu không đúng.';
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (data: { email: string; password: string; fullName: string; phone?: string }) => {
    try {
      const response = await apiClient.post<{ success: boolean; data: AuthResponse; message?: string }>('/api/v1/auth/register', data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
      
      toast.success('Đăng ký thành công! Bạn có thể đăng nhập ngay.');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Đăng ký thất bại. Vui lòng thử lại.';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    deleteCookie('token');
    setUser(null);
    toast.success('Đã đăng xuất thành công.');
    router.push('/');
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Wrapper component with Suspense
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Đang tải...</div>
      </div>
    }>
      <AuthProviderInner>{children}</AuthProviderInner>
    </Suspense>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
