import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import fastify from 'fastify';
import { ZodError } from 'zod';

import { env } from './env';
import { notesRoutes } from './routes/notes.routes';
import { usersRoutes } from './routes/users.routes';

export const app = fastify();

app.register(cors, {
  origin: env.ORIGIN_URL,
});

app.register(jwt, {
  secret: env.JWT_SECRET,
});

if (env.NODE_ENV !== 'production') {
  app.addHook('preHandler', async (request) => {
    console.log(`[${request.method}] ${request.url}`);
  });
}

app.get('/', async (req, res) =>
  res.status(200).send({
    info: 'Welcome to the KEEP NOTE API',
    version: '1.0.0',
    input: req.headers,
  }),
);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ error: 'Validation error.', issues: error.format() });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ error: 'Internal server error.' });
});

app.register(usersRoutes);
app.register(notesRoutes, { prefix: '/notes' });
