// 文章相关类型
export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'TRASHED';
  publishedAt?: string;
  scheduledAt?: string;
  viewCount: number;
  seoTitle?: string;
  seoDescription?: string;
  categoryId?: string;
  category?: Category;
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
}

// 分类
export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  _count?: { articles: number };
  createdAt: string;
}

// 标签
export interface Tag {
  id: string;
  name: string;
  slug: string;
  _count?: { articles: number };
  createdAt: string;
}

// 页面
export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  sortOrder: number;
  showInNav: boolean;
  createdAt: string;
  updatedAt: string;
}

// 媒体
export interface Media {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  thumbnailPath?: string;
  createdAt: string;
}

// 知识库文档
export interface KnowledgeDoc {
  id: string;
  title: string;
  slug: string;
  content: string;
  parentId?: string;
  parent?: KnowledgeDoc;
  sortOrder: number;
  children?: KnowledgeDoc[];
  createdAt: string;
  updatedAt: string;
}

// 评论
export interface Comment {
  id: string;
  content: string;
  authorName: string;
  authorEmail: string;
  authorUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'SPAM' | 'TRASHED';
  articleId: string;
  article?: Article;
  createdAt: string;
}

// AI 模型
export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'claude' | 'qwen';
  model: string;
  apiKey: string;
  baseUrl?: string;
  isDefault: boolean;
  createdAt: string;
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}


// 项目
export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  content?: string;
  techStack?: string; // JSON array of tech stack tags
  githubUrl?: string;
  demoUrl?: string;
  docsUrl?: string;
  chromeUrl?: string;   // Chrome Web Store URL
  firefoxUrl?: string;  // Firefox Add-ons URL
  npmUrl?: string;      // NPM package URL
  featuredImage?: string;
  status: 'DRAFT' | 'PUBLISHED';
  isRecommended: boolean;
  isPinned: boolean;
  sortOrder: number;
  categoryId?: string;
  category?: ProjectCategory;
  createdAt: string;
  updatedAt: string;
}

// 项目分类
export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  _count?: { projects: number };
  createdAt: string;
  updatedAt: string;
}

// 友链
export interface FriendLink {
  id: string;
  name: string;
  url: string;
  description?: string;
  logo?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// 访客统计相关类型
export interface Visitor {
  id: string;
  visitorId: string;
  ip?: string;
  country?: string;
  region?: string;
  city?: string;
  browser?: string;
  browserVer?: string;
  os?: string;
  osVer?: string;
  device?: string;
  screenWidth?: number;
  screenHeight?: number;
  language?: string;
  timezone?: string;
  firstVisit: string;
  lastVisit: string;
  visitCount: number;
}

export interface VisitorSession {
  id: string;
  visitorId: string;
  referer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  pageViews?: VisitorPageView[];
}

export interface VisitorPageView {
  id: string;
  sessionId: string;
  path: string;
  title?: string;
  articleId?: string;
  enterTime: string;
  leaveTime?: string;
  duration?: number;
  scrollDepth?: number;
}

// 统计数据汇总
export interface AnalyticsSummary {
  totalVisitors: number;
  totalSessions: number;
  totalPageViews: number;
  avgSessionDuration: number;
  avgPageDuration: number;
  bounceRate: number;
  todayVisitors: number;
  todaySessions: number;
  todayPageViews: number;
}

export interface AnalyticsTimeSeriesData {
  date: string;
  visitors: number;
  sessions: number;
  pageViews: number;
}

export interface AnalyticsTopPage {
  path: string;
  title?: string;
  views: number;
  avgDuration: number;
}

export interface AnalyticsTopReferer {
  referer: string;
  count: number;
}

export interface AnalyticsDeviceStats {
  device: string;
  count: number;
  percentage: number;
}

export interface AnalyticsBrowserStats {
  browser: string;
  count: number;
  percentage: number;
}

export interface AnalyticsCountryStats {
  country: string;
  count: number;
  percentage: number;
}
