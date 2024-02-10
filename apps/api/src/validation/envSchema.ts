import z from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production', 'test']).default('dev'),
  ORIGIN_URL: z.string(),
  PORT: z.coerce.number().default(3333),
});