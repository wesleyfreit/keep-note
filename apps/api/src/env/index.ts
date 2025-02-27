import { config } from 'dotenv';
import { z } from 'zod';

if (process.env.NODE_ENV === 'development') {
  config({ path: '.env.dev' });
} else config();

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().default(3333),
  ORIGIN_URL: z.string(),
  JWT_SECRET: z.string(),
  SENDER_HOST: z.string(),
  SENDER_PORT: z.coerce.number(),
  SENDER_USER: z.string(),
  SENDER_PASS: z.string(),
  SENDER_FROM: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('⚠️  Invalid environment variables!', _env.error.format());

  throw new Error('Invalid environment variables.');
}

export const env = _env.data;
