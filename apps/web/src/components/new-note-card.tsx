'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { saveNote } from '@/actions/notes';
import { NoteDTO } from '@/dtos/NoteDTO';
import { ModifyNoteCard } from './modify-note-card';

export const NewNoteCard = () => {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState<NoteDTO | null>(null);
  const [checkCache, setCheckCache] = useState(false);

  useEffect(() => {
    if (!open) {
      setNote(null);
    }
  }, [open]);

  const handleCreateNote = async (value: string) => {
    const noteCreated = await saveNote(value, 'content');
    setNote(noteCreated);

    setOpen(true);
  };

  const handleStartEditing = useDebouncedCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      console.log(value);

      handleCreateNote(value);

      event.target.value = '';
    },
    750,
  );

  const handleChangeOverlay = () => {
    if (open) {
      setCheckCache(true);
    }
    setOpen(!open);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleChangeOverlay}>
      <input
        type="text"
        placeholder="Criar nova nota"
        title="Digite ou clique para criar uma nova nota"
        name="new-note"
        className="text-sm font-medium rounded-lg bg-slate-700 w-1/2 hover:ring-2 outline-none hover:ring-slate-500 focus-visible:ring-1 shadow-sm shadow-black focus-visible:ring-slate-500 text-slate-200 p-3 tracking-wide placeholder:text-slate-300"
        autoFocus
        onClick={() => handleCreateNote('')}
        onChange={handleStartEditing}
      />

      {note && (
        <ModifyNoteCard
          note={note}
          checkCache={checkCache}
          setCheckCache={setCheckCache}
          setOpen={setOpen}
        />
      )}
    </Dialog.Root>
  );
};
