import type { FastifyReply, FastifyRequest } from 'fastify';
import { noteBodySchema } from './create';
import { paramsSchema } from './find';
import { prisma } from '../../lib/prisma-client';

export const update = async (request: FastifyRequest, reply: FastifyReply) => {
  const modified = noteBodySchema.parse(request.body);
  const { id } = paramsSchema.parse(request.params);
  const userRequest = request.user;

  const note = await prisma.note.update({
    data: { ...modified },
    where: { id, userId: userRequest.sub },
  });

  return reply.status(200).send({ updatedAt: note.updatedAt });
};
