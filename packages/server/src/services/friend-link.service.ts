import { prisma } from '../lib/prisma.js';
import type { FriendLink } from '@prisma/client';

export interface CreateFriendLinkInput {
  name: string;
  url: string;
  description?: string;
  logo?: string;
  sortOrder?: number;
}

export interface UpdateFriendLinkInput {
  name?: string;
  url?: string;
  description?: string;
  logo?: string;
  sortOrder?: number;
}

export class FriendLinkService {
  async create(input: CreateFriendLinkInput): Promise<FriendLink> {
    return prisma.friendLink.create({
      data: {
        name: input.name,
        url: input.url,
        description: input.description,
        logo: input.logo,
        sortOrder: input.sortOrder ?? 0,
      },
    });
  }

  async findById(id: string): Promise<FriendLink | null> {
    return prisma.friendLink.findUnique({ where: { id } });
  }

  async findAll(): Promise<FriendLink[]> {
    return prisma.friendLink.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async update(id: string, input: UpdateFriendLinkInput): Promise<FriendLink> {
    const data: Partial<FriendLink> = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.url !== undefined) data.url = input.url;
    if (input.description !== undefined) data.description = input.description;
    if (input.logo !== undefined) data.logo = input.logo;
    if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder;

    return prisma.friendLink.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.friendLink.delete({ where: { id } });
  }
}

export const friendLinkService = new FriendLinkService();
