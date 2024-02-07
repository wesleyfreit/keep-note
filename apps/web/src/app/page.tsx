import { Header } from '@/components/header';
import { NewNoteCard } from '@/components/new-note-card';
import { NoteCard } from '@/components/note-card';
import { Separator } from '@/components/separator';

export default function Home() {
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

          <NoteCard />
          <NoteCard />
          <NoteCard />
          <NoteCard />
          <NoteCard />
        </div>
      </main>
    </>
  );
}
