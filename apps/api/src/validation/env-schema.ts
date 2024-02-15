import z from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production', 'test']).default('dev'),
  ORIGIN_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  FIREBASE_APIKEY: z.string(),
  FIREBASE_AUTHDOMAIN: z.string(),
  FIREBASE_PROJECTID: z.string(),
  FIREBASE_STORAGEBUCKET: z.string(),
  FIREBASE_MESSAGINGSENDERID: z.string(),
  FIREBASE_APPID: z.string(),
});
