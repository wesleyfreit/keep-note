import z from 'zod';

export const createNoteBodySchema = z.object({
  content: z.string({ required_error: 'Name is required' }),
});
