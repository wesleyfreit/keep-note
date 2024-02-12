import { getAllNotes } from '@/actions/notes';
import { EmptyNotes } from '@/components/empty-notes';
import { Header } from '@/components/header';
import { NewNoteCard } from '@/components/new-note-card';
import { ListNotes } from '@/components/list-notes';
import { Separator } from '@/components/separator';

interface HomeProps {
  searchParams?: { search: string; page: string };
}

export default async function Home({ searchParams }: HomeProps) {
  const notes = await getAllNotes();

  const search = searchParams?.search || '';

  const filteredNotes =
    search !== ''
      ? notes.filter(
          (note) =>
            note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
            note.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
        )
      : notes;

  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl my-12 space-y-6 p-5">
        <div className="flex justify-center">
          <NewNoteCard />
        </div>

        {filteredNotes.length > 0 ? (
          <>
            <Separator />

            <ListNotes filteredNotes={filteredNotes} search={search} />
          </>
        ) : (
          <EmptyNotes searchResult={search != '' ? true : false} />
        )}
      </main>
    </>
  );
}
