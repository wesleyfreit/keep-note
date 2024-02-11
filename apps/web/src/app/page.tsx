import { getAllNotes } from '@/actions/notes';
import { Header } from '@/components/header';
import { NewNoteCard } from '@/components/new-note-card';
import { NoteCard } from '@/components/note-card';
import { Separator } from '@/components/separator';

interface HomeProps {
  searchParams?: { search: string; page: string };
}

export default async function Home({ searchParams }: HomeProps) {
  const notes = await getAllNotes();

  const search = searchParams?.search || '';

  const filteredNotes =
    search !== ''
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
        )
      : notes;

  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl my-12 space-y-6 p-5">
        <div className="flex justify-center">
          <NewNoteCard />
        </div>

        <Separator />

        <div className="grid grid-cols-3 gap-6 auto-rows-[258px]">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      </main>
    </>
  );
}
