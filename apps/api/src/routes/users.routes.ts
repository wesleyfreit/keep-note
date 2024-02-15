import { FastifyInstance } from 'fastify';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import { prisma } from '@/lib/prisma';
import { auth } from '@/services/firebase';
import { createUserBodySchema, loginUserBodySchema } from '@/validation/usersSchema';

export const usersRoutes = async (app: FastifyInstance) => {
  app.post('/signup', async (request, reply) => {
    const { name, email, password } = createUserBodySchema.parse(request.body);

    const userByEmail = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });

    if (userByEmail) {
      return reply.status(400).send({ error: 'User already exists' });
    }

    const [{ user }, { id }] = await Promise.all([
      createUserWithEmailAndPassword(auth, email, password),
      prisma.user.create({ data: { name, email } }),
    ]);

    if (user.email) {
      await sendEmailVerification(user);
      return reply.status(201).send({ user_id: id });
    }
  });

  app.post('/signin', async (request, reply) => {
    const { email, password } = loginUserBodySchema.parse(request.body);

    try {
      const userByEmail = await prisma.user.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } },
      });

      if (userByEmail) {
        const { user } = await signInWithEmailAndPassword(auth, email, password);

        if (!user.emailVerified) {
          await sendEmailVerification(user);

          return reply
            .status(401)
            .send({ error: 'Email is not verified, email verification sent' });
        }

        return reply.send({ user_id: userByEmail.id });
      }
      return reply.status(404).send({ error: 'User does not exist' });
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error) {
        const errorCode = error.code;

        if (errorCode === 'auth/invalid-credential')
          return reply.status(401).send({ error: 'Invalid credentials' });
      }
      return reply.status(500).send({ error: 'Internal Server error' });
    }
  });
};
