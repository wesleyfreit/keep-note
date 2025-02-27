import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../lib/prisma-client';

export const paramsSchema = z.object({
  id: z.string({ required_error: 'Id is required' }).uuid('Invalid id format'),
});

export const find = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = paramsSchema.parse(request.params);
  const userRequest = request.user;

  const note = await prisma.note.findUnique({
    where: { id, userId: userRequest.sub },
  });

  if (!note) {
    return reply.status(404).send();
  }

  return reply.send({ note });
};
