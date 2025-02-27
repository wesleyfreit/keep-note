import { hasAuthToken } from '@/actions/auth';
import { getAllNotes } from '@/actions/notes';
import { NewNoteCard } from '@/app/(home)/new-note-card';
import { Header } from '@/components/header';
import { redirect } from 'next/navigation';
import { ListNotes } from './list-notes';

interface HomeProps {
  searchParams: Promise<{ search?: string; page: string }>;
}

export default async function Home(props: HomeProps) {
  const authToken = await hasAuthToken();

  if (!authToken) {
    redirect('/login');
  }

  const notes = await getAllNotes();

  if (!notes) {
    redirect('/login');
  }

  const { search } = await props.searchParams;

  const filteredNotes = search
    ? notes.filter(
        (note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
          note.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
      )
    : notes;

  return (
    <>
      <Header />

      <main className="mx-auto my-2 max-w-6xl space-y-6 p-5">
        <div className="flex justify-center">
          <NewNoteCard />
        </div>

        <div className="h-px bg-slate-600" />

        <ListNotes filteredNotes={filteredNotes} search={search || ''} />
      </main>
    </>
  );
}
