'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X } from 'lucide-react';

interface NoteCardProps {
  note: { date: Date; content: string };
}

export const NoteCard = ({ note }: NoteCardProps) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md bg-slate-800 text-left p-5 space-y-4 overflow-hidden relative hover:ring-2 outline-none hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-300">
          {formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}
        </span>

        <p className="text-sm leading-6 text-slate-400">{note.content}</p>

        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Dialog.Content className="bg-slate-700 relative overflow-hidden rounded-md flex flex-col w-full h-full max-w-[640px] max-h-[60vh] outline-none overflow-y-auto">
            <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100  rounded-bl-md">
              <X className="size-5" />
            </Dialog.Close>

            <div className="flex flex-1 flex-col gap-5 p-5">
              <span className="text-sm font-medium text-slate-300">
                {formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}
              </span>

              <div className="overflow-y-auto max-h-[45vh]">
                <p className="text-sm leading-6 text-slate-400">{note.content}</p>
              </div>
            </div>

            <button className="text-center outline-none text-sm font-medium bg-slate-800 text-slate-300 py-4 transition-colors group">
              Deseja{' '}
              <span className="text-red-400 group-hover:underline">apagar esta nota</span>
              ?
            </button>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
