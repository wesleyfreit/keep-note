import { FastifyInstance } from 'fastify';
import { emailValidator } from '@/lib/email-validator';
import { prisma } from '@/lib/prisma-client';
import { userAuth } from '@/middlewares/user-auth';
import { userValidation } from '@/middlewares/user-validation';
import { createUserBodySchema, loginUserBodySchema } from '@/validation/users-schema';

export const usersRoutes = async (app: FastifyInstance) => {
  app.post('/signup', async (request, reply) => {
    const { name, email } = createUserBodySchema.parse(request.body);

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

    const user = await prisma.user.create({ data: { name, email } });

    return reply.status(201).send(user);
  });

  app.post('/signin', async (request, reply) => {
    const { email } = loginUserBodySchema.parse(request.body);

    const userByEmail = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });

    if (userByEmail) {
      const token = app.jwt.sign({}, { expiresIn: '1h', sub: userByEmail.id });

      return reply.send({ user: userByEmail, token });
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
