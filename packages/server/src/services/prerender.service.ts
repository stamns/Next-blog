import { prisma } from '../lib/prisma.js';
import { markdownService } from './markdown.service.js';
import { settingService } from './setting.service.js';
import * as fs from 'fs';
import * as path from 'path';

const DIST_PATH = path.resolve(process.cwd(), '../web/dist');

export class PrerenderService {
  /**
   * 生成文章静态页面（仅用于 SEO，不覆盖 SPA）
   */
  async renderArticle(slug: string): Promise<void> {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: { include: { tag: true } },
        author: true,
      },
    });

    if (!article || article.status !== 'PUBLISHED') {
      throw new Error('Article not found or not published');
    }

    const { html: content } = await markdownService.parse(article.content);
    const settings = await settingService.getPublic();
    
    const htmlContent = this.generateHtml(article, content, settings);
    
    // 确保目录存在 - 使用 prerender 子目录，不影响 SPA
    const articleDir = path.join(DIST_PATH, 'prerender', 'article');
    if (!fs.existsSync(articleDir)) {
      fs.mkdirSync(articleDir, { recursive: true });
    }

    // 写入文件
    const filePath = path.join(articleDir, `${slug}.html`);
    fs.writeFileSync(filePath, htmlContent, 'utf-8');
  }

  /**
   * 生成所有已发布文章的静态页面
   */
  async renderAllArticles(): Promise<{ success: number; failed: number }> {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      select: { slug: true },
    });

    let success = 0;
    let failed = 0;

    for (const article of articles) {
      try {
        await this.renderArticle(article.slug);
        success++;
      } catch {
        failed++;
      }
    }

    return { success, failed };
  }

  /**
   * 删除文章静态页面
   */
  async deleteArticlePage(slug: string): Promise<void> {
    const filePath = path.join(DIST_PATH, 'prerender', 'article', `${slug}.html`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  /**
   * 生成文章的 HTML（包含完整 SEO 元数据，同时保留 SPA 功能）
   */
  private generateHtml(
    article: any,
    content: string,
    settings: Record<string, string>
  ): string {
    const siteName = settings.siteName || 'NextBlog';
    const siteUrl = settings.siteUrl || '';
    const title = article.seoTitle || article.title;
    const description = article.seoDescription || article.excerpt || '';
    const tags = article.tags?.map((t: any) => t.tag?.name || t.name).join(', ') || '';
    const publishedAt = article.publishedAt ? new Date(article.publishedAt).toISOString() : '';
    const category = article.category?.name || '';

    // 生成纯 SEO 页面，包含文章内容供爬虫抓取
    // 同时包含重定向脚本，让普通用户跳转到 SPA
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHtml(title)} - ${this.escapeHtml(siteName)}</title>
  <meta name="description" content="${this.escapeHtml(description)}">
  <meta name="keywords" content="${this.escapeHtml(tags)}">
  <meta name="author" content="${this.escapeHtml(article.author?.username || 'Admin')}">
  <link rel="canonical" href="${siteUrl}/article/${article.slug}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${this.escapeHtml(title)}">
  <meta property="og:description" content="${this.escapeHtml(description)}">
  <meta property="og:url" content="${siteUrl}/article/${article.slug}">
  <meta property="og:site_name" content="${this.escapeHtml(siteName)}">
  ${article.featuredImage ? `<meta property="og:image" content="${article.featuredImage}">` : ''}
  <meta property="article:published_time" content="${publishedAt}">
  ${category ? `<meta property="article:section" content="${this.escapeHtml(category)}">` : ''}
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${this.escapeHtml(title)}">
  <meta name="twitter:description" content="${this.escapeHtml(description)}">
  
  <!-- JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${this.escapeJson(title)}",
    "description": "${this.escapeJson(description)}",
    "datePublished": "${publishedAt}",
    "author": {
      "@type": "Person",
      "name": "${this.escapeJson(article.author?.username || 'Admin')}"
    },
    "publisher": {
      "@type": "Organization",
      "name": "${this.escapeJson(siteName)}"
    }
  }
  </script>
  
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    h1 { font-size: 2em; margin-bottom: 0.5em; }
    .meta { color: #666; font-size: 0.9em; margin-bottom: 2em; }
    .content { margin-top: 2em; }
    .content h2 { font-size: 1.5em; margin-top: 1.5em; }
    .content h3 { font-size: 1.25em; margin-top: 1.25em; }
    .content p { margin: 1em 0; }
    .content pre { background: #f5f5f5; padding: 1em; overflow-x: auto; }
    .content code { background: #f5f5f5; padding: 0.2em 0.4em; }
    .content img { max-width: 100%; }
    .spa-link { display: block; margin-top: 2em; padding: 1em; background: #f0f0f0; text-align: center; }
  </style>
</head>
<body>
  <article>
    <header>
      <h1>${this.escapeHtml(article.title)}</h1>
      <div class="meta">
        ${publishedAt ? `<time datetime="${publishedAt}">${new Date(publishedAt).toLocaleDateString('zh-CN')}</time>` : ''}
        ${category ? ` · <span>${this.escapeHtml(category)}</span>` : ''}
        ${article.author ? ` · <span>${this.escapeHtml(article.author.username)}</span>` : ''}
      </div>
    </header>
    <div class="content">
      ${content}
    </div>
  </article>
  <div class="spa-link">
    <a href="/article/${article.slug}">查看完整页面 →</a>
  </div>
</body>
</html>`;
  }

  /**
   * HTML 转义
   */
  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * JSON 字符串转义
   */
  private escapeJson(str: string): string {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  }
}

export const prerenderService = new PrerenderService();
