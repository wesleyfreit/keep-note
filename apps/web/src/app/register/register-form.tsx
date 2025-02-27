'use client';
import { signUp } from '@/actions/users';
import { Input } from '@/components/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '../../components/button';

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

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUp>({
    resolver: zodResolver(signUpSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSignUp = async (data: ISignUp) => {
    setIsLoading(true);

    const name = data.name;
    const email = data.email;
    const password = data.password;

    try {
      await signUp(name, email, password);

      toast.info(
        'Você criou sua conta! Um link de confirmação foi enviado para o seu email.',
      );

      router.refresh();
      router.push('/login');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleSignUp)}
      className="mx-auto flex w-full max-w-lg flex-col space-y-5 p-5 md:p-10"
    >
      <div>
        <h1 className="text-3xl font-semibold leading-relaxed">Criar conta</h1>
        <span>
          Já têm uma conta?{' '}
          <Link
            href="/login"
            onClick={() => router.push('/login')}
            className="font-bold text-blue-500 underline hover:text-blue-600"
          >
            Faça login!
          </Link>
        </span>
      </div>

      <Input
        {...register('name')}
        htmlFor="name"
        data-error={errors?.name?.message ? true : false}
        error={errors?.name?.message}
        name="name"
        label="Nome"
        placeholder="Insira seu nome"
      />

      <Input
        {...register('email')}
        htmlFor="email"
        data-error={errors?.email?.message ? true : false}
        error={errors?.email?.message}
        name="email"
        label="Email"
        placeholder="Insira um email"
        type="email"
      />

      <Input
        {...register('password')}
        htmlFor="password"
        data-error={errors?.password?.message ? true : false}
        error={errors?.password?.message}
        name="password"
        label="Senha"
        placeholder="Insira uma senha"
        type="password"
      />

      <Input
        {...register('confirm_password')}
        htmlFor="confirm_password"
        data-error={errors?.confirm_password?.message ? true : false}
        error={errors?.confirm_password?.message}
        name="confirm_password"
        label="Confirmar senha"
        placeholder="Confirme a senha inserida"
        type="password"
      />

      <Button title="Começar" isLoading={isLoading} />
    </form>
  );
};
