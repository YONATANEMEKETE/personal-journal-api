import { prisma } from '../../shared/db/prisma.js';
import type { Prisma } from '../../generated/prisma/client.js';

class EntryTagRepository {
  async assignTags(
    entryId: string,
    tagIds: string[],
    tx: Prisma.TransactionClient,
  ) {
    return tx.entryTag.createMany({
      data: tagIds.map((tagId) => ({ entryId, tagId })),
      skipDuplicates: true,
    });
  }

  async removeTag(entryId: string, tagId: string) {
    return prisma.entryTag.delete({
      where: { entryId_tagId: { entryId, tagId } },
    });
  }
}

export const entryTagRepository = new EntryTagRepository();