import type { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../lib/prisma-client';
import { paramsSchema } from './find';

export const remove = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = paramsSchema.parse(request.params);
  const userRequest = request.user;

  await prisma.note.delete({
    where: { id, userId: userRequest.sub },
  });

  return reply.status(204).send();
};
