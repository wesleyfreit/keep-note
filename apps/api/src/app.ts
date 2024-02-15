import cors from '@fastify/cors';
import fastify from 'fastify';
import { ZodError } from 'zod';
import { env } from './env';
import { notesRoutes } from './routes/notes.routes';
import { usersRoutes } from './routes/users.routes';

export const app = fastify();

app.register(cors, {
  origin: env.ORIGIN_URL,
});

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

    reply.status(400).send({ message: errorObject });
  } else {
    reply.status(500).send({ message: 'Internal server error' });
  }
});

app.register(usersRoutes);
app.register(notesRoutes, { prefix: '/notes' });
