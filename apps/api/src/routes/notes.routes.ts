import { prisma } from '@/lib/prisma-client';
import { userAuth } from '@/middlewares/user-auth';
import { userValidation } from '@/middlewares/user-validation';
import { noteBodySchema } from '@/validation/notes-schema';
import { paramsSchema } from '@/validation/params-schema';
import { FastifyInstance } from 'fastify';

export const notesRoutes = async (app: FastifyInstance) => {
  app.addHook('preHandler', userAuth);

  app.addHook('preHandler', userValidation);

  app.get('/', async (request, reply) => {
    const userRequest = request.user;

    const notes = await prisma.note.findMany({
      where: { id: userRequest.sub },
      orderBy: { updatedAt: 'desc' },
    });

    return reply.send({ notes });
  });

  app.get('/:id', async (request, reply) => {
    const { id } = paramsSchema.parse(request.params);

    const note = await prisma.note.findUnique({ where: { id } });

    if (!note) {
      return reply.status(404).send();
    }

    return reply.send({ note });
  });

  app.post('/', async (request, reply) => {
    const { content, title } = noteBodySchema.parse(request.body);

    const note = await prisma.note.create({
      data: { title: title ?? '', content: content ?? '' },
    });

    return reply.status(201).send({ note });
  });

  app.put('/:id', async (request, reply) => {
    const modified = noteBodySchema.parse(request.body);
    const { id } = paramsSchema.parse(request.params);

    const note = await prisma.note.update({
      data: { ...modified },
      where: { id },
    });

    return reply.status(200).send({ updatedAt: note.updatedAt });
  });

  app.delete('/:id', async (request, reply) => {
    const { id } = paramsSchema.parse(request.params);

    await prisma.note.delete({
      where: { id },
    });

    return reply.status(204).send();
  });
};
