'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { format, isThisYear, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Mic, MicOff, Trash } from 'lucide-react';
import { ChangeEvent, FocusEvent, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';

import { revalidate } from '@/actions/app';
import { deleteNote, getNote, modifyNote } from '@/actions/notes';
import { NoteDTO } from '@/dtos/NoteDTO';
import { Separator } from './separator';

let speechRecognition: SpeechRecognition | null = null;

interface ModifyNoteCardProps {
  note: NoteDTO;
  checkCache: boolean;
  setCheckCache: (value: boolean) => void;
  setOpen: (value: boolean) => void;
}

export const ModifyNoteCard = ({
  note,
  checkCache,
  setCheckCache,
  setOpen,
}: ModifyNoteCardProps) => {
  const [id] = useState(note.id);
  const [content, setContent] = useState(note.content);
  const [title, setTitle] = useState(note.title);
  const [updatedAt, setUpdatedAt] = useState(note.updatedAt);

  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');

  const autoRecoverUnsavedRecording = useCallback(async () => {
    if (speechRecognition) {
      speechRecognition.stop();
    }

    try {
      await modifyNote(content + transcription, 'content', id);
      toast.success('O conteúdo da gravação foi salvo!');
    } catch (error) {
      toast.error('Erro ao salvar o conteúdo da gravação!');
    }

    setCheckCache(false);
    setIsRecording(false);
    revalidate('/');
  }, [content, id, setCheckCache, transcription]);

  const autoDeleteEmptyNote = useCallback(async () => {
    const savedNote = await getNote(id);

    if (savedNote.content === '' && savedNote.title === '') {
      await deleteNote(id);
      toast.info('Nota vazia descartada!');
    }

    setCheckCache(false);
    revalidate('/');
  }, [id, setCheckCache]);

  useEffect(() => {
    if (checkCache && isRecording) {
      autoRecoverUnsavedRecording();
    } else if (checkCache && !isRecording) {
      autoDeleteEmptyNote();
    }
  }, [checkCache, isRecording, autoRecoverUnsavedRecording, autoDeleteEmptyNote]);

  useEffect(() => {
    if (!isRecording && transcription !== '') {
      setTranscription('');
    }
  }, [isRecording, transcription]);

  const handleStartRecording = () => {
    const isSpeechRecognitionAvailable =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

    if (!isSpeechRecognitionAvailable) {
      toast.error('Seu navegador não suporta a gravação de áudio nativa!');
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

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0]?.transcript || '');
      }, '');

      setTranscription(transcription);
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

    handleChangeNote(content + transcription, 'content');
    setContent((prevContent) => prevContent + transcription);

    setIsRecording(false);
  };

  const handleChangeNote = useDebouncedCallback(async (value: string, name: string) => {
    try {
      const updatedAt = await modifyNote(value, name, note.id);
      setUpdatedAt(updatedAt);
    } catch (error) {
      toast.error('Erro ao salvar a nota!');
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

      setOpen(false);
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

  const setEndOfContent = (event: FocusEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    event.target.setSelectionRange(value.length, value.length);
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <Dialog.Content className="bg-slate-700 relative overflow-hidden md:rounded-md flex flex-col w-full h-full max-w-[640px] md:max-h-[60vh] outline-none overflow-y-auto">
          <div className="flex flex-1 flex-col gap-5 p-5">
            <input
              placeholder="Título"
              name="title"
              title="Título da nota..."
              value={title}
              onFocus={(e) => e.preventDefault()}
              onChange={handleChangeTitle}
              className="font-medium text-slate-200 tracking-wide outline-none bg-transparent w-full"
            />
            <Separator />
            <textarea
              className="text-sm leading-6 pr-1 md:p-0 text-slate-200 resize-none w-full flex-1 bg-transparent outline-none"
              name="content"
              title="Conteúdo da nota..."
              value={isRecording ? content + transcription : content}
              onChange={handleChangeContent}
              autoFocus
              onFocus={setEndOfContent}
              placeholder="Escreva um texto ou grave uma nota em áudio..."
            />
            <div className="flex items-center justify-between gap-1">
              <span className="text-slate-400 text-sm font-medium">
                {formatDate(updatedAt as Date)}
              </span>
              <div className="flex gap-2">
                {isRecording ? (
                  <>
                    <span className="text-sm text-slate-400 font-medium flex justify-center items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                      Gravando...
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
                  <button
                    onClick={handleStartRecording}
                    type="button"
                    title="Gravar áudio"
                    className="font-medium text-green-500 p-2 hover:bg-slate-600 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                  >
                    <Mic />
                  </button>
                )}
                <button
                  onClick={handleDeleteNote}
                  type="button"
                  title="Apagar nota"
                  className="font-medium text-red-500 p-2 hover:bg-slate-600 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                >
                  <Trash />
                </button>
              </div>
            </div>
          </div>
          <Dialog.Close
            title="Fechar janela de edição"
            className="outline-none text-sm font-medium bg-slate-800 text-slate-300 py-4 transition-colors hover:bg-slate-900 focus-visible:ring-2 focus-visible:ring-slate-500 rounded-t-md"
          >
            Fechar
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Portal>
  );
};
