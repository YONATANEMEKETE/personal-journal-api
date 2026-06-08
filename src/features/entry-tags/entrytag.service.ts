import { prisma } from '../../shared/db/prisma.js';
import { entryRepository } from '../journal-entries/entry.repository.js';
import { tagsRepository } from '../tags/tags.repository.js';
import { entryTagRepository } from './entrytag.repository.js';
import { notFound } from '../../shared/errors/error.js';

class EntryTagService {
  async assignTags(entryId: string, tagIds: string[], userId: string) {
    const entry = await entryRepository.findById(entryId);
    if (!entry || entry.userId !== userId) {
      throw notFound('Entry not found');
    }

    const tags = await Promise.all(
      tagIds.map((id) => tagsRepository.findById(id)),
    );

    for (const tag of tags) {
      if (!tag || tag.userId !== userId) {
        throw notFound('One or more tags not found');
      }
    }

    return prisma.$transaction(async (tx) => {
      await entryTagRepository.assignTags(entryId, tagIds, tx);

      return tx.journalEntry.findUnique({
        where: { id: entryId },
        include: { entryTags: { include: { tag: true } } },
      });
    });
  }

  async removeTag(entryId: string, tagId: string, userId: string) {
    const entry = await entryRepository.findById(entryId);
    if (!entry || entry.userId !== userId) {
      throw notFound('Entry not found');
    }

    const tag = await tagsRepository.findById(tagId);
    if (!tag || tag.userId !== userId) {
      throw notFound('Tag not found');
    }

    await entryTagRepository.removeTag(entryId, tagId);
  }
}

export const entryTagService = new EntryTagService();