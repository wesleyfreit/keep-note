import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string({ required_error: 'Campo vazio' }).email('E-mail inválido'),
  password: z
    .string({ required_error: 'Campo vazio' })
    .min(6, 'A senha deve ter pelo menos 6 dígitos'),
});

export type ISignIn = z.infer<typeof signInSchema>;
