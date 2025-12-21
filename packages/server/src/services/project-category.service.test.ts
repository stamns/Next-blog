import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { PrismaClient } from '@prisma/client';
import { ProjectCategoryService } from './project-category.service.js';
import { ProjectService } from './project.service.js';

const prisma = new PrismaClient();
const projectCategoryService = new ProjectCategoryService();
const projectService = new ProjectService();

beforeAll(async () => {
  await prisma.project.deleteMany({});
  await prisma.projectCategory.deleteMany({});
});

afterEach(async () => {
  await prisma.project.deleteMany({});
  await prisma.projectCategory.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('ProjectCategoryService', () => {
  it('should create and retrieve a category', async () => {
    const category = await projectCategoryService.create({ name: 'Test Category' });
    expect(category.name).toBe('Test Category');
    expect(category.slug).toBeTruthy();

    const found = await projectCategoryService.findById(category.id);
    expect(found?.name).toBe('Test Category');
  });

  it('should update a category', async () => {
    const category = await projectCategoryService.create({ name: 'Original' });
    const updated = await projectCategoryService.update(category.id, { name: 'Updated' });
    expect(updated.name).toBe('Updated');
  });

  /**
   * **Property 4: Category Deletion Preserves Projects**
   * **Validates: Requirements 3.4**
   */
  it('Property 4: Category deletion should set project categoryId to null', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          categoryName: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
          projectName: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
        }),
        async ({ categoryName, projectName }) => {
          const category = await projectCategoryService.create({ name: categoryName });
          const project = await projectService.create({
            name: projectName,
            description: 'Test description',
            categoryId: category.id,
          });

          await projectCategoryService.delete(category.id);

          const updatedProject = await projectService.findById(project.id);
          expect(updatedProject?.categoryId).toBeNull();

          const deletedCategory = await projectCategoryService.findById(category.id);
          expect(deletedCategory).toBeNull();

          return true;
        }
      ),
      { numRuns: 5 }
    );
  }, 60000);
});
