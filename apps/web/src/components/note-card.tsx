'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { format, formatDistanceToNow, isThisYear, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { revalidate } from '@/actions/app';
import { deleteNote, getNote, modifyNote } from '@/actions/notes';
import { NoteDTO } from '@/dtos/NoteDTO';
import { Mic, MicOff, Trash } from 'lucide-react';
import { ChangeEvent, MouseEvent, useState } from 'react';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import { Separator } from './separator';
import { Spinner } from './spinner';

interface NoteCardProps {
  note: NoteDTO;
  search: string | undefined;
}

export const NoteCard = ({ note, search }: NoteCardProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const titleParts = note.title.split(new RegExp(`(${search})`, 'gi'));
  const contentParts = note.content.split(new RegExp(`(${search})`, 'gi'));

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsRecording(false);
  };

  const handleChangeOverlay = async () => {
    if (open) {
      setOpen(false);
      setIsRecording(false);
      setIsLoading(true);

      setTitle('');
      setContent('');

      toast.success('Nota alterada com sucesso!');

      revalidate('/');
    } else {
      setOpen(true);
      const noteFinded = await getNote(note.id);
      setIsLoading(false);

      setTitle(noteFinded.title);
      setContent(noteFinded.content);
    }
  };

  const handleChangeNote = useDebouncedCallback(async (value: string, name: string) => {
    try {
      await modifyNote(value, name, note.id);
    } catch (error) {
      toast.error('Erro ao salvar a nota!');
    }
  }, 500);

  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTitle(value);
    handleChangeNote(value, 'title');
  };

  const handleChangeContent = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setContent(value);
    handleChangeNote(value, 'content');
  };

  const handleDeleteNote = async () => {
    try {
      await deleteNote(note.id);
      revalidate('/');

      toast.success('Nota apagada com sucesso!');
    } catch (error) {
      toast.error('Erro ao apagar a nota!');
    }
  };

  const formatDate = (date: Date) => {
    if (isToday(date)) {
      return `Editada ${format(date, 'HH:mm', { locale: ptBR })}`;
    } else if (isYesterday(date)) {
      return `Editada ontem, ${format(date, 'HH:mm', { locale: ptBR })}`;
    } else if (isThisYear(date)) {
      return `Editada ${format(date, "d 'de' MMM.", { locale: ptBR })}`;
    } else {
      return `Editada ${format(date, "d 'de' MMM. 'de' y", { locale: ptBR })}`;
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleChangeOverlay}>
      <Dialog.Trigger className="rounded-md flex-shrink max-h-[258px] max-w-[22rem] bg-slate-800 bg-opacity-50 justify-between text-left flex flex-col items-start space-y-2 hover:ring-2 outline-none hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-blue-500">
        <div className="overflow-hidden space-y-3 p-5">
          {!search ? (
            <>
              <h1 className="font-medium tracking-wide">{note.title}</h1>
              <p className="text-sm leading-6 text-slate-400">{note.content}</p>
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

        <span className="text-xs font-medium text-slate-300 ml-auto pr-2 pb-1">
          {formatDistanceToNow(note.updatedAt, { locale: ptBR, addSuffix: true })}
        </span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Dialog.Content className="bg-slate-700 relative overflow-hidden rounded-md flex flex-col w-full h-full max-w-[640px] max-h-[60vh] outline-none overflow-y-auto">
            {!isLoading ? (
              <>
                <div className="flex flex-1 flex-col gap-5 p-5">
                  <input
                    placeholder="Título"
                    name="title"
                    value={title}
                    onChange={handleChangeTitle}
                    className="font-medium text-slate-200 tracking-wide outline-none bg-transparent w-full"
                  />
                  <Separator />
                  <textarea
                    className="text-sm leading-6 text-slate-200 resize-none w-full flex-1 bg-transparent outline-none"
                    name="content"
                    value={content}
                    onChange={handleChangeContent}
                    placeholder="Escreva um texto ou grave uma nota em áudio..."
                  />
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-slate-400 text-sm font-medium">
                      {formatDate(note.updatedAt)}
                    </span>
                    <div className="flex gap-2">
                      {isRecording ? (
                        <>
                          <span className="text-sm text-slate-400 font-medium flex justify-center items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                            Gravando! (clique p/ parar)
                          </span>

                          <button
                            onClick={handleStopRecording}
                            type="button"
                            title="Parar gravação do áudio"
                            className="font-medium text-red-500 p-2 hover:bg-slate-600 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                          >
                            <MicOff />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={handleStartRecording}
                            type="button"
                            title="Gravar áudio"
                            className="font-medium text-green-500 p-2 hover:bg-slate-600 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                          >
                            <Mic />
                          </button>
                        </>
                      )}
                      <button
                        onClick={handleDeleteNote}
                        className="font-medium text-red-500 p-2 hover:bg-slate-600 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                      >
                        <Trash />
                      </button>
                    </div>
                  </div>
                </div>
                <Dialog.Close
                  className="outline-none text-sm font-medium bg-slate-800 text-slate-300 py-4 transition-colors hover:bg-slate-900 focus-visible:ring-2 focus-visible:ring-slate-500 rounded-md"
                  onClick={handleChangeOverlay}
                >
                  Fechar
                </Dialog.Close>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Spinner />
              </div>
            )}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
