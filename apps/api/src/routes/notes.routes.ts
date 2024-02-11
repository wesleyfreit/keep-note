import { prisma } from '@/lib/prisma';
import { createNoteBodySchema } from '@/validation/notesSchema';
import { FastifyInstance } from 'fastify';

export const notesRoutes = async (app: FastifyInstance) => {
  app.get('/', async (request, reply) => {
    const notes = await prisma.note.findMany();

    return reply.send({ notes });
  });

  app.post('/', async (request, reply) => {
    const { content, title } = createNoteBodySchema.parse(request.body);

    const note = await prisma.note.create({
      data: { title: title ?? '', content: content ?? '' },
    });

    return reply.status(201).send({ id: note.id });
  });
};
