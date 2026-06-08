import z from 'zod';

export const entryIdParamsSchema = z.object({
  entryId: z.string().uuid('Invalid entry ID'),
});

export const assignTagsBodySchema = z.object({
  tagIds: z
    .array(z.string().uuid('Invalid tag ID'))
    .min(1, 'At least one tag ID is required'),
});

export const deleteEntryTagParamsSchema = z.object({
  entryId: z.string().uuid('Invalid entry ID'),
  tagId: z.string().uuid('Invalid tag ID'),
});

export type EntryIdParamsSchema = z.infer<typeof entryIdParamsSchema>;
export type AssignTagsBodySchema = z.infer<typeof assignTagsBodySchema>;
export type DeleteEntryTagParamsSchema = z.infer<
  typeof deleteEntryTagParamsSchema
>;
