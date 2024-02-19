import { hasAuthToken } from '@/actions/auth';
import { getAllNotes } from '@/actions/notes';
import { Header } from '@/components/header';
import { ListNotes } from '@/components/list-notes';
import { NewNoteCard } from '@/components/new-note-card';
import { Separator } from '@/components/separator';
import { redirect } from 'next/navigation';

interface HomeProps {
  searchParams?: { search: string; page: string };
}

export default async function Home({ searchParams }: HomeProps) {
  const authToken = await hasAuthToken();

  if (!authToken) {
    redirect('/login');
  }

  const notes = await getAllNotes();

  if (!notes) {
    redirect('/login');
  }

  const search = searchParams?.search || '';

  const filteredNotes =
    search != ''
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

        <Separator />

        <ListNotes filteredNotes={filteredNotes} search={search} />
      </main>
    </>
  );
}
