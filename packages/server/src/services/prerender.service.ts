import { prisma } from '../lib/prisma.js';
import { markdownService } from './markdown.service.js';
import { settingService } from './setting.service.js';
import * as fs from 'fs';
import * as path from 'path';

const DIST_PATH = path.resolve(process.cwd(), '../web/dist');

export class PrerenderService {
  /**
   * 生成文章静态页�?
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

    const { html: content, toc } = await markdownService.parse(article.content);
    const settings = await settingService.getPublic();
    
    const htmlContent = this.generateHtml(article, content, toc, settings);
    
    // 确保目录存在
    const articleDir = path.join(DIST_PATH, 'article');
    if (!fs.existsSync(articleDir)) {
      fs.mkdirSync(articleDir, { recursive: true });
    }

    // 写入文件
    const filePath = path.join(articleDir, `${slug}.html`);
    fs.writeFileSync(filePath, htmlContent, 'utf-8');
  }

  /**
   * 生成所有已发布文章的静态页�?
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

    // 同时生成首页和列表页
    await this.renderHomePage();

    return { success, failed };
  }

  /**
   * 删除文章静态页�?
   */
  async deleteArticlePage(slug: string): Promise<void> {
    const filePath = path.join(DIST_PATH, 'article', `${slug}.html`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  /**
   * 生成首页静态页�?
   */
  async renderHomePage(): Promise<void> {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      orderBy: { publishedAt: 'desc' },
      take: 10,
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    });

    const settings = await settingService.getPublic();
    const htmlContent = this.generateHomeHtml(articles, settings);
    
    // 备份原始 index.html
    const indexPath = path.join(DIST_PATH, 'index.html');
    const spaIndexPath = path.join(DIST_PATH, 'spa.html');
    
    if (fs.existsSync(indexPath) && !fs.existsSync(spaIndexPath)) {
      fs.copyFileSync(indexPath, spaIndexPath);
    }

    fs.writeFileSync(indexPath, htmlContent, 'utf-8');
  }

  /**
   * 生成文章�?HTML
   */
  private generateHtml(
    article: any,
    content: string,
    toc: any[],
    settings: Record<string, string>
  ): string {
    const siteName = settings.siteName || 'NextBlog';
    const siteUrl = settings.siteUrl || '';
    const title = article.seoTitle || article.title;
    const description = article.seoDescription || article.excerpt || '';
    const tags = article.tags?.map((t: any) => t.tag?.name || t.name).join(', ') || '';
    const publishedAt = article.publishedAt ? new Date(article.publishedAt).toISOString() : '';
    const category = article.category?.name || '';

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - ${siteName}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="${tags}">
  <meta name="author" content="${article.author?.username || 'Admin'}">
  <link rel="canonical" href="${siteUrl}/article/${article.slug}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${siteUrl}/article/${article.slug}">
  <meta property="og:site_name" content="${siteName}">
  ${article.featuredImage ? `<meta property="og:image" content="${article.featuredImage}">` : ''}
  <meta property="article:published_time" content="${publishedAt}">
  ${category ? `<meta property="article:section" content="${category}">` : ''}
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  
  <!-- JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${title}",
    "description": "${description}",
    "datePublished": "${publishedAt}",
    "author": {
      "@type": "Person",
      "name": "${article.author?.username || 'Admin'}"
    },
    "publisher": {
      "@type": "Organization",
      "name": "${siteName}"
    }
  }
  </script>
  
  <link rel="stylesheet" href="/assets/index.css">
</head>
<body>
  <div id="root">
    <article class="max-w-4xl mx-auto px-4 py-8">
      <header class="mb-8">
        <h1 class="text-3xl font-bold mb-4">${article.title}</h1>
        <div class="text-gray-500 text-sm">
          ${publishedAt ? `<time datetime="${publishedAt}">${new Date(publishedAt).toLocaleDateString('zh-CN')}</time>` : ''}
          ${category ? ` · <span>${category}</span>` : ''}
        </div>
      </header>
      <div class="prose prose-lg max-w-none">
        ${content}
      </div>
    </article>
  </div>
  <script type="module" src="/assets/index.js"></script>
</body>
</html>`;
  }

  /**
   * 生成首页 HTML
   */
  private generateHomeHtml(articles: any[], settings: Record<string, string>): string {
    const siteName = settings.siteName || 'NextBlog';
    const siteDescription = settings.siteDescription || '';
    const siteUrl = settings.siteUrl || '';
    const siteKeywords = settings.siteKeywords || '';

    const articleListHtml = articles.map(article => {
      const excerpt = article.excerpt || '';
      const date = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('zh-CN') : '';
      return `
        <article class="mb-8 p-6 bg-white rounded-lg shadow">
          <h2 class="text-xl font-bold mb-2">
            <a href="/article/${article.slug}">${article.title}</a>
          </h2>
          <p class="text-gray-600 mb-2">${excerpt}</p>
          <div class="text-gray-400 text-sm">${date}</div>
        </article>
      `;
    }).join('');

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${siteName}</title>
  <meta name="description" content="${siteDescription}">
  <meta name="keywords" content="${siteKeywords}">
  <link rel="canonical" href="${siteUrl}">
  
  <meta property="og:type" content="website">
  <meta property="og:title" content="${siteName}">
  <meta property="og:description" content="${siteDescription}">
  <meta property="og:url" content="${siteUrl}">
  
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "${siteName}",
    "description": "${siteDescription}",
    "url": "${siteUrl}"
  }
  </script>
  
  <link rel="stylesheet" href="/assets/index.css">
</head>
<body>
  <div id="root">
    <main class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">${siteName}</h1>
      ${articleListHtml}
    </main>
  </div>
  <script type="module" src="/assets/index.js"></script>
</body>
</html>`;
  }
}

export const prerenderService = new PrerenderService();
