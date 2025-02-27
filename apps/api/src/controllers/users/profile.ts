import type { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../lib/prisma-client';

export const profile = async (request: FastifyRequest, reply: FastifyReply) => {
  const userRequest = request.user;

  const userById = await prisma.user.findUnique({
    where: { id: userRequest.sub },
  });

  if (userById) {
    const token = await reply.jwtSign({}, { expiresIn: '1h', sub: userById.id });

    return reply.send({ user: userById, token });
  }
};
