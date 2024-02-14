'use client';
import { SearchIcon, User } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export const Header = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const setParams = (query: string) => {
    const params = new URLSearchParams(searchParams);

    if (query) {
      params.set('search', query);
    } else params.delete('search');

    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;

    setParams(query);
  }, 750);

  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('search')?.toString();

    if (query) setParams(query);
    else return;
  };

  return (
    <header className="flex items-center justify-between gap-5 border-b border-b-slate-700 px-6 py-3">
      <a
        href="/"
        className="text-xl font-bold outline-none hover:underline focus-visible:underline"
        title="Página inicial"
      >
        KeepNote
      </a>

      <form onSubmit={handleSubmit} className="relative w-96">
        <input
          type="text"
          name="search"
          autoComplete="off"
          title="Digite para pesquisar em suas notas"
          onChange={handleSearch}
          defaultValue={searchParams.get('search')?.toString()}
          placeholder="Pesquisar..."
          className="w-full rounded-full border-2 border-slate-700 bg-transparent px-4 py-2 pr-9 tracking-tight outline-none placeholder:text-slate-500 focus:border-slate-500"
        />

        <button
          type="submit"
          title="Pesquisa"
          className="group absolute right-0 -translate-x-1 translate-y-1 rounded-full p-2 outline-none hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-slate-500"
        >
          <SearchIcon className="size-5 text-slate-500 group-hover:text-slate-300" />
        </button>
      </form>

      <div className="flex items-center gap-3">
        <button
          title="Sua conta"
          className="rounded-full border-2 border-slate-700 p-2 text-slate-300 outline-none hover:bg-slate-700 focus-visible:border-slate-500"
        >
          <User className="text-slate-300" />
        </button>
      </div>
    </header>
  );
};
