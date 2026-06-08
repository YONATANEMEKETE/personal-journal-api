import { prisma } from '../../shared/db/prisma.js';
import type { Prisma } from '../../generated/prisma/client.js';

class EntryRepository {
  async create(
    data: { title: string; content: string; entryDate: Date; userId: string },
    tx: Prisma.TransactionClient,
  ) {
    return tx.journalEntry.create({ data });
  }

  async findByTitle(title: string, userId: string) {
    return prisma.journalEntry.findFirst({
      where: {
        title: { equals: title, mode: 'insensitive' },
        userId,
      },
    });
  }

  async findById(id: string) {
    return prisma.journalEntry.findUnique({ where: { id } });
  }

  async update(
    id: string,
    data: { title?: string; content?: string; entryDate?: Date },
    tx: Prisma.TransactionClient,
  ) {
    return tx.journalEntry.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.journalEntry.delete({ where: { id } });
  }

  async findAll(params: {
    userId: string;
    page: number;
    limit: number;
    sortBy: string;
    sortDir: 'asc' | 'desc';
    dateFrom?: string;
    dateTo?: string;
    tagIds?: string[];
    search?: string;
  }) {
    const where: Prisma.JournalEntryWhereInput = { userId: params.userId };

    if (params.dateFrom || params.dateTo) {
      where.entryDate = {};
      if (params.dateFrom) where.entryDate.gte = new Date(params.dateFrom);
      if (params.dateTo) where.entryDate.lte = new Date(params.dateTo);
    }

    if (params.tagIds && params.tagIds.length > 0) {
      where.entryTags = {
        some: { tagId: { in: params.tagIds } },
      };
    }

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { content: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const skip = (params.page - 1) * params.limit;

    const [entries, total] = await Promise.all([
      prisma.journalEntry.findMany({
        where,
        orderBy: { [params.sortBy]: params.sortDir },
        skip,
        take: params.limit,
      }),
      prisma.journalEntry.count({ where }),
    ]);

    return { entries, total };
  }
}

export const entryRepository = new EntryRepository();
