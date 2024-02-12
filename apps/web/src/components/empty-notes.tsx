import { StickyNote } from 'lucide-react';

export const EmptyNotes = () => {
  return (
    <div className="flex h-96 flex-grow items-center justify-center flex-col ">
      <StickyNote className="h-24 w-24 text-slate-700" />
      <span className="text-slate-500 font-medium text-xl">
        As notas adicionadas serão exibidas aqui
      </span>
    </div>
  );
};
