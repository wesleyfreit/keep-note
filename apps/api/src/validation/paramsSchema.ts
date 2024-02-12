import z from 'zod';

export const paramsSchema = z.object({
  id: z.string({ required_error: 'Id is required' }).uuid('Invalid id format'),
});
