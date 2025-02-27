import { compare } from 'bcrypt';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { sendValidationEmail } from '../../lib/nodemailer-sender';
import { prisma } from '../../lib/prisma-client';

export const loginUserBodySchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),
});

export const signIn = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = loginUserBodySchema.parse(request.body);

  const userByEmail = await prisma.user.findFirst({
    where: { email: { equals: email, mode: 'insensitive' } },
  });

  if (userByEmail) {
    if (!userByEmail.emailVerified) {
      const firstName = userByEmail.name.split(' ')[0] ?? userByEmail.name;

      await sendValidationEmail(firstName, userByEmail.email, userByEmail.id);

      return reply.status(401).send({ error: 'Email verification resent' });
    }

    const checkPassword = await compare(password, userByEmail.passwordHash);

    if (checkPassword) {
      const token = await reply.jwtSign({}, { expiresIn: '1h', sub: userByEmail.id });

      return reply.send({
        user: {
          id: userByEmail.id,
          name: userByEmail.name,
          email: userByEmail.email,
          createdAt: userByEmail.createdAt,
        },
        token,
      });
    }
    return reply.status(401).send({ error: 'Invalid credentials' });
  }
  return reply.status(404).send({ error: 'User does not exist' });
};
