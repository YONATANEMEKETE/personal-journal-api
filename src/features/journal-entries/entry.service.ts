import { prisma } from '../../shared/db/prisma.js';
import { entryRepository } from './entry.repository.js';
import { conflict, notFound } from '../../shared/errors/error.js';
import type { CreateEntryInput } from './entry.schema.js';

class EntryService {
  async create(data: CreateEntryInput, userId: string) {
    const existing = await entryRepository.findByTitle(data.title, userId);
    if (existing) {
      throw conflict('An entry with this title already exists');
    }

    const baseData = {
      title: data.title,
      content: data.content,
      entryDate: new Date(data.entryDate),
      userId,
    };

    if (data.tagIds && data.tagIds.length > 0) {
      const tags = await Promise.all(
        data.tagIds.map((id) => prisma.tag.findUnique({ where: { id } })),
      );

      for (const tag of tags) {
        if (!tag || tag.userId !== userId) {
          throw notFound('One or more tags not found');
        }
      }

      return prisma.$transaction(async (tx) => {
        const entry = await entryRepository.create(baseData, tx);

        await tx.entryTag.createMany({
          data: data.tagIds!.map((tagId) => ({
            entryId: entry.id,
            tagId,
          })),
        });

        return entry;
      });
    }

    return prisma.$transaction((tx) =>
      entryRepository.create(baseData, tx),
    );
  }

  async getEntry(entryId: string, userId: string) {
    const entry = await entryRepository.findById(entryId);
    if (!entry || entry.userId !== userId) {
      throw notFound('Entry not found');
    }
    return entry;
  }
}

export const entryService = new EntryService();