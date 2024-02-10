import { SearchIcon, User } from 'lucide-react';
import { ChangeEvent } from 'react';

interface HeaderProps {
  setSearch: (query: string) => void;
}

export const Header = ({ setSearch }: HeaderProps) => {
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearch(query);
  };

  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <header className="px-6 py-3 flex items-center justify-between border-b border-b-slate-700">
      <a href="/" className="text-xl font-bold hover:underline">
        KeepNote
      </a>

      <form onSubmit={handleSubmit} className="w-96 relative">
        <input
          type="text"
          onChange={handleSearch}
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent tracking-tight outline-none border-2 border-slate-700 rounded-full px-4 py-2 focus:border-slate-500 placeholder:text-slate-500"
        />

        <button
          type="submit"
          className="absolute right-0 translate-y-1 -translate-x-1 p-2 rounded-full hover:bg-slate-700"
        >
          <SearchIcon className="w-5 h-5 text-slate-300" />
        </button>
      </form>

      <div className="flex items-center gap-3">
        <button className="border-slate-700 text-slate-300 hover:bg-slate-700 border-2 p-2 rounded-full">
          <User className="text-slate-300" />
        </button>
      </div>
    </header>
  );
};
