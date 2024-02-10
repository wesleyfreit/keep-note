'use client';
import { saveNote } from '@/actions/notes';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import { toast } from 'sonner';

export const NewNoteCard = () => {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
  const [open, setOpen] = useState(false);

  const handleStartEditor = () => {
    setShouldShowOnboarding(false);
  };

  const handleCloseEditor = () => {
    setShouldShowOnboarding(true);
  };

  const handleContentChanged = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value === '') setShouldShowOnboarding(true);
  };

  const handleSaveNote = async (formData: FormData) => {
    try {
      await saveNote(formData);
      setOpen(false);

      toast.success('Nota criada com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar nota!');
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="rounded-md bg-slate-700 text-left p-5 space-y-4 flex flex-col hover:ring-2 outline-none hover:ring-slate-500 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-200">Adicionar nota</span>

        <p className="text-sm leading-6 text-slate-400">
          Escreva algo ou grave um áudio para ser convertido em texto
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Dialog.Content className="bg-slate-700 relative overflow-hidden rounded-md flex flex-col w-full h-full max-w-[640px] max-h-[60vh] outline-none overflow-y-auto">
            <Dialog.Close
              className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100  rounded-bl-md"
              onClick={handleCloseEditor}
            >
              <X className="size-5" />
            </Dialog.Close>

            <form action={handleSaveNote} className="flex flex-1 flex-col">
              <div className="flex flex-1 flex-col gap-5 p-5">
                <span className="text-sm font-medium text-slate-300">Adicionar nota</span>

                <div className="flex h-full">
                  {shouldShowOnboarding ? (
                    <p className="text-sm leading-6 text-slate-400">
                      Comece{' '}
                      <button
                        onClick={handleStartEditor}
                        className="font-medium text-lime-400 hover:underline"
                      >
                        escrevendo um texto
                      </button>{' '}
                      ou{' '}
                      <button className="font-medium text-lime-400 hover:underline">
                        gravando uma nota
                      </button>{' '}
                      em áudio.
                    </p>
                  ) : (
                    <textarea
                      className="text-sm leading-6 text-slate-300 resize-none w-full flex-1 bg-slate-800 p-3 rounded-md outline-none"
                      onChange={handleContentChanged}
                      name="content"
                      autoFocus
                    />
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="text-center outline-none text-sm font-medium bg-lime-400 text-lime-950 py-4 transition-colors hover:bg-lime-500"
              >
                Salvar nota
              </button>
            </form>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
