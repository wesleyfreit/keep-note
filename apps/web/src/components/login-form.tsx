'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { signIn } from '@/actions/users';
import { Input } from '@/components/input';
import { useAuth } from '@/hooks/use-auth';
import { ISignIn, signInSchema } from '@/validation/signin-schema';
import { Button } from './button';

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
        register={register}
        errors={errors}
        name="email"
        label="Email"
        placeholder="Insira seu email"
        type="email"
      />

      <Input
        register={register}
        errors={errors}
        name="password"
        label="Senha"
        placeholder="Insira sua senha"
        type="password"
      />

      <Button title="Entrar" isLoading={isLoading} />
    </form>
  );
};
