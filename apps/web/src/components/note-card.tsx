'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';

import { NoteDTO } from '@/dtos/NoteDTO';
import { ModifyNoteCard } from './modify-note-card';

interface NoteCardProps {
  note: NoteDTO;
  search: string | undefined;
}

export const NoteCard = ({ note, search }: NoteCardProps) => {
  const [open, setOpen] = useState(false);
  const [checkCache, setCheckCache] = useState(false);

  const handleChangeOverlay = () => {
    if (open) {
      setCheckCache(true);
    }
    setOpen(!open);
  };

  const titleParts = note.title.split(new RegExp(`(${search})`, 'gi'));
  const contentParts = note.content.split(new RegExp(`(${search})`, 'gi'));

  return (
    <Dialog.Root open={open} onOpenChange={handleChangeOverlay}>
      <Dialog.Trigger className="rounded-md flex-shrink max-h-[258px] max-w-[22rem] bg-slate-800 bg-opacity-50 justify-between text-left flex flex-col items-start space-y-2 hover:ring-2 outline-none hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-blue-500 shadow-sm shadow-slate-950">
        <div className="overflow-hidden space-y-3 p-5">
          {!search ? (
            <>
              <h1 className="font-medium tracking-wide">{note.title}</h1>
              <p className="text-sm leading-6 text-slate-400 whitespace-pre-wrap">
                {note.content}
              </p>
            </>
          ) : (
            <>
              <h1 className="font-medium tracking-wide">
                {titleParts.map((part, i) =>
                  part.toLowerCase() === search.toLowerCase() ? (
                    <span key={i} className="bg-yellow-600">
                      {part}
                    </span>
                  ) : (
                    <span key={i}>{part}</span>
                  ),
                )}
              </h1>

              <p className="text-sm leading-6 text-slate-400">
                {contentParts.map((part, i) =>
                  part.toLowerCase() === search.toLowerCase() ? (
                    <span key={i} className="bg-yellow-600">
                      {part}
                    </span>
                  ) : (
                    <span key={i}>{part}</span>
                  ),
                )}
              </p>
            </>
          )}
        </div>

        <span className="text-xs font-medium text-slate-400 ml-auto pr-2 pb-1">
          {formatDistanceToNow(note.updatedAt, { locale: ptBR, addSuffix: true })}
        </span>
      </Dialog.Trigger>

      <ModifyNoteCard
        note={note}
        checkCache={checkCache}
        setCheckCache={setCheckCache}
        setOpen={setOpen}
      />
    </Dialog.Root>
  );
};
