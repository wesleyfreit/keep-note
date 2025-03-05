'use client';

import { getAllNotes } from '@/actions/notes';
import { NoteCard } from '@/app/(home)/note-card';
import { Spinner } from '@/components/spinner';
import type { INote } from '@/dtos/note';
import { ApiError } from '@/lib/api-error';
import { useCallback, useEffect, useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { toast } from 'sonner';
import { EmptyNotes } from './empty-notes';

interface ListNotesProps {
  search: string;
}

export const ListNotes = ({ search }: ListNotesProps) => {
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<INote[]>([]);

  const handleFetchNotes = useCallback(async () => {
    try {
      const response = await getAllNotes();

      const filteredNotes = search
        ? response.notes.filter(
            (note) =>
              note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
              note.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
          )
        : response.notes;

      setNotes(filteredNotes);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    }
  }, [search]);

  useEffect(() => {
    handleFetchNotes();
  }, [handleFetchNotes]);

  useEffect(() => {
    if (notes[notes.length - 1] || notes.length === 0) {
      setLoading(false);
    }
  }, [notes]);

  return (
    <>
      {loading && (
        <div className="flex justify-center">
          <Spinner size="size-8" />
        </div>
      )}

      {notes.length <= 0 && !loading && (
        <EmptyNotes searchResult={search !== '' ? true : false} />
      )}

      <ResponsiveMasonry
        columnsCountBreakPoints={{ 200: 1, 400: 2, 740: 3, 1080: 4 }}
        className={`transition-opacity duration-500 ${loading ? 'pointer-events-none absolute opacity-0' : ''}`}
      >
        <Masonry gutter="10px" className={loading ? 'overflow-hidden' : ''}>
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} search={search} />
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </>
  );
};
