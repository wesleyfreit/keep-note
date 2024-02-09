import cors from '@fastify/cors';
import fastify from 'fastify';
import { env } from './env';
import { notesRoutes } from './routes/notes.routes';

export const app = fastify();

app.register(cors, {
  origin: env.ORIGIN_URL,
});

if (env.NODE_ENV === 'dev') {
  app.addHook('preHandler', async (request) => {
    console.log(`[${request.method}] ${request.url}`);
  });
}

app.register(notesRoutes, { prefix: '/notes' });
