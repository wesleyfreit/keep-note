'use client';
import { NoteCard } from '@/components/note-card';
import { INote } from '@/dtos/note';
import { useEffect, useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { EmptyNotes } from './empty-notes';
import { Spinner } from './spinner';

interface ListNotesProps {
  filteredNotes: INote[];
  search: string;
}

export const ListNotes = ({ filteredNotes, search }: ListNotesProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (filteredNotes[filteredNotes.length - 1] || filteredNotes.length === 0) {
      setLoading(false);
    }
  }, [filteredNotes]);

  return (
    <>
      {loading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      {filteredNotes.length <= 0 && !loading && (
        <EmptyNotes searchResult={search !== '' ? true : false} />
      )}

      <ResponsiveMasonry
        columnsCountBreakPoints={{ 200: 1, 400: 2, 740: 3, 1080: 4 }}
        className={`transition-opacity duration-500 ${loading ? 'pointer-events-none absolute opacity-0' : ''}`}
      >
        <Masonry gutter="10px" className={loading ? 'overflow-hidden' : ''}>
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} search={search} />
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </>
  );
};
