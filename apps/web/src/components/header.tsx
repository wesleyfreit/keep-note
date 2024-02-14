'use client';
import { SearchIcon, User } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export const Header = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = useDebouncedCallback((event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    const params = new URLSearchParams(searchParams);

    if (query) {
      params.set('search', query);
    } else params.delete('search');

    router.replace(`${pathname}?${params.toString()}`);
  }, 750);

  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <header className="px-6 py-3 flex items-center justify-between border-b border-b-slate-700 gap-5">
      <a
        href="/"
        className="text-xl font-bold hover:underline outline-none focus-visible:underline"
      >
        KeepNote
      </a>

      <form onSubmit={handleSubmit} className="w-96 relative">
        <input
          type="text"
          name="search"
          onChange={handleSearch}
          defaultValue={searchParams.get('search')?.toString()}
          placeholder="Pesquisar..."
          className="w-full bg-transparent pr-9 tracking-tight outline-none border-2 border-slate-700 rounded-full px-4 py-2 focus:border-slate-500 placeholder:text-slate-500"
        />

        <button
          type="submit"
          className="absolute right-0 translate-y-1 -translate-x-1 p-2 rounded-full hover:bg-slate-700 group outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
        >
          <SearchIcon className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
        </button>
      </form>

      <div className="flex items-center gap-3">
        <button className="border-slate-700 text-slate-300 hover:bg-slate-700 border-2 p-2 rounded-full outline-none focus-visible:border-slate-500">
          <User className="text-slate-300" />
        </button>
      </div>
    </header>
  );
};
