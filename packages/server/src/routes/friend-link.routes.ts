import { Router, Response } from 'express';
import { z } from 'zod';
import { friendLinkService } from '../services/friend-link.service.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { createError } from '../middleware/errorHandler.js';

const router = Router();

const createSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('Invalid URL'),
  description: z.string().optional(),
  logo: z.string().optional(),
  sortOrder: z.number().optional(),
});

const updateSchema = createSchema.partial();

router.get('/public', async (_req, res, next) => {
  try {
    const links = await friendLinkService.findAll();
    res.json({ success: true, data: links });
  } catch (error) {
    next(error);
  }
});

router.get('/', authenticate, async (_req: AuthRequest, res: Response, next) => {
  try {
    const links = await friendLinkService.findAll();
    res.json({ success: true, data: links });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const link = await friendLinkService.findById(req.params.id);
    if (!link) {
      return next(createError('Friend link not found', 404, 'NOT_FOUND'));
    }
    res.json({ success: true, data: link });
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const input = createSchema.parse(req.body);
    const link = await friendLinkService.create(input);
    res.status(201).json({ success: true, data: link });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(createError(error.errors[0].message, 400, 'VALIDATION_ERROR'));
    }
    next(error);
  }
});

router.put('/:id', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const input = updateSchema.parse(req.body);
    const link = await friendLinkService.update(req.params.id, input);
    res.json({ success: true, data: link });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(createError(error.errors[0].message, 400, 'VALIDATION_ERROR'));
    }
    next(error);
  }
});

router.delete('/:id', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    await friendLinkService.delete(req.params.id);
    res.json({ success: true, data: { message: 'Friend link deleted' } });
  } catch (error) {
    next(error);
  }
});

export default router;
