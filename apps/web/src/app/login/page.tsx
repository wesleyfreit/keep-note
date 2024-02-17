'use client';
import { Input } from '@/components/input';
import { WelcomeSection } from '@/components/welcome-section';
import { ISignIn, signInSchema } from '@/validation/signin-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignIn>({
    resolver: zodResolver(signInSchema),
  });

  const router = useRouter();

  const handleSignUp = async (data: ISignIn) => {
    console.log(data);
  };

  return (
    <div className="flex h-screen">
      <WelcomeSection />

      <div className="flex w-full flex-col md:w-2/3 md:flex-row md:items-center md:border-l-2 md:border-slate-800">
        <div className="my-7 flex flex-col items-center justify-center md:hidden">
          <Image src="/sticky-note.png" alt="KeepNote" width={150} height={150} />
          <h1 className="text-3xl font-bold">KeepNote</h1>
        </div>

        <form
          onSubmit={handleSubmit(handleSignUp)}
          className="mx-auto flex w-full max-w-lg flex-col space-y-5 p-5 md:p-10"
        >
          <div>
            <h1 className="text-3xl font-semibold leading-relaxed">Fazer login</h1>

            <span>
              Não têm uma conta?{' '}
              <Link
                href="/signup"
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

          <button
            className="rounded-full bg-blue-800 py-3 text-sm font-medium text-slate-300 outline-none transition-colors hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
            type="submit"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
