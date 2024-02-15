import z from 'zod';

export const envSchema = z.object({
  API_URL: z.string(),
});
