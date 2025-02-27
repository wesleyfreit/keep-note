'use client';

import { revalidate } from '@/actions/app';
import { deleteNote, getNote, modifyNote } from '@/actions/notes';
import type { INote } from '@/dtos/note';
import * as Dialog from '@radix-ui/react-dialog';
import { format, isThisYear, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Mic, MicOff, Trash } from 'lucide-react';
import type { ChangeEvent, FocusEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';

let speechRecognition: SpeechRecognition | null = null;

interface ModifyNoteCardProps {
  note: INote;
  open: boolean;
  checkCache: boolean;
  setCheckCache: (value: boolean) => void;
}

export const ModifyNoteCard = ({
  note,
  open,
  checkCache,
  setCheckCache,
}: ModifyNoteCardProps) => {
  const [id] = useState(note.id);
  const [content, setContent] = useState(note.content);
  const [title, setTitle] = useState(note.title);
  const [updatedAt, setUpdatedAt] = useState(note.updatedAt);

  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');

  const autoRecoverUnsavedNote = useCallback(async () => {
    if (speechRecognition) {
      speechRecognition.stop();
      setIsRecording(false);
    }

    let shouldRevalidate = false;

    try {
      if (transcription !== '') {
        await modifyNote(content + transcription, 'content', id);

        setTranscription('');
        toast.success('Conteúdo da gravação salvo!');
        shouldRevalidate = true;
      } else {
        if (content !== '' || title !== '') {
          if (content !== note.content || title !== note.title) {
            const note = await getNote(id);

            if (title !== note.title) {
              await modifyNote(title, 'title', id);

              toast.success('Título da nota salvo!');
              shouldRevalidate = true;
            }

            if (content !== note.content) {
              await modifyNote(content, 'content', id);

              toast.success('Conteúdo da nota salvo!');
              shouldRevalidate = true;
            }
          }
        } else {
          await deleteNote(id);

          toast.info('Nota vazia descartada!');
          shouldRevalidate = true;
        }
      }

      if (shouldRevalidate) revalidate('/');

      setCheckCache(false);
    } catch {
      toast.error('Erro ao salvar dados não registrados da nota!');
    }
  }, [transcription, content, note.content, note.title, title, setCheckCache, id]);

  useEffect(() => {
    if (checkCache) {
      autoRecoverUnsavedNote();
    }
  }, [checkCache, autoRecoverUnsavedNote]);

  const handleStartRecording = () => {
    const isSpeechRecognitionAvailable =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

    if (!isSpeechRecognitionAvailable) {
      alert('Seu navegador não suporta a gravação de áudio nativa!');
      return;
    }

    setIsRecording(true);

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeechRecognitionAPI();

    speechRecognition.lang = 'pt-BR';
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    let recognition = '';

    speechRecognition.onresult = (event) => {
      recognition = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0]?.transcript || '');
      }, '');

      setTranscription(recognition);
    };

    speechRecognition.onend = () => {
      setTranscription('');
      setContent((prevContent) => prevContent + recognition);
      handleChangeNote(content + recognition, 'content');
    };

    speechRecognition.onerror = () => {
      toast.error('Erro ao gravar áudio!');
    };

    speechRecognition.start();
  };

  const handleStopRecording = () => {
    if (speechRecognition) {
      speechRecognition.stop();
    }
    setIsRecording(false);
  };

  const handleChangeNote = useDebouncedCallback(async (value: string, name: string) => {
    if (open) {
      try {
        const updatedAt = await modifyNote(value, name, note.id);
        setUpdatedAt(updatedAt);
      } catch {
        toast.error('Erro ao salvar nota!');
      }
    }
  }, 750);

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
      toast.warning('Nota foi apagada!');
    } catch {
      toast.error('Erro ao apagar nota!');
    }
  };

  const formatDate = (date: Date, createdAt?: boolean) => {
    if (createdAt) {
      return `Criada às ${format(date, "d 'de' MMM. 'de' y", { locale: ptBR })}`;
    } else if (isToday(date)) {
      return `Editada ${format(date, 'HH:mm', { locale: ptBR })}`;
    } else if (isYesterday(date)) {
      return `Editada ontem, ${format(date, 'HH:mm', { locale: ptBR })}`;
    } else if (isThisYear(date)) {
      return `Editada ${format(date, "d 'de' MMM.", { locale: ptBR })}`;
    } else {
      return `Editada ${format(date, "d 'de' MMM. 'de' y", { locale: ptBR })}`;
    }
  };

  const setEndOfContent = (event: FocusEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    event.target.setSelectionRange(value.length, value.length);
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 flex items-center justify-center bg-black/50 data-[state=closed]:animate-[overlay-hide_300ms] data-[state=open]:animate-[overlay-show_200ms]">
        <Dialog.Content className="relative flex size-full max-w-[640px] flex-col overflow-hidden overflow-y-auto bg-slate-700 outline-none data-[state=closed]:animate-[content-hide_200ms] data-[state=open]:animate-[content-show_200ms] md:max-h-[60vh] md:rounded-md">
          <Dialog.Title />
          <Dialog.Description />

          <div className="flex flex-1 flex-col gap-5 p-5">
            <input
              className="w-full bg-transparent font-medium tracking-wide text-slate-200 outline-none"
              name="title"
              autoComplete="off"
              readOnly={isRecording ? true : false}
              value={title}
              title="Título da nota..."
              onChange={handleChangeTitle}
              placeholder="Título"
            />

            <div className="h-px bg-slate-600" />

            <textarea
              className="w-full flex-1 resize-none bg-transparent pr-1 text-sm leading-6 text-slate-200 outline-none md:p-0"
              name="content"
              autoComplete="off"
              title="Conteúdo da nota..."
              readOnly={isRecording ? true : false}
              value={transcription != '' ? content + transcription : content}
              onChange={handleChangeContent}
              autoFocus
              onFocus={setEndOfContent}
              placeholder="Escreva um texto ou grave uma nota em áudio..."
            />

            <div className="flex items-center justify-between gap-1">
              <span
                className="text-sm font-medium text-slate-400"
                title={formatDate(note.createdAt, true)}
              >
                {formatDate(updatedAt as Date)}
              </span>

              <div className="flex gap-2">
                {isRecording && (
                  <span className="flex items-center justify-center gap-1 text-sm font-medium text-slate-400">
                    <div className="size-3 animate-pulse rounded-full bg-red-500" />
                    Gravando...
                  </span>
                )}

                <button
                  onClick={!isRecording ? handleStartRecording : handleStopRecording}
                  title={!isRecording ? 'Gravar áudio' : 'Parar gravação do áudio'}
                  className={`rounded-full p-2 font-medium ${!isRecording ? 'text-green-500' : 'text-red-500'} outline-none hover:bg-slate-600 focus-visible:ring-2 focus-visible:ring-slate-500`}
                >
                  {!isRecording ? <Mic /> : <MicOff />}
                </button>

                <Dialog.Close
                  onClick={handleDeleteNote}
                  title="Apagar nota"
                  className="rounded-full p-2 font-medium text-red-500 outline-none hover:bg-slate-600 focus-visible:ring-2 focus-visible:ring-slate-500"
                >
                  <Trash />
                </Dialog.Close>
              </div>
            </div>
          </div>

          <Dialog.Close className="rounded-t-md bg-slate-800 py-4 text-sm font-medium text-slate-300 outline-none transition-colors hover:bg-slate-900 focus-visible:ring-2 focus-visible:ring-slate-500">
            Fechar
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Portal>
  );
};
