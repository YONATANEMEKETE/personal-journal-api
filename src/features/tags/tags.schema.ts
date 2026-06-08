import z from 'zod';
import { TagColor } from '../../generated/prisma/enums.js';

export const createTagSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  color: z.nativeEnum(TagColor).optional(),
});

export const listTagsQuerySchema = z.object({
  includeEntryCount: z.coerce.boolean().optional().default(false),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type ListTagsQuery = z.infer<typeof listTagsQuerySchema>;