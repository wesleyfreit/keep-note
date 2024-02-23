import 'dotenv/config';
import z from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
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
