import z from 'zod';

export const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string(),
  NEXT_PRIVATE_API_URL: z.string(),
});
