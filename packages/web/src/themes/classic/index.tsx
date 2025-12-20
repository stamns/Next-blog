// 经典主题 - 传统两栏博客布局，温暖琥珀色调
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../../components/ThemeToggle';
import { formatDate, truncate } from '../../lib/utils';
import type {
  ThemeComponents,
  ArticleCardProps,
  ArticleDetailProps,
  CategoryListProps,
  TagListProps,
  SearchResultProps,
} from '../index';

// ============ 布局 ============
function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      {/* 顶部横幅 */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <Link to="/" className="text-3xl font-serif font-bold tracking-wide">
            📚 我的博客
          </Link>
          <p className="mt-2 text-amber-200 text-sm">记录生活，分享知识</p>
        </div>
      </div>

      {/* 导航栏 */}
      <nav className="bg-white dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm">
            <Link to="/" className="text-stone-600 dark:text-stone-300 hover:text-amber-700 font-medium">🏠 首页</Link>
            <Link to="/categories" className="text-stone-600 dark:text-stone-300 hover:text-amber-700 font-medium">📂 分类</Link>
            <Link to="/tags" className="text-stone-600 dark:text-stone-300 hover:text-amber-700 font-medium">🏷️ 标签</Link>
            <Link to="/knowledge" className="text-stone-600 dark:text-stone-300 hover:text-amber-700 font-medium">📖 知识库</Link>
            <Link to="/search" className="text-stone-600 dark:text-stone-300 hover:text-amber-700 font-medium">🔍 搜索</Link>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* 两栏布局 */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <main className="lg:col-span-2">{children}</main>
          <aside className="space-y-6">
            <div className="bg-white dark:bg-stone-800 rounded-lg p-6 shadow-sm border border-stone-200 dark:border-stone-700">
              <h3 className="font-serif font-bold text-lg mb-4 pb-2 border-b border-stone-200 dark:border-stone-700">👤 关于博主</h3>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl">🧑‍💻</div>
                <p className="text-sm text-stone-600 dark:text-stone-400">热爱技术，热爱生活</p>
              </div>
            </div>
            <div className="bg-white dark:bg-stone-800 rounded-lg p-6 shadow-sm border border-stone-200 dark:border-stone-700">
              <h3 className="font-serif font-bold text-lg mb-4 pb-2 border-b border-stone-200 dark:border-stone-700">🔗 快速链接</h3>
              <div className="space-y-2 text-sm">
                <Link to="/categories" className="block text-stone-600 dark:text-stone-400 hover:text-amber-600">→ 所有分类</Link>
                <Link to="/tags" className="block text-stone-600 dark:text-stone-400 hover:text-amber-600">→ 标签云</Link>
                <Link to="/knowledge" className="block text-stone-600 dark:text-stone-400 hover:text-amber-600">→ 知识库</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <footer className="bg-stone-800 text-stone-400 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>© {new Date().getFullYear()} 我的博客 · 经典主题</p>
        </div>
      </footer>
    </div>
  );
}

// ============ 文章卡片 ============
function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-700" />
      <div className="p-6">
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
          <span>📅 {formatDate(article.publishedAt || article.createdAt)}</span>
          {article.category && (
            <Link to={`/?category=${article.category.id}`} className="text-amber-600 hover:underline">
              📂 {article.category.name}
            </Link>
          )}
        </div>
        <Link to={`/article/${article.slug}`}>
          <h2 className="text-xl font-serif font-bold mb-3 hover:text-amber-700 transition-colors">{article.title}</h2>
        </Link>
        <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed mb-4">
          {truncate(article.excerpt || article.content, 180)}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {article.tags?.slice(0, 3).map((tag) => (
              <Link key={tag.id} to={`/?tag=${tag.id}`} className="px-2 py-1 bg-stone-100 dark:bg-stone-700 text-xs rounded hover:bg-amber-100">
                #{tag.name}
              </Link>
            ))}
          </div>
          <Link to={`/article/${article.slug}`} className="text-amber-600 text-sm font-medium hover:underline">阅读全文 →</Link>
        </div>
      </div>
    </article>
  );
}

