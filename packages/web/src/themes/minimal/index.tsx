// 极简主题 - 纯净简约，大量留白，专注阅读
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

// ============ 布局 - 窄宽度居中 ============
function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <header className="py-16 px-4">
        <div className="max-w-xl mx-auto text-center">
          <Link to="/" className="text-4xl font-extralight tracking-[0.2em] uppercase">Blog</Link>
          <div className="w-12 h-px bg-gray-300 dark:bg-gray-700 mx-auto mt-6" />
        </div>
      </header>

      <nav className="max-w-xl mx-auto px-4 mb-16">
        <div className="flex items-center justify-center gap-4 text-xs tracking-[0.1em] uppercase flex-wrap">
          <Link to="/" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap">文章</Link>
          <span className="text-gray-300 dark:text-gray-700">·</span>
          <Link to="/categories" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap">分类</Link>
          <span className="text-gray-300 dark:text-gray-700">·</span>
          <Link to="/tags" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap">标签</Link>
          <span className="text-gray-300 dark:text-gray-700">·</span>
          <Link to="/knowledge" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap">知识库</Link>
          <span className="text-gray-300 dark:text-gray-700">·</span>
          <Link to="/search" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap">搜索</Link>
          <span className="text-gray-300 dark:text-gray-700">·</span>
          <ThemeToggle />
        </div>
      </nav>

      <main className="max-w-xl mx-auto px-4 pb-24">{children}</main>

      <footer className="py-16 text-center">
        <div className="w-8 h-px bg-gray-200 dark:bg-gray-800 mx-auto mb-6" />
        <p className="text-xs text-gray-400 tracking-[0.1em]">© {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

// ============ 文章卡片 - 极简列表 ============
function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="py-10 border-b border-gray-100 dark:border-gray-900 last:border-0">
      <time className="text-xs text-gray-400 tracking-wide uppercase">
        {formatDate(article.publishedAt || article.createdAt)}
      </time>
      <Link to={`/article/${article.slug}`}>
        <h2 className="text-xl font-light mt-3 mb-4 hover:text-gray-500 transition-colors leading-relaxed">
          {article.title}
        </h2>
      </Link>
      <p className="text-gray-500 text-sm leading-loose font-light">
        {truncate(article.excerpt || article.content, 180)}
      </p>
      <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
        {article.category && (
          <Link to={`/?category=${article.category.id}`} className="hover:text-gray-600 transition-colors">
            {article.category.name}
          </Link>
        )}
        {article.tags?.slice(0, 2).map((tag) => (
          <Link key={tag.id} to={`/?tag=${tag.id}`} className="hover:text-gray-600 transition-colors">
            #{tag.name}
          </Link>
        ))}
      </div>
    </article>
  );
}

// ============ 文章详情 - 居中大标题 ============
function ArticleDetail({ article }: ArticleDetailProps) {
  return (
    <article>
      <header className="text-center mb-16">
        <time className="text-xs text-gray-400 tracking-[0.15em] uppercase">
          {formatDate(article.publishedAt || article.createdAt)}
        </time>
        <h1 className="text-3xl font-extralight mt-6 mb-8 leading-relaxed">{article.title}</h1>
        <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
          {article.author && <span>{article.author.username}</span>}
          {article.category && (
            <Link to={`/?category=${article.category.id}`} className="hover:text-gray-600">{article.category.name}</Link>
          )}
          <span>{article.viewCount || 0} 阅读</span>
        </div>
        <div className="w-16 h-px bg-gray-200 dark:bg-gray-800 mx-auto mt-8" />
      </header>

      <div className="prose prose-sm dark:prose-invert max-w-none 
        prose-headings:font-light prose-headings:tracking-wide
        prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-loose prose-p:font-light
        prose-a:text-gray-900 dark:prose-a:text-gray-100 prose-a:no-underline prose-a:border-b prose-a:border-gray-300"
        dangerouslySetInnerHTML={{ __html: article.htmlContent || article.content }} />

      {article.tags && article.tags.length > 0 && (
        <footer className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-900">
          <div className="flex flex-wrap justify-center gap-4">
            {article.tags.map((tag) => (
              <Link key={tag.id} to={`/?tag=${tag.id}`} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                #{tag.name}
              </Link>
            ))}
          </div>
        </footer>
      )}
    </article>
  );
}

// ============ 分类列表 - 简洁列表 ============
function CategoryList({ categories }: CategoryListProps) {
  return (
    <div>
      <h1 className="text-2xl font-extralight tracking-wide text-center mb-12">分类</h1>
      <div className="space-y-4">
        {categories.map((category) => (
          <Link key={category.id} to={`/?category=${category.id}`}
            className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-900 hover:text-gray-500 transition-colors group">
            <span className="font-light">{category.name}</span>
            <span className="text-xs text-gray-400 group-hover:text-gray-600">{category._count?.articles || 0}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ============ 标签列表 - 简洁标签 ============
function TagList({ tags }: TagListProps) {
  return (
    <div>
      <h1 className="text-2xl font-extralight tracking-wide text-center mb-12">标签</h1>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
        {tags.map((tag) => (
          <Link key={tag.id} to={`/?tag=${tag.id}`}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
            #{tag.name}
            <span className="text-xs ml-1 text-gray-300">({tag._count?.articles || 0})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ============ 搜索结果 - 简洁列表 ============
function SearchResults({ articles, total, query }: SearchResultProps) {
  if (!query) return null;
  return (
    <div>
      <p className="text-center text-gray-400 text-sm mb-12">
        找到 {total} 篇关于 "{query}" 的文章
      </p>
      <div className="space-y-8">
        {articles.map((article) => (
          <div key={article.id} className="py-6 border-b border-gray-100 dark:border-gray-900">
            <Link to={`/article/${article.slug}`}>
              <h2 className="font-light text-lg hover:text-gray-500 transition-colors">{article.title}</h2>
            </Link>
            <p className="text-gray-500 text-sm mt-2 font-light leading-relaxed">
              {truncate(article.excerpt || article.content, 120)}
            </p>
            <time className="text-xs text-gray-400 mt-3 block">
              {formatDate(article.publishedAt || article.createdAt)}
            </time>
          </div>
        ))}
      </div>
    </div>
  );
}

export const MinimalTheme: ThemeComponents = {
  name: 'minimal',
  displayName: '极简主题',
  description: '纯净简约，大量留白，专注阅读体验',
  BlogLayout,
  ArticleCard,
  ArticleDetail,
  CategoryList,
  TagList,
  SearchResults,
};
