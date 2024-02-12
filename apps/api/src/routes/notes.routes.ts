import { prisma } from '@/lib/prisma';
import { noteBodySchema } from '@/validation/notesSchema';
import { paramsSchema } from '@/validation/paramsSchema';
import { FastifyInstance } from 'fastify';

export const notesRoutes = async (app: FastifyInstance) => {
  app.get('/', async (request, reply) => {
    const notes = await prisma.note.findMany();

    return reply.send({ notes });
  });

  app.post('/', async (request, reply) => {
    const { content, title } = noteBodySchema.parse(request.body);

    const note = await prisma.note.create({
      data: { title: title ?? '', content: content ?? '' },
    });

    return reply.status(201).send({ id: note.id });
  });

  app.put('/:id', async (request, reply) => {
    const modified = noteBodySchema.parse(request.body);
    const { id } = paramsSchema.parse(request.params);

    await prisma.note.update({
      data: { ...modified },
      where: { id },
    });

    return reply.status(204).send();
  });

  app.delete('/:id', async (request, reply) => {
    const { id } = paramsSchema.parse(request.params);

    await prisma.note.delete({
      where: { id },
    });

    return reply.status(204).send();
  });
};
