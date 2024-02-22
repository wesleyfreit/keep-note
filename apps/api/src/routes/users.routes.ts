import bcrypt from 'bcrypt';
import { FastifyInstance } from 'fastify';

import { emailValidator } from '@/lib/email-validator';
import { sendEmailVerification } from '@/lib/nodemailer-sender';
import { prisma } from '@/lib/prisma-client';
import { userAuth } from '@/middlewares/user-auth';
import { userValidation } from '@/middlewares/user-validation';
import { createUserBodySchema, loginUserBodySchema } from '@/validation/users-schema';

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

    const passwordHash = await bcrypt.hash(password, 10);

    const userCreated = await prisma.user.create({ data: { name, email, passwordHash } });

    if (userCreated) {
      const token = app.jwt.sign({}, { expiresIn: '1h', sub: userCreated.id });

      const firstName = userCreated.name.split(' ')[0] ?? userCreated.name;

      await sendEmailVerification(firstName, userCreated.email, token);

      return reply.status(201).send({ info: 'Email verification sent' });
    }
  });

  app.post('/signin', async (request, reply) => {
    const { email, password } = loginUserBodySchema.parse(request.body);

    const userByEmail = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });

    if (userByEmail) {
      if (!userByEmail.emailVerified) {
        const firstName = userByEmail.name.split(' ')[0] ?? userByEmail.name;

        await sendEmailVerification(firstName, userByEmail.email, userByEmail.id);

        return reply.status(401).send({ error: 'Email verification resent' });
      }

      const checkPassword = await bcrypt.compare(password, userByEmail.passwordHash);

      if (checkPassword) {
        const token = app.jwt.sign({}, { expiresIn: '1h', sub: userByEmail.id });

        return reply.send({ user: userByEmail, token });
      }
      return reply.status(401).send({ error: 'Invalid credentials' });
    }
    return reply.status(404).send({ error: 'User does not exist' });
  });

  app.post('/verify-email', { preHandler: [userAuth] }, async (request, reply) => {
    const userRequest = request.user;

    const userById = await prisma.user.findUnique({
      where: { id: userRequest.sub },
    });

    if (userById) {
      if (userById.emailVerified) {
        return reply.status(400).send({ error: 'Email already verified' });
      }

      await prisma.user.update({
        where: { id: userById.id },
        data: { emailVerified: true },
      });

      return reply.send({ info: 'Email verified' });
    }
    return reply.status(404).send({ error: 'User does not exist' });
  });

  app.get('/user', { preHandler: [userAuth, userValidation] }, async (request, reply) => {
    const userRequest = request.user;

    const userById = await prisma.user.findUnique({
      where: { id: userRequest.sub },
    });

    if (userById) {
      const token = app.jwt.sign({}, { expiresIn: '1h', sub: userById.id });

      return reply.send({ user: userById, token });
    }
  });
};
