// 主题注册表 - 每个主题包含完整的页面组件
import { ClassicTheme } from './classic';
import { MinimalTheme } from './minimal';
import { MagazineTheme } from './magazine';

export interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
    publishedAt?: string | null;
    createdAt: string;
    category?: { id: string; name: string } | null;
    tags?: { id: string; name: string }[];
    viewCount?: number;
  };
}

export interface ArticleDetailProps {
  article: {
    id: string;
    title: string;
    slug: string;
    content: string;
    htmlContent?: string | null;
    publishedAt?: string | null;
    createdAt: string;
    category?: { id: string; name: string } | null;
    tags?: { id: string; name: string }[];
    author?: { username: string } | null;
    viewCount?: number;
  };
}

export interface CategoryListProps {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    _count?: { articles: number };
  }>;
}

export interface TagListProps {
  tags: Array<{
    id: string;
    name: string;
    slug: string;
    _count?: { articles: number };
  }>;
}

export interface SearchResultProps {
  articles: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
    publishedAt?: string | null;
    createdAt: string;
    tags?: { id: string; name: string }[];
  }>;
  total: number;
  query: string;
}

export interface ThemeComponents {
  name: string;
  displayName: string;
  description: string;
  // 布局
  BlogLayout: React.ComponentType<{ children: React.ReactNode }>;
  // 文章相关
  ArticleCard: React.ComponentType<ArticleCardProps>;
  ArticleDetail: React.ComponentType<ArticleDetailProps>;
  // 分类标签
  CategoryList: React.ComponentType<CategoryListProps>;
  TagList: React.ComponentType<TagListProps>;
  // 搜索
  SearchResults: React.ComponentType<SearchResultProps>;
}

// 所有可用主题
export const themes: Record<string, ThemeComponents> = {
  classic: ClassicTheme,
  minimal: MinimalTheme,
  magazine: MagazineTheme,
};

// 获取主题
export function getTheme(themeName: string): ThemeComponents {
  return themes[themeName] || themes.classic;
}
