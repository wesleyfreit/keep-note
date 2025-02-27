import type { FastifyInstance } from 'fastify';
import { profile } from '../controllers/users/profile';
import { signIn } from '../controllers/users/sign-in';
import { signUp } from '../controllers/users/sing-up';
import { verifyEmail } from '../controllers/users/verify-email';
import { userAuth } from '../middlewares/user-auth';
import { userValidation } from '../middlewares/user-validation';

export const usersRoutes = async (app: FastifyInstance) => {
  app.post('/signup', signUp);

  app.post('/signin', signIn);

  app.post('/verify-email', { onRequest: [userAuth] }, verifyEmail);

  app.get('/user', { onRequest: [userAuth, userValidation] }, profile);
};
