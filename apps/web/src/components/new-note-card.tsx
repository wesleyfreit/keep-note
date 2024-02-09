'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export const NewNoteCard = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md bg-slate-700 text-left p-5 space-y-4 flex flex-col hover:ring-2 outline-none hover:ring-slate-500 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-200">Adicionar nota</span>

        <p className="text-sm leading-6 text-slate-400">
          Escreva algo ou grave um áudio para ser convertido em texto
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Dialog.Content className="bg-slate-700 relative overflow-hidden rounded-md flex flex-col w-full h-full max-w-[640px] max-h-[60vh] outline-none overflow-y-auto">
            <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100  rounded-bl-md">
              <X className="size-5" />
            </Dialog.Close>

            <div className="flex flex-1 flex-col gap-5 p-5">
              <span className="text-sm font-medium text-slate-300">Adicionar nota</span>

              <div className="overflow-y-auto max-h-[45vh]">
                <p className="text-sm leading-6 text-slate-400">
                  Comece{' '}
                  <button className="font-medium text-lime-400 hover:underline">
                    escrevendo um texto
                  </button>{' '}
                  ou{' '}
                  <button className="font-medium text-lime-400 hover:underline">
                    gravando uma nota
                  </button>{' '}
                  em áudio.
                </p>
              </div>
            </div>

            <button className="text-center outline-none text-sm font-medium bg-lime-400 text-lime-950 py-4 transition-colors hover:bg-lime-500">
              Salvar nota
            </button>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
