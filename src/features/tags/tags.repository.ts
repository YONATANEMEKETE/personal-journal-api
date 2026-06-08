import { prisma } from '../../shared/db/prisma.js';
import type { $Enums } from '../../generated/prisma/client.js';

class TagsRepository {
  async create(data: { userId: string; name: string; color?: $Enums.TagColor }) {
    return prisma.tag.create({ data });
  }

  async findById(id: string) {
    return prisma.tag.findUnique({ where: { id } });
  }

  async findByName(userId: string, name: string) {
    return prisma.tag.findFirst({ where: { userId, name } });
  }

  async findAll(userId: string, includeEntryCount: boolean) {
    return prisma.tag.findMany({
      where: { userId },
      include: includeEntryCount
        ? { _count: { select: { entryTags: true } } }
        : undefined,
    });
  }

  async update(id: string, data: { name?: string; color?: $Enums.TagColor | null }) {
    return prisma.tag.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.tag.delete({ where: { id } });
  }
}

export const tagsRepository = new TagsRepository();