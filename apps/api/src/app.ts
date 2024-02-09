import fastify from 'fastify';
import { env } from './env';

export const app = fastify();

if (env.NODE_ENV === 'dev') {
  app.addHook('preHandler', async (request) => {
    console.log(`[${request.method}] ${request.url}`);
  });
}
