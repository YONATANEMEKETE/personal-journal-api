import z from 'zod';

export const createEntrySchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  content: z.string().min(1, 'Content is required').trim(),
  entryDate: z.string().date('Entry date must be a valid date (YYYY-MM-DD)'),
  tagIds: z.array(z.string().uuid('Invalid tag ID')).optional(),
});

export const updateEntrySchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').trim().optional(),
  content: z.string().min(1, 'Content cannot be empty').trim().optional(),
  entryDate: z
    .string()
    .date('Entry date must be a valid date (YYYY-MM-DD)')
    .optional(),
  tagIds: z.array(z.string().uuid('Invalid tag ID')).optional(),
});

export const entryIdParamsSchema = z.object({
  entryId: z.string().uuid('Invalid entry ID'),
});

export const listEntriesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  sortBy: z
    .enum(['entryDate', 'createdAt', 'updatedAt', 'title'])
    .optional()
    .default('entryDate'),
  sortDir: z.enum(['asc', 'desc']).optional().default('desc'),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
  tagIds: z.string().optional(),
  search: z.string().optional(),
});

export type CreateEntryInput = z.infer<typeof createEntrySchema>;
export type UpdateEntryInput = z.infer<typeof updateEntrySchema>;
export type EntryIdParams = z.infer<typeof entryIdParamsSchema>;
export type ListEntriesQuery = z.infer<typeof listEntriesQuerySchema>;
