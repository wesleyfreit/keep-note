import z from 'zod';

export const createNoteBodySchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});
