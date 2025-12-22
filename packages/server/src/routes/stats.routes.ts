import { Router, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { statsService } from '../services/stats.service.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { validateOrigin } from '../middleware/validateOrigin.js';

const router = Router();

// 记录浏览的 rate limit
const recordLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1分钟
  max: 60, // 每分钟最多60次
  message: { success: false, error: 'Too many requests' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * GET /api/stats/public
 * 获取公开统计数据（无需认证，供前台主题使用）
 */
router.get('/public', async (_req, res, next) => {
  try {
    const stats = await statsService.getPublicStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
});

router.get('/', authenticate, async (_req, res, next) => {
  try {
    const stats = await statsService.getOverallStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
});

router.get('/popular', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const articles = await statsService.getPopularArticles(limit);
    res.json({ success: true, data: articles });
  } catch (error) {
    next(error);
  }
});

router.get('/views', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const views = await statsService.getViewsByDate(days);
    res.json({ success: true, data: views });
  } catch (error) {
    next(error);
  }
});

router.post('/record', recordLimiter, validateOrigin, async (req, res, next) => {
  try {
    const { articleId, path } = req.body;
    const view = await statsService.recordView({
      articleId,
      path,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      referer: req.headers.referer,
    });
    res.status(201).json({ success: true, data: view });
  } catch (error) {
    next(error);
  }
});

export default router;
