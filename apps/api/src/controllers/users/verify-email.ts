import type { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../lib/prisma-client';

export const verifyEmail = async (request: FastifyRequest, reply: FastifyReply) => {
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
};
