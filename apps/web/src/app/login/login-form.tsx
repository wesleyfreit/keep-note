'use client';
import { signIn } from '@/actions/users';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { useAuth } from '@/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string({ required_error: 'Campo vazio' }).email('E-mail inválido'),
  password: z
    .string({ required_error: 'Campo vazio' })
    .min(6, 'A senha deve ter pelo menos 6 dígitos'),
});

export type ISignIn = z.infer<typeof signInSchema>;

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignIn>({
    resolver: zodResolver(signInSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { setUser } = useAuth();

  const handleSignIn = async (data: ISignIn) => {
    setIsLoading(true);

    const email = data.email;
    const password = data.password;

    try {
      const authenticatedUser = await signIn(email, password);

      if (authenticatedUser) {
        setUser(authenticatedUser);
        toast.info('Você entrou na sua conta!');

        router.prefetch('/');
      }
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
      onSubmit={handleSubmit(handleSignIn)}
      className="mx-auto flex w-full max-w-lg flex-col space-y-5 p-5 md:p-10"
    >
      <div>
        <h1 className="text-3xl font-semibold leading-relaxed">Fazer login</h1>

        <span>
          Não têm uma conta?{' '}
          <Link
            href="/register"
            onClick={() => router.push('/signup')}
            className="font-bold text-blue-500 underline hover:text-blue-600"
          >
            Crie uma!
          </Link>
        </span>
      </div>

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

      <Button title="Entrar" isLoading={isLoading} />
    </form>
  );
};
