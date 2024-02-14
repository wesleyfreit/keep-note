import { StickyNote } from 'lucide-react';

interface EmptyNotesProps {
  searchResult: boolean;
}

export const EmptyNotes = ({ searchResult }: EmptyNotesProps) => {
  return (
    <div className="flex h-96 grow flex-col items-center justify-center ">
      <StickyNote className="size-24 text-slate-700" />
      <span className="text-xl font-medium text-slate-500">
        {searchResult
          ? 'Nenhum resultado encontrado'
          : 'As notas adicionadas serão exibidas aqui'}
      </span>
    </div>
  );
};
