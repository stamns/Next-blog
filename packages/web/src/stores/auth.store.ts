import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/api';

interface User {
  id: string;
  username: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const data = await api.post<{ user: User; token: string }>('/auth/login', {
            username,
            password,
          });
          localStorage.setItem('token', data.token);
          set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
          return true;
        } catch (err) {
          const message = err instanceof Error ? err.message : '登录失败';
          set({ error: message, isLoading: false });
          return false;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false, error: null });
      },

      setUser: (user) => set({ user }),

      checkAuth: async () => {
        const { token } = get();
        if (!token) {
          set({ isLoading: false, isAuthenticated: false });
          return;
        }
        try {
          const data = await api.get<{ user: User }>('/auth/me');
          set({ user: data.user, isAuthenticated: true, isLoading: false });
        } catch (err) {
          // 只有在明确的认证错误时才清除状态
          // 网络错误或服务器错误不应该导致退出
          const message = err instanceof Error ? err.message : '';
          const isAuthError = message.includes('401') || 
                              message.includes('未授权') || 
                              message.includes('Unauthorized') ||
                              message.includes('token') ||
                              message.includes('Token');
          
          if (isAuthError) {
            set({ user: null, token: null, isAuthenticated: false, isLoading: false });
            localStorage.removeItem('token');
          } else {
            // 网络错误等情况，保持当前认证状态
            set({ isLoading: false });
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // 恢复时同步 token 到 localStorage
        if (state?.token) {
          localStorage.setItem('token', state.token);
        }
      },
    }
  )
);
