import { Header } from '@/components/header';
import { NewNoteCard } from '@/components/new-note-card';
import { NoteCard } from '@/components/note-card';
import { Separator } from '@/components/separator';
import { NoteDTO } from '@/dtos/NoteDTO';
import { appApi } from '@/services/axios';

export default async function Home() {
  const response = await appApi.get<{ notes: NoteDTO[] }>('/api/notes');

  const { notes } = response.data;

  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl my-12 space-y-6">
        <form className="w-full">
          <input
            type="text"
            placeholder="Busque em suas notas..."
            className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
          />
        </form>

        <Separator />

        <div className="grid grid-cols-3 gap-6 auto-rows-[258px]">
          <NewNoteCard />

          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      </main>
    </>
  );
}
