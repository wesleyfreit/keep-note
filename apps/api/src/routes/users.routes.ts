import { FastifyInstance } from 'fastify';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import { emailValidator } from '@/lib/email-validator';
import { prisma } from '@/lib/prisma-client';
import { auth } from '@/services/firebase-auth';
import { createUserBodySchema, loginUserBodySchema } from '@/validation/users-schema';
import { FirebaseError } from 'firebase/app';

export const usersRoutes = async (app: FastifyInstance) => {
  app.post('/signup', async (request, reply) => {
    const { name, email, password } = createUserBodySchema.parse(request.body);

    const userByEmail = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });

    if (userByEmail) {
      return reply.status(409).send({ error: 'User already exists' });
    }

    const isValidEmail = await emailValidator(email);

    if (!isValidEmail.valid) {
      return reply.status(400).send({ error: 'Invalid email' });
    }

    const [{ user }, { id }] = await Promise.all([
      createUserWithEmailAndPassword(auth, email, password),
      prisma.user.create({ data: { name, email } }),
    ]);

    if (user.email && id) {
      await sendEmailVerification(user);

      return reply.status(201).send({ info: 'Email verification sent' });
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

          return reply.status(401).send({ error: 'Email is not verified' });
        }

        const token = app.jwt.sign({}, { expiresIn: '1h', sub: userByEmail.id });

        return reply.send({ user_id: userByEmail.id, token });
      }
      return reply.status(404).send({ error: 'User does not exist' });
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code;

        if (errorCode === 'auth/invalid-credential')
          return reply.status(401).send({ error: 'Invalid credentials' });

        if (errorCode === 'auth/too-many-requests')
          return reply.status(429).send({ error: 'Too many requests' });
      }
    }
  });
};
