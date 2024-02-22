import { hasAuthToken } from '@/actions/auth';
import { verifyEmail } from '@/actions/users';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface VerifyEmailProps {
  searchParams?: { code: string };
}

export default async function VerifyEmail({ searchParams }: VerifyEmailProps) {
  const authToken = await hasAuthToken();

  if (authToken) {
    redirect('/');
  }

  const code = searchParams?.code || '';

  if (!code) {
    redirect('/login');
  }

  const response = await verifyEmail(code);

  return (
    <div className="mt-10 flex h-screen flex-col items-center space-y-5">
      <h1 className="text-lg font-bold">{response.message}</h1>

      <Link
        href="/login"
        className="rounded-full bg-blue-800 px-5 py-3 text-sm font-medium text-slate-50 outline-none transition-colors hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        Voltar para fazer login
      </Link>
    </div>
  );
}
