import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../lib/prisma-client';

export const noteBodySchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});

export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const { content, title } = noteBodySchema.parse(request.body);
  const userRequest = request.user;

  const note = await prisma.note.create({
    data: {
      title: title ?? '',
      content: content ?? '',
      userId: userRequest.sub,
    },
  });

  return reply.status(201).send({ note });
};
