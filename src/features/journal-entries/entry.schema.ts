import z from 'zod';

export const createEntrySchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  content: z.string().min(1, 'Content is required').trim(),
  entryDate: z.string().date('Entry date must be a valid date (YYYY-MM-DD)'),
  tagIds: z.array(z.string().uuid('Invalid tag ID')).optional(),
});

export const entryIdParamsSchema = z.object({
  entryId: z.string().uuid('Invalid entry ID'),
});

export type CreateEntryInput = z.infer<typeof createEntrySchema>;
export type EntryIdParams = z.infer<typeof entryIdParamsSchema>;