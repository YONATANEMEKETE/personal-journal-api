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
}

export const tagsRepository = new TagsRepository();