import type { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../lib/prisma-client';

export const fetch = async (request: FastifyRequest, reply: FastifyReply) => {
  const userRequest = request.user;

  const notes = await prisma.note.findMany({
    where: { userId: userRequest.sub },
    orderBy: { updatedAt: 'desc' },
  });

  return reply.send({ notes });
};
