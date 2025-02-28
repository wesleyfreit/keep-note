import { hash } from 'bcryptjs';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { sendValidationEmail } from '../../lib/nodemailer-sender';
import { prisma } from '../../lib/prisma-client';

export const createUserBodySchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),
});

export const signUp = async (request: FastifyRequest, reply: FastifyReply) => {
  const { name, email, password } = createUserBodySchema.parse(request.body);

  const userByEmail = await prisma.user.findFirst({
    where: { email: { equals: email, mode: 'insensitive' } },
  });

  if (userByEmail) {
    return reply.status(409).send({ error: 'User already exists' });
  }

  const passwordHash = await hash(password, 10);

  const userCreated = await prisma.user.create({ data: { name, email, passwordHash } });

  if (userCreated) {
    const token = await reply.jwtSign({}, { expiresIn: '1h', sub: userCreated.id });

    const firstName = userCreated.name.split(' ')[0] ?? userCreated.name;

    await sendValidationEmail(firstName, userCreated.email, token);

    return reply.status(201).send({ info: 'Email verification sent' });
  }
};
