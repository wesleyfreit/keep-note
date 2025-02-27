import type { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma-client';

export const userValidation = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = request.user.sub;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }
};
