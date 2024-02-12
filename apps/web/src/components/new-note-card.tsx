'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { Mic, MicOff } from 'lucide-react';
import { ChangeEvent, MouseEvent, useState } from 'react';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';

import { modifyNote, saveNote } from '@/actions/notes';
import { Separator } from './separator';

export const NewNoteCard = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [noteId, setNoteId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsRecording(false);
  };

  const handleChangeOverlay = () => {
    if (open) {
      setOpen(false);
      setIsRecording(false);
      setNoteId(null);
    } else {
      setOpen(true);
    }
  };

  const handleChangeNote = useDebouncedCallback(
    async (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, name: string) => {
      const value = event.target.value;

      try {
        if (!noteId) {
          const id = await saveNote(value, name);
          setNoteId(id);
        } else {
          await modifyNote(value, name, noteId);
        }
      } catch (error) {
        toast.error('Erro ao salvar a nota!');
      }
    },
    500,
  );

  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    event.persist();
    handleChangeNote(event, 'title');
  };

  const handleChangeContent = (event: ChangeEvent<HTMLTextAreaElement>) => {
    event.persist();
    handleChangeNote(event, 'content');
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleChangeOverlay}>
      <Dialog.Trigger className="rounded-md bg-slate-700 text-left w-1/2 hover:ring-2 outline-none hover:ring-slate-500 focus-visible:ring-2 focus-visible:ring-lime-400">
        <input
          type="text"
          tabIndex={-1}
          placeholder="Adicionar nova nota..."
          className="text-sm font-medium text-slate-200 py-3 px-5 tracking-wide outline-none bg-transparent w-full placeholder:text-slate-200"
        />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Dialog.Content className="bg-slate-700 relative overflow-hidden rounded-md flex flex-col w-full h-full max-w-[640px] max-h-[60vh] outline-none overflow-y-auto">
            <div className="flex flex-1 flex-col gap-4 p-5">
              <input
                placeholder="Título"
                name="title"
                onChange={handleChangeTitle}
                className="font-medium text-slate-200 tracking-wide outline-none bg-transparent w-full"
              />

              <Separator />

              <textarea
                className="text-sm leading-6 text-slate-200 resize-none w-full flex-1 bg-transparent outline-none"
                name="content"
                onChange={handleChangeContent}
                placeholder="Escreva um texto ou grave uma nota em áudio..."
                autoFocus
              />

              <div className="flex items-center ml-auto gap-1">
                {isRecording ? (
                  <>
                    <span className="text-sm text-slate-400 font-medium flex justify-center items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                      Gravando! (clique p/ interromper)
                    </span>

                    <button
                      onClick={handleStopRecording}
                      type="button"
                      className="font-medium text-red-400 p-2 hover:bg-slate-600 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                    >
                      <MicOff />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-slate-400 font-medium">
                      Gravar áudio! (clique p/ gravar)
                    </span>

                    <button
                      onClick={handleStartRecording}
                      type="button"
                      className="font-medium text-lime-400 p-2 hover:bg-slate-600 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                    >
                      <Mic />
                    </button>
                  </>
                )}
              </div>
            </div>

            <Dialog.Close
              className="outline-none text-sm font-medium bg-slate-800 text-slate-300 py-4 transition-colors hover:bg-slate-900 focus-visible:ring-2 focus-visible:ring-slate-500 rounded-md"
              onClick={handleChangeOverlay}
            >
              Fechar
            </Dialog.Close>
            {/* <button
                type="button"
                onClick={handleChangeOverlay}
                className="text-center flex-grow outline-none text-sm font-medium bg-slate-800 text-slate-300 py-4 transition-colors hover:bg-slate-900"
              ></button> */}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