// ============ 文章详情 ============
function ArticleDetail({ article }: ArticleDetailProps) {
  return (
    <article className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-700" />
      <div className="p-8">
        <header className="mb-8 pb-6 border-b border-stone-200 dark:border-stone-700">
          <h1 className="text-3xl font-serif font-bold mb-4">{article.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500">
            <span>📅 {formatDate(article.publishedAt || article.createdAt)}</span>
            {article.author && <span>✍️ {article.author.username}</span>}
            {article.category && (
              <Link to={`/?category=${article.category.id}`} className="text-amber-600 hover:underline">📂 {article.category.name}</Link>
            )}
            <span>👁️ {article.viewCount || 0} 次阅读</span>
          </div>
        </header>
        <div className="prose prose-stone dark:prose-invert max-w-none prose-headings:font-serif prose-a:text-amber-600"
          dangerouslySetInnerHTML={{ __html: article.htmlContent || article.content }} />
        {article.tags && article.tags.length > 0 && (
          <footer className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-700">
            <div className="flex flex-wrap gap-2">
              <span className="text-stone-500 text-sm">🏷️ 标签：</span>
              {article.tags.map((tag) => (
                <Link key={tag.id} to={`/?tag=${tag.id}`} className="px-3 py-1 bg-stone-100 dark:bg-stone-700 text-sm rounded-full hover:bg-amber-100">
                  {tag.name}
                </Link>
              ))}
            </div>
          </footer>
        )}
      </div>
    </article>
  );
}

// ============ 分类列表 ============
function CategoryList({ categories }: CategoryListProps) {
  return (
    <div>
      <h1 className="text-2xl font-serif font-bold mb-6 pb-4 border-b border-stone-200 dark:border-stone-700">📂 文章分类</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <Link key={category.id} to={`/?category=${category.id}`}
            className="bg-white dark:bg-stone-800 rounded-lg p-5 border border-stone-200 dark:border-stone-700 hover:border-amber-500 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif font-bold text-lg group-hover:text-amber-600 transition-colors">{category.name}</h2>
                {category.description && <p className="text-stone-500 text-sm mt-1">{category.description}</p>}
              </div>
              <div className="text-2xl font-bold text-amber-600">{category._count?.articles || 0}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ============ 标签列表 ============
function TagList({ tags }: TagListProps) {
  return (
    <div>
      <h1 className="text-2xl font-serif font-bold mb-6 pb-4 border-b border-stone-200 dark:border-stone-700">🏷️ 标签云</h1>
      <div className="bg-white dark:bg-stone-800 rounded-lg p-6 border border-stone-200 dark:border-stone-700">
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => {
            const count = tag._count?.articles || 0;
            const size = count > 10 ? 'text-xl' : count > 5 ? 'text-lg' : 'text-base';
            return (
              <Link key={tag.id} to={`/?tag=${tag.id}`}
                className={`${size} px-4 py-2 bg-stone-100 dark:bg-stone-700 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-700 transition-all`}>
                #{tag.name}
                <span className="ml-2 text-xs text-stone-400">({count})</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============ 搜索结果 ============
function SearchResults({ articles, total, query }: SearchResultProps) {
  if (!query) return null;
  return (
    <div>
      <p className="text-stone-500 mb-6">找到 <span className="text-amber-600 font-bold">{total}</span> 篇关于 "<span className="text-amber-600">{query}</span>" 的文章</p>
      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article.id} className="bg-white dark:bg-stone-800 rounded-lg p-5 border border-stone-200 dark:border-stone-700 hover:border-amber-500 transition-colors">
            <Link to={`/article/${article.slug}`}>
              <h2 className="font-serif font-bold text-lg hover:text-amber-600 transition-colors">{article.title}</h2>
            </Link>
            <p className="text-stone-500 text-sm mt-2">{truncate(article.excerpt || article.content, 150)}</p>
            <div className="flex items-center gap-3 mt-3 text-xs text-stone-400">
              <span>{formatDate(article.publishedAt || article.createdAt)}</span>
              {article.tags?.slice(0, 2).map((tag) => (
                <span key={tag.id} className="px-2 py-1 bg-stone-100 dark:bg-stone-700 rounded">#{tag.name}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const ClassicTheme: ThemeComponents = {
  name: 'classic',
  displayName: '经典主题',
  description: '传统两栏博客布局，温暖琥珀色调，带侧边栏',
  BlogLayout,
  ArticleCard,
  ArticleDetail,
  CategoryList,
  TagList,
  SearchResults,
};
