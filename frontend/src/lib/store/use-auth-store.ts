'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/lib/api/services';
import { ApiResponse, AuthPayload, UserResponse } from '@/lib/api/types';

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (response: AuthResponseLike) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setUser: (user: UserResponse | null) => void;
}

type AuthStore = AuthState & AuthActions;

const TOKEN_KEY = 'accessToken';

type AuthResponseLike =
  | AuthPayload
  | ApiResponse<AuthPayload>
  | { data: AuthPayload }
  | { data: ApiResponse<AuthPayload> };

const unwrapAuthPayload = (response: AuthResponseLike): AuthPayload => {
  if (response && typeof response === 'object' && 'data' in response) {
    const data = response.data as AuthPayload | ApiResponse<AuthPayload>;
    if (data && typeof data === 'object' && 'token' in data) {
      return data;
    }
    if (data && typeof data === 'object' && 'data' in data) {
      return data.data as AuthPayload;
    }
  }
  return response as AuthPayload;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      login: async (response: AuthResponseLike) => {
        set({ isLoading: true });
        try {
          const authData = unwrapAuthPayload(response);
          const user: UserResponse = {
            id: authData.id,
            email: authData.email,
            fullName: authData.fullName,
            role: authData.role,
          };

          localStorage.setItem(TOKEN_KEY, authData.token);
          set({ 
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // If login handling fails, clear token
          localStorage.removeItem(TOKEN_KEY);
          set({ 
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        set({ 
          user: null,
          isAuthenticated: false,
        });
        // Redirect to home
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      },

      checkAuth: async () => {
        const token = typeof window !== 'undefined' 
          ? localStorage.getItem(TOKEN_KEY) 
          : null;

        if (!token) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await authApi.getProfile();
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch {
          // Token invalid or expired
          localStorage.removeItem(TOKEN_KEY);
          set({ 
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
