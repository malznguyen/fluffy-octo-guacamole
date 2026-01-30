import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN';
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

// Helper to set cookie for middleware
const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
};

const removeCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token: string, user: User) => {
        set({ token, user, isAuthenticated: true });
        // Sync with cookie for middleware
        setCookie('fashon-token', token, 7);
      },

      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
        // Remove cookie
        removeCookie('fashon-token');
      },

      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'fashon-auth-storage',
      // Only persist token and user, not functions
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Helper function to sync cookie on page load (for SSR)
export const syncAuthCookie = () => {
  const { token } = useAuthStore.getState();
  if (token) {
    setCookie('fashon-token', token, 7);
  } else {
    removeCookie('fashon-token');
  }
};
