import { z } from 'zod';

export const signUpSchema = z
  .object({
    name: z.string({ required_error: 'Campo vazio' }).min(3, 'Nome inválido'),
    email: z.string({ required_error: 'Campo vazio' }).email('E-mail inválido'),
    password: z
      .string({ required_error: 'Campo vazio' })
      .min(6, 'A senha deve ter pelo menos 6 dígitos'),
    confirm_password: z.string({ required_error: 'Campo vazio' }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'As senhas não são iguais',
    path: ['confirm_password'],
  });

export type ISignUp = z.infer<typeof signUpSchema>;
