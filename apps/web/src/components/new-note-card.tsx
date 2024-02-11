'use client';
import { saveNote } from '@/actions/notes';
import * as Dialog from '@radix-ui/react-dialog';
import { Mic, MicOff } from 'lucide-react';
import { MouseEvent, useState } from 'react';
import { toast } from 'sonner';
import { Separator } from './separator';

export const NewNoteCard = () => {
  const [isRecording, setIsRecording] = useState(false);
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
    } else {
      setOpen(true);
    }
  };

  const handleSaveNote = async (formData: FormData) => {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    if (!content) return;

    try {
      await saveNote(content, title);
      setOpen(false);

      toast.success('Nota criada com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar nota!');
    }
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
            {/* <Dialog.Close
              className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100  rounded-bl-md"
              onClick={handleOpenChanged}
            >
              <X className="h-5 w-5" />
            </Dialog.Close> */}

            <form action={handleSaveNote} className="flex flex-1 flex-col">
              <div className="flex flex-1 flex-col gap-4 p-5">
                {/* <div>
                  {editor ? (
                    <button onClick={handleHideEditor}>
                      <ArrowLeft />
                    </button>
                  ) : (
                    <></>
                  )}
                </div> */}
                <input
                  placeholder="Título"
                  name="title"
                  className="font-medium text-slate-200 tracking-wide outline-none bg-transparent w-full"
                />

                <Separator />

                <textarea
                  className="text-sm leading-6 text-slate-200 resize-none w-full flex-1 bg-transparent outline-none"
                  name="content"
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
                        className="font-medium text-red-400 p-2 hover:bg-slate-600 rounded-full"
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
                        className="font-medium text-lime-400 p-2 hover:bg-slate-600 rounded-full"
                      >
                        <Mic />
                      </button>
                    </>
                  )}
                </div>

                {/* <div className="flex h-full">
                  {!editor ? (
                    <p className="text-sm leading-6 text-slate-400">
                      Comece{' '}
                      <button
                        onClick={handleStartEditor}
                        type="button"
                        className="font-medium text-lime-400 hover:underline"
                      >
                        escrevendo um texto
                      </button>{' '}
                      ou{' '}
                      <button
                        onClick={handleStartRecording}
                        type="button"
                        className="font-medium text-lime-400 hover:underline"
                      >
                        gravando uma nota
                      </button>{' '}
                      em áudio.
                    </p>
                  ) : (
                    <textarea
                      className="text-sm leading-6 text-slate-300 resize-none w-full flex-1 bg-slate-800 p-3 rounded-md outline-none"
                      name="content"
                      autoFocus
                    />
                  )}
                </div> */}
              </div>

              <div className="flex">
                <button
                  type="button"
                  onClick={handleChangeOverlay}
                  className="text-center flex-grow outline-none text-sm font-medium bg-slate-800 text-slate-300 py-4 transition-colors hover:bg-slate-900"
                >
                  Fechar
                </button>

                <button
                  type="submit"
                  className="text-center flex-grow outline-none text-sm font-medium bg-lime-400 text-lime-950 py-4 transition-colors hover:bg-lime-500"
                >
                  Salvar nota
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
