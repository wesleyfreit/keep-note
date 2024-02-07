export const Header = () => {
  return (
    <header className="px-6 py-3 flex items-center justify-between border-b border-b-slate-700">
      <h1 className="text-xl font-bold">KeepNote</h1>

      <div className="flex items-center gap-3">
        <button className="border-slate-400 text-slate-300 hover:bg-slate-700 border-2 py-2 px-4 rounded-lg">
          GitHub
        </button>
      </div>
    </header>
  );
};
