import { Router, Response } from 'express';
import multer from 'multer';
import fileType from 'file-type';
import { mediaService } from '../services/media.service.js';
import { settingService } from '../services/setting.service.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { createError } from '../middleware/errorHandler.js';

const router = Router();

// 默认允许的文件类型
const DEFAULT_ALLOWED_TYPES = 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml,application/pdf';

// 配置 multer 内存存储
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

/**
 * 验证文件真实类型（通过 magic bytes）
 * 防止攻击者伪造 MIME 类型上传恶意文件
 */
async function validateFileType(
  buffer: Buffer,
  declaredMimeType: string,
  allowedTypes: string[]
): Promise<{ valid: boolean; detectedType?: string; error?: string }> {
  // SVG 是文本格式，file-type 无法检测，需要特殊处理
  if (declaredMimeType === 'image/svg+xml') {
    const content = buffer.toString('utf8', 0, 1000);
    if (content.includes('<svg') || content.includes('<?xml')) {
      return { valid: allowedTypes.includes('image/svg+xml'), detectedType: 'image/svg+xml' };
    }
    return { valid: false, error: '文件内容不是有效的 SVG' };
  }

  // 使用 magic bytes 检测真实文件类型
  const detected = await fileType.fromBuffer(buffer);

  if (!detected) {
    // 无法检测类型（可能是文本文件如 SVG）
    // 对于无法检测的文件，拒绝上传以确保安全
    return { valid: false, error: '无法识别文件类型' };
  }

  // 检查检测到的类型是否在允许列表中
  if (!allowedTypes.includes(detected.mime)) {
    return {
      valid: false,
      detectedType: detected.mime,
      error: `文件实际类型 (${detected.mime}) 不在允许列表中`,
    };
  }

  // 检查声明的类型与实际类型是否匹配（防止伪造）
  if (detected.mime !== declaredMimeType) {
    console.warn(`[Security] MIME 类型不匹配: 声明=${declaredMimeType}, 实际=${detected.mime}`);
    // 使用检测到的真实类型，而不是声明的类型
  }

  return { valid: true, detectedType: detected.mime };
}

/**
 * GET /api/media
 * 获取媒体列表
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const mimeType = req.query.mimeType as string | undefined;

    const result = await mediaService.findAll({ page, limit, mimeType });
    res.json({ success: true, data: result.items });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/media/:id
 * 获取媒体详情
 */
router.get('/:id', async (req, res, next) => {
  try {
    const media = await mediaService.findById(req.params.id);
    if (!media) {
      return next(createError('Media not found', 404, 'NOT_FOUND'));
    }
    res.json({ success: true, data: media });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/media/:id/download
 * 下载媒体文件
 */
router.get('/:id/download', async (req, res, next) => {
  try {
    const result = await mediaService.getFileBuffer(req.params.id);
    if (!result) {
      return next(createError('Media not found', 404, 'NOT_FOUND'));
    }

    res.setHeader('Content-Type', result.media.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.media.originalName}"`);
    res.send(result.buffer);
  } catch (error) {
    next(error);
  }
});


/**
 * POST /api/media/upload
 * 上传媒体文件
 */
router.post('/upload', authenticate, upload.single('file'), async (req: AuthRequest, res: Response, next) => {
  try {
    const file = req.file;
    if (!file) {
      return next(createError('No file uploaded', 400, 'VALIDATION_ERROR'));
    }

    // 获取允许的文件类型
    const allowedTypes = (await settingService.get('allowedMediaTypes')) || DEFAULT_ALLOWED_TYPES;
    const allowedList = allowedTypes.split(',').map((t: string) => t.trim().toLowerCase());

    // 验证文件真实类型（通过 magic bytes）
    const validation = await validateFileType(file.buffer, file.mimetype.toLowerCase(), allowedList);
    if (!validation.valid) {
      return next(
        createError(validation.error || `不支持的文件类型。允许的类型: ${allowedTypes}`, 400, 'VALIDATION_ERROR')
      );
    }

    // 使用检测到的真实 MIME 类型
    const actualMimeType = validation.detectedType || file.mimetype;

    const media = await mediaService.upload({
      originalName: file.originalname,
      mimeType: actualMimeType,
      size: file.size,
      buffer: file.buffer,
    });

    // 返回可访问的 URL
    res.status(201).json({
      success: true,
      data: {
        ...media,
        url: `/api/media/${media.id}/file`,
        path: `/api/media/${media.id}/file`,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/media/batch
 * 批量删除媒体
 */
router.delete('/batch', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return next(createError('请提供要删除的文件ID列表', 400, 'VALIDATION_ERROR'));
    }

    for (const id of ids) {
      await mediaService.delete(id);
    }

    res.json({ success: true, data: { message: `已删除 ${ids.length} 个文件` } });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/media/:id/file
 * 获取媒体文件（用于显示）
 */
router.get('/:id/file', async (req, res, next) => {
  try {
    const result = await mediaService.getFileBuffer(req.params.id);
    if (!result) {
      return next(createError('Media not found', 404, 'NOT_FOUND'));
    }

    res.setHeader('Content-Type', result.media.mimeType);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.send(result.buffer);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/media/:id
 * 删除媒体
 */
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    await mediaService.delete(req.params.id);
    res.json({ success: true, data: { message: 'Media deleted' } });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/media/download-url
 * 从远程 URL 下载图片并保存到本地
 */
router.post('/download-url', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const { url } = req.body;
    if (!url) {
      return next(createError('请提供图片 URL', 400, 'VALIDATION_ERROR'));
    }

    const media = await mediaService.downloadFromUrl(url);
    res.status(201).json({
      success: true,
      data: {
        ...media,
        url: `/api/media/${media.id}/file`,
        path: `/api/media/${media.id}/file`,
      },
    });
  } catch (error) {
    next(error instanceof Error ? createError(error.message, 400, 'DOWNLOAD_ERROR') : error);
  }
});

/**
 * POST /api/media/localize-content
 * 本地化内容中的所有远程图片
 */
router.post('/localize-content', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const { content } = req.body;
    if (!content) {
      return next(createError('请提供内容', 400, 'VALIDATION_ERROR'));
    }

    const result = await mediaService.localizeContentImages(content);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
