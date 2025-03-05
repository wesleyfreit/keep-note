import { hasAuthToken } from '@/actions/auth';
import { NewNoteCard } from '@/app/(home)/new-note-card';
import { Header } from '@/components/header';
import { redirect } from 'next/navigation';
import { ListNotes } from './list-notes';

interface HomeProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function Home(props: HomeProps) {
  const authToken = await hasAuthToken();

  if (!authToken) {
    redirect('/login');
  }

  const { search } = await props.searchParams;

  return (
    <>
      <Header />

      <main className="mx-auto my-2 max-w-6xl space-y-6 p-5">
        <div className="flex justify-center">
          <NewNoteCard />
        </div>

        <div className="h-px bg-slate-600" />

        <ListNotes search={search || ''} />
      </main>
    </>
  );
}
