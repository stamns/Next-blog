import { Router, Response } from 'express';
import { prerenderService } from '../services/prerender.service.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/prerender/all
 * 重新生成所有静态页面
 */
router.post('/all', authenticate, async (_req: AuthRequest, res: Response, next) => {
  try {
    const result = await prerenderService.renderAllArticles();
    res.json({
      success: true,
      data: {
        message: `生成完成：成功 ${result.success} 篇，失败 ${result.failed} 篇`,
        ...result,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/prerender/article/:slug
 * 生成单篇文章静态页面
 */
router.post('/article/:slug', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    await prerenderService.renderArticle(req.params.slug);
    res.json({
      success: true,
      data: { message: '静态页面生成成功' },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/prerender/article/:slug
 * 删除文章静态页面
 */
router.delete('/article/:slug', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    await prerenderService.deleteArticlePage(req.params.slug);
    res.json({
      success: true,
      data: { message: '静态页面已删除' },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
