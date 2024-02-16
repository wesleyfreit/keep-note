import cors from '@fastify/cors';
import rate_limit from '@fastify/rate-limit';
import fastify from 'fastify';
import { ZodError } from 'zod';

import { env } from './env';
import { notesRoutes } from './routes/notes.routes';
import { usersRoutes } from './routes/users.routes';

export const app = fastify();

app.register(cors, {
  origin: env.ORIGIN_URL,
});

app.register(rate_limit);

if (env.NODE_ENV === 'dev') {
  app.addHook('preHandler', async (request) => {
    console.log(`[${request.method}] ${request.url}`);
  });
}

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    const errorObject = error.errors.reduce((acc: { [key: string]: string }, err) => {
      if (err.path[0] !== undefined) {
        const path = err.path[0];
        acc[path] = err.message;
      }
      return acc;
    }, {});

    reply.status(400).send({ error: errorObject });
  } else if (error && typeof error === 'object' && 'statusCode' in error) {
    const errorCode = error.statusCode as number;
    reply.status(errorCode).send({ error: error.message });
  } else {
    reply.status(500).send({ error: 'Internal server error' });
  }
});

app.register(usersRoutes);
app.register(notesRoutes, { prefix: '/notes' });
