import z from 'zod';
import { TagColor } from '../../generated/prisma/enums.js';

export const createTagSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  color: z.nativeEnum(TagColor).optional(),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;