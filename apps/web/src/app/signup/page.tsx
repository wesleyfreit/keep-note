import { hasAuthToken } from '@/actions/auth';
import { SignUpForm } from '@/components/signup-form';
import { WelcomeSection } from '@/components/welcome-section';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default async function Signup() {
  const authToken = await hasAuthToken();

  if (authToken) {
    redirect('/');
  }

  return (
    <div className="flex h-screen">
      <WelcomeSection />

      <div className="flex w-full flex-col md:w-2/3 md:flex-row md:items-center md:border-l-2 md:border-slate-800">
        <div className="my-7 flex flex-col items-center justify-center md:hidden">
          <Image src="/sticky-note.png" alt="KeepNote" width={150} height={150} />
          <h1 className="text-3xl font-bold">KeepNote</h1>
        </div>

        <SignUpForm />
      </div>
    </div>
  );
}
