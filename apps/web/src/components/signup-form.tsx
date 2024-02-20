'use client';
import { signUp } from '@/actions/users';
import { Input } from '@/components/input';
import { ISignUp, signUpSchema } from '@/validation/signup-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from './button';

export const SignUpForm = () => {
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
        register={register}
        errors={errors}
        name="name"
        label="Nome"
        placeholder="Insira seu nome"
      />

      <Input
        register={register}
        errors={errors}
        name="email"
        label="Email"
        placeholder="Insira um email"
        type="email"
      />

      <Input
        register={register}
        errors={errors}
        name="password"
        label="Senha"
        placeholder="Insira uma senha"
        type="password"
      />

      <Input
        register={register}
        errors={errors}
        name="confirm_password"
        label="Confirmar senha"
        placeholder="Confirme a senha inserida"
        type="password"
      />

      <Button title="Começar" isLoading={isLoading} />
    </form>
  );
};
