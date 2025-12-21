import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { PrismaClient } from '@prisma/client';
import { ProjectService } from './project.service.js';
import { ProjectCategoryService } from './project-category.service.js';

const prisma = new PrismaClient();
const projectService = new ProjectService();
const projectCategoryService = new ProjectCategoryService();

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

describe('ProjectService', () => {
  it('should create and retrieve a project', async () => {
    const project = await projectService.create({
      name: 'Test Project',
      description: 'A test project',
    });
    expect(project.name).toBe('Test Project');
    expect(project.status).toBe('DRAFT');

    const found = await projectService.findById(project.id);
    expect(found?.name).toBe('Test Project');
  });

  it('should update a project', async () => {
    const project = await projectService.create({
      name: 'Original',
      description: 'Original description',
    });
    const updated = await projectService.update(project.id, {
      name: 'Updated',
      status: 'PUBLISHED',
    });
    expect(updated.name).toBe('Updated');
    expect(updated.status).toBe('PUBLISHED');
  });

  /**
   * **Property 2: Project Status Filtering**
   * **Validates: Requirements 4.1**
   */
  it('Property 2: findPublished should only return PUBLISHED projects', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
            status: fc.constantFrom('DRAFT', 'PUBLISHED'),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        async (projectsData) => {
          for (const data of projectsData) {
            await projectService.create({
              name: data.name,
              description: 'Test',
              status: data.status,
            });
          }

          const published = await projectService.findPublished();
          const expectedCount = projectsData.filter(p => p.status === 'PUBLISHED').length;

          expect(published.length).toBe(expectedCount);
          expect(published.every(p => p.status === 'PUBLISHED')).toBe(true);

          return true;
        }
      ),
      { numRuns: 5 }
    );
  }, 60000);

  /**
   * **Property 3: Category Filter Correctness**
   * **Validates: Requirements 4.4**
   */
  it('Property 3: Category filter should return only projects in that category', async () => {
    const category1 = await projectCategoryService.create({ name: 'Category 1' });
    const category2 = await projectCategoryService.create({ name: 'Category 2' });

    await projectService.create({
      name: 'Project 1',
      description: 'Test',
      categoryId: category1.id,
      status: 'PUBLISHED',
    });
    await projectService.create({
      name: 'Project 2',
      description: 'Test',
      categoryId: category2.id,
      status: 'PUBLISHED',
    });

    const filtered = await projectService.findPublished(category1.id);
    expect(filtered.length).toBe(1);
    expect(filtered[0].categoryId).toBe(category1.id);
  });

  /**
   * **Property 8: Pinned Projects Priority**
   * **Validates: Requirements 2.2**
   */
  it('Property 8: Pinned projects should appear first', async () => {
    await projectService.create({
      name: 'Normal Project',
      description: 'Test',
      status: 'PUBLISHED',
      isPinned: false,
      sortOrder: 0,
    });
    await projectService.create({
      name: 'Pinned Project',
      description: 'Test',
      status: 'PUBLISHED',
      isPinned: true,
      sortOrder: 100,
    });

    const projects = await projectService.findPublished();
    expect(projects[0].isPinned).toBe(true);
    expect(projects[0].name).toBe('Pinned Project');
  });
});
