import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { PrismaClient } from '@prisma/client';
import { FriendLinkService } from './friend-link.service.js';

const prisma = new PrismaClient();
const friendLinkService = new FriendLinkService();

beforeAll(async () => {
  await prisma.friendLink.deleteMany({});
});

afterEach(async () => {
  await prisma.friendLink.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('FriendLinkService', () => {
  it('should create and retrieve a friend link', async () => {
    const link = await friendLinkService.create({
      name: 'Test Link',
      url: 'https://example.com',
      description: 'A test link',
    });
    expect(link.name).toBe('Test Link');
    expect(link.url).toBe('https://example.com');

    const found = await friendLinkService.findById(link.id);
    expect(found?.name).toBe('Test Link');
  });

  it('should update a friend link', async () => {
    const link = await friendLinkService.create({
      name: 'Original',
      url: 'https://original.com',
    });
    const updated = await friendLinkService.update(link.id, {
      name: 'Updated',
      url: 'https://updated.com',
    });
    expect(updated.name).toBe('Updated');
    expect(updated.url).toBe('https://updated.com');
  });

  it('should delete a friend link', async () => {
    const link = await friendLinkService.create({
      name: 'To Delete',
      url: 'https://delete.com',
    });
    await friendLinkService.delete(link.id);
    const found = await friendLinkService.findById(link.id);
    expect(found).toBeNull();
  });

  /**
   * **Property 6: FriendLink CRUD Consistency**
   * **Validates: Requirements 5.2, 5.3**
   */
  it('Property 6: Create and retrieve should return same data', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0),
          url: fc.webUrl(),
          description: fc.string({ maxLength: 100 }),
        }),
        async ({ name, url, description }) => {
          const created = await friendLinkService.create({ name, url, description });
          const found = await friendLinkService.findById(created.id);

          expect(found?.name).toBe(name);
          expect(found?.url).toBe(url);
          expect(found?.description).toBe(description);

          return true;
        }
      ),
      { numRuns: 5 }
    );
  }, 60000);

  /**
   * **Property 7: Sort Order Consistency**
   * **Validates: Requirements 5.2**
   */
  it('Property 7: Links should be returned in sortOrder', async () => {
    await friendLinkService.create({ name: 'Third', url: 'https://c.com', sortOrder: 3 });
    await friendLinkService.create({ name: 'First', url: 'https://a.com', sortOrder: 1 });
    await friendLinkService.create({ name: 'Second', url: 'https://b.com', sortOrder: 2 });

    const links = await friendLinkService.findAll();
    expect(links[0].name).toBe('First');
    expect(links[1].name).toBe('Second');
    expect(links[2].name).toBe('Third');
  });
});
