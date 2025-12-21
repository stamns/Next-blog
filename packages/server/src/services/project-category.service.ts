import { prisma } from '../lib/prisma.js';
import type { ProjectCategory } from '@prisma/client';

export interface CreateProjectCategoryInput {
  name: string;
  slug?: string;
  sortOrder?: number;
}

export interface UpdateProjectCategoryInput {
  name?: string;
  slug?: string;
  sortOrder?: number;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50) + '-' + Date.now().toString(36);
}

export class ProjectCategoryService {
  async create(input: CreateProjectCategoryInput): Promise<ProjectCategory> {
    const slug = input.slug || generateSlug(input.name);
    return prisma.projectCategory.create({
      data: {
        name: input.name,
        slug,
        sortOrder: input.sortOrder ?? 0,
      },
    });
  }

  async findById(id: string): Promise<ProjectCategory | null> {
    return prisma.projectCategory.findUnique({
      where: { id },
      include: { projects: true },
    });
  }

  async findAll(): Promise<ProjectCategory[]> {
    return prisma.projectCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { projects: true } } },
    });
  }

  async update(id: string, input: UpdateProjectCategoryInput): Promise<ProjectCategory> {
    const data: Partial<ProjectCategory> = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.slug !== undefined) data.slug = input.slug;
    if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder;

    return prisma.projectCategory.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    // 将该分类下的项目的 categoryId 设为 null
    await prisma.project.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    });
    await prisma.projectCategory.delete({ where: { id } });
  }
}

export const projectCategoryService = new ProjectCategoryService();
