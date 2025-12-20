import { create } from 'zustand';
import { api } from '../lib/api';

interface BlogThemeState {
  currentTheme: string;
  isLoading: boolean;
  setTheme: (theme: string) => void;
  fetchActiveTheme: () => Promise<void>;
}

export const useBlogThemeStore = create<BlogThemeState>((set) => ({
  currentTheme: 'classic',
  isLoading: true,

  setTheme: (theme) => {
    set({ currentTheme: theme });
    localStorage.setItem('blog-theme', theme);
  },

  fetchActiveTheme: async () => {
    try {
      const themes = await api.get<any[]>('/themes');
      const activeTheme = themes?.find((t) => t.isActive);
      if (activeTheme) {
        // 从数据库主题名映射到前端主题
        const themeMap: Record<string, string> = {
          'default-light': 'classic',
          'default-dark': 'classic',
          classic: 'classic',
          minimal: 'minimal',
          magazine: 'magazine',
        };
        const themeName = themeMap[activeTheme.name] || 'classic';
        set({ currentTheme: themeName, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      // 如果获取失败，使用本地存储或默认值
      const saved = localStorage.getItem('blog-theme');
      set({ currentTheme: saved || 'classic', isLoading: false });
    }
  },
}));
