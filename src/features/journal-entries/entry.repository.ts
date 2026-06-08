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
    return prisma.journalEntry.findFirst({ where: { title, userId } });
  }
}

export const entryRepository = new EntryRepository();