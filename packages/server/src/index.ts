import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import articleRoutes from './routes/article.routes.js';
import categoryRoutes from './routes/category.routes.js';
import tagRoutes from './routes/tag.routes.js';
import pageRoutes from './routes/page.routes.js';
import mediaRoutes from './routes/media.routes.js';
import knowledgeRoutes from './routes/knowledge.routes.js';
import commentRoutes from './routes/comment.routes.js';
import statsRoutes from './routes/stats.routes.js';
import backupRoutes from './routes/backup.routes.js';
import aiRoutes from './routes/ai.routes.js';
import themeRoutes from './routes/theme.routes.js';
import pluginRoutes from './routes/plugin.routes.js';
import settingRoutes from './routes/setting.routes.js';
import prerenderRoutes from './routes/prerender.routes.js';
import projectRoutes from './routes/project.routes.js';
import projectCategoryRoutes from './routes/project-category.routes.js';
import friendLinkRoutes from './routes/friend-link.routes.js';
import { themeService } from './services/theme.service.js';

const app = express();
const PORT = process.env.PORT || 3012;

// CORS 配置 - 支持环境变量 ALLOWED_ORIGINS（逗号分隔）
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['*'];

app.use(cors({
  origin: (origin, callback) => {
    // 允许无 origin 的请求（如服务端请求、Postman）
    if (!origin) return callback(null, true);
    // 允许所有来源
    if (allowedOrigins.includes('*')) return callback(null, true);
    // 检查是否在白名单
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(null, false);
  },
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/plugins', pluginRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/prerender', prerenderRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/project-categories', projectCategoryRoutes);
app.use('/api/friend-links', friendLinkRoutes);

// Error handler
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  
  // 初始化内置主题
  try {
    await themeService.initBuiltinThemes();
    console.log('Built-in themes initialized');
  } catch (error) {
    console.error('Failed to initialize themes:', error);
  }
});

export default app;
