import { Request, Response, NextFunction } from 'express';
import { settingService } from '../services/setting.service.js';

/**
 * 验证请求来源（Origin/Referer）中间件
 * 用于保护公开的写入接口，防止跨站请求
 */
export async function validateOrigin(req: Request, res: Response, next: NextFunction) {
  // 开发环境跳过验证
  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;

  // 获取配置的站点 URL
  const siteUrl = await settingService.get('siteUrl');

  // 如果没有配置 siteUrl，跳过验证（兼容未配置的情况）
  if (!siteUrl) {
    return next();
  }

  // 解析允许的域名
  let allowedHost: string;
  try {
    allowedHost = new URL(siteUrl).host;
  } catch {
    return next(); // URL 解析失败，跳过验证
  }

  // 验证 Origin
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      if (originHost === allowedHost) {
        return next();
      }
    } catch {
      // Origin 解析失败
    }
  }

  // 验证 Referer
  if (referer) {
    try {
      const refererHost = new URL(referer).host;
      if (refererHost === allowedHost) {
        return next();
      }
    } catch {
      // Referer 解析失败
    }
  }

  // 验证失败
  console.warn('[Security] Origin validation failed:', {
    origin,
    referer,
    allowedHost,
    path: req.path,
  });
  return res.status(403).json({ success: false, error: 'Forbidden: Invalid origin' });
}
