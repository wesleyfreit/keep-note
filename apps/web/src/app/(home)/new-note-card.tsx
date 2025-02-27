'use client';

import { revalidate } from '@/actions/app';
import { saveNote } from '@/actions/notes';
import type { INote } from '@/dtos/note';
import * as Dialog from '@radix-ui/react-dialog';
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { ModifyNoteCard } from './modify-note-card';

export const NewNoteCard = () => {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState<INote | null>(null);
  const [checkCache, setCheckCache] = useState(false);

  useEffect(() => {
    if (!checkCache) {
      setNote(null);
    }
  }, [checkCache]);

  const handleCreateNote = async (value: string) => {
    const noteCreated = await saveNote(value, 'content');
    setNote(noteCreated);

    setOpen(true);
  };

  const handleStartEditing = useDebouncedCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleCreateNote(event.target.value);

      event.target.value = '';
    },
    750,
  );

  const handleChangeOverlay = () => {
    if (open) {
      setCheckCache(true);
    }

    revalidate('/');
    setOpen(!open);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleChangeOverlay}>
      <input
        type="text"
        placeholder="Criar nova nota..."
        autoComplete="off"
        title="Digite para criar uma nota"
        name="new-note"
        className="w-1/2 rounded-lg bg-slate-700 p-3 text-sm font-medium tracking-wide text-slate-200 shadow-sm shadow-black outline-none placeholder:text-slate-300 hover:ring-2 hover:ring-slate-500 focus-visible:ring-1 focus-visible:ring-slate-500"
        autoFocus
        onChange={handleStartEditing}
      />

      {note && (
        <ModifyNoteCard
          note={note}
          open={open}
          checkCache={checkCache}
          setCheckCache={setCheckCache}
        />
      )}
    </Dialog.Root>
  );
};
