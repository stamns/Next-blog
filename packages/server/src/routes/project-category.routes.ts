import { Router, Response } from 'express';
import { z } from 'zod';
import { projectCategoryService } from '../services/project-category.service.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { createError } from '../middleware/errorHandler.js';

const router = Router();

const createSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().optional(),
  sortOrder: z.number().optional(),
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().optional(),
  sortOrder: z.number().optional(),
});

router.get('/', async (_req, res, next) => {
  try {
    const categories = await projectCategoryService.findAll();
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const category = await projectCategoryService.findById(req.params.id);
    if (!category) {
      return next(createError('Category not found', 404, 'NOT_FOUND'));
    }
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const input = createSchema.parse(req.body);
    const category = await projectCategoryService.create(input);
    res.status(201).json({ success: true, data: category });
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
    const category = await projectCategoryService.update(req.params.id, input);
    res.json({ success: true, data: category });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(createError(error.errors[0].message, 400, 'VALIDATION_ERROR'));
    }
    next(error);
  }
});

router.delete('/:id', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    await projectCategoryService.delete(req.params.id);
    res.json({ success: true, data: { message: 'Category deleted' } });
  } catch (error) {
    next(error);
  }
});

export default router;
