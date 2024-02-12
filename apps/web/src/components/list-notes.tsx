'use client';
import { NoteCard } from '@/components/note-card';
import { NoteDTO } from '@/dtos/NoteDTO';
import { useEffect, useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Spinner } from './spinner';

interface ListNotesProps {
  filteredNotes: NoteDTO[];
  search: string;
}

export const ListNotes = ({ filteredNotes, search }: ListNotesProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (filteredNotes[filteredNotes.length - 1]) {
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
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 200: 1, 400: 2, 740: 3, 1080: 4 }}
        className={`transition-opacity duration-500 ${loading ? 'opacity-0 pointer-events-none absolute' : ''}`}
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
