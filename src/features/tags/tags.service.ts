import { tagsRepository } from './tags.repository.js';
import { conflict, notFound } from '../../shared/errors/error.js';
import type { CreateTagInput, UpdateTagInput, ListTagsQuery } from './tags.schema.js';

class TagsService {
  async create(data: CreateTagInput, userId: string) {
    const existing = await tagsRepository.findByName(userId, data.name);
    if (existing) {
      throw conflict('A tag with this name already exists');
    }

    const tag = await tagsRepository.create({
      userId,
      name: data.name,
      color: data.color,
    });

    return tag;
  }

  async listTags(userId: string, query: ListTagsQuery) {
    return tagsRepository.findAll(userId, query.includeEntryCount);
  }

  async getTag(tagId: string, userId: string) {
    const tag = await tagsRepository.findById(tagId);
    if (!tag || tag.userId !== userId) {
      throw notFound('Tag not found');
    }
    return tag;
  }

  async updateTag(tagId: string, data: UpdateTagInput, userId: string) {
    await this.getTag(tagId, userId);

    if (data.name) {
      const existing = await tagsRepository.findByName(userId, data.name);
      if (existing && existing.id !== tagId) {
        throw conflict('A tag with this name already exists');
      }
    }

    return tagsRepository.update(tagId, data);
  }
}

export const tagsService = new TagsService();