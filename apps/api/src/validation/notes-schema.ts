import z from 'zod';

export const noteBodySchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});
