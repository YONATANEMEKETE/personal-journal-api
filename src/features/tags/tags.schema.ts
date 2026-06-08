import z from 'zod';
import { TagColor } from '../../generated/prisma/enums.js';

export const createTagSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  color: z.nativeEnum(TagColor).optional(),
});

export const updateTagSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').trim().optional(),
  color: z.nativeEnum(TagColor).optional(),
});

export const listTagsQuerySchema = z.object({
  includeEntryCount: z.coerce.boolean().optional().default(false),
});

export const tagIdParamsSchema = z.object({
  tagId: z.string().uuid('Invalid tag ID'),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type ListTagsQuery = z.infer<typeof listTagsQuerySchema>;
export type TagIdParams = z.infer<typeof tagIdParamsSchema>;