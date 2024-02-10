'use client';
import { getAllNotes } from '@/actions/notes';
import { Header } from '@/components/header';
import { NewNoteCard } from '@/components/new-note-card';
import { NoteCard } from '@/components/note-card';
import { Separator } from '@/components/separator';
import { NoteDTO } from '@/dtos/NoteDTO';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const [notes, setNotes] = useState<NoteDTO[]>([] as NoteDTO[]);
  const [search, setSearch] = useState('');

  const fetchNotes = async () => {
    try {
      const notes = await getAllNotes();
      setNotes(notes);
    } catch (error) {
      toast.error('Erro ao buscar notas!');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes =
    search !== ''
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
        )
      : notes;

  return (
    <>
      <Header setSearch={setSearch} />

      <main className="mx-auto max-w-6xl my-12 space-y-6">
        <Separator />

        <div className="grid grid-cols-3 gap-6 auto-rows-[258px]">
          <NewNoteCard />

          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      </main>
    </>
  );
}
