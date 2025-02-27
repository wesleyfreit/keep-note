import type { FastifyInstance } from 'fastify';

import { create } from '../controllers/notes/create';
import { fetch } from '../controllers/notes/fetch';
import { find } from '../controllers/notes/find';
import { remove } from '../controllers/notes/remove';
import { update } from '../controllers/notes/update';
import { userAuth } from '../middlewares/user-auth';
import { userValidation } from '../middlewares/user-validation';

export const notesRoutes = async (app: FastifyInstance) => {
  app.addHook('preHandler', userAuth);
  app.addHook('preHandler', userValidation);

  app.get('/', fetch);
  app.get('/:id', find);
  app.post('/', create);
  app.put('/:id', update);
  app.delete('/:id', remove);
};
