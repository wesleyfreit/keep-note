'use client';

import { revalidate } from '@/actions/app';
import type { INote } from '@/dtos/note';
import * as Dialog from '@radix-ui/react-dialog';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ModifyNoteCard } from './modify-note-card';

interface NoteCardProps {
  note: INote;
  search: string | undefined;
}

export const NoteCard = ({ note, search }: NoteCardProps) => {
  const [open, setOpen] = useState(false);
  const [checkCache, setCheckCache] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const noteId = searchParams.get('id');
    if (noteId === note.id) {
      setOpen(true);
    }
  }, [note, searchParams]);

  const handleChangeOverlay = () => {
    if (open) {
      setCheckCache(true);
    }

    if (note) {
      const params = new URLSearchParams(searchParams);

      if (!open) {
        params.set('id', note.id);
      } else params.delete('id');

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }

    revalidate('/');
    setOpen(!open);
  };

  const titleParts = note.title.split(new RegExp(`(${search})`, 'gi'));
  const contentParts = note.content.split(new RegExp(`(${search})`, 'gi'));

  return (
    <Dialog.Root open={open} onOpenChange={handleChangeOverlay}>
      <Dialog.Trigger className="flex max-h-[258px] max-w-[22rem] shrink animate-[note-view_200ms] flex-col items-start justify-between space-y-2 rounded-md bg-slate-800 bg-opacity-[50%] text-left shadow-sm shadow-slate-950 outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-blue-500">
        <div className="space-y-3 overflow-hidden p-5">
          {!search ? (
            <>
              <h1 className="font-medium tracking-wide">{note.title}</h1>
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-400">
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

              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-400">
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

        <span
          className="ml-auto pb-1 pr-2 text-xs font-medium text-slate-400"
          suppressHydrationWarning={true}
        >
          {formatDistanceToNow(note.updatedAt, { locale: ptBR, addSuffix: true })}
        </span>
      </Dialog.Trigger>

      <ModifyNoteCard
        note={note}
        open={open}
        checkCache={checkCache}
        setCheckCache={setCheckCache}
      />
    </Dialog.Root>
  );
};
