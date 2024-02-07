export const NoteCard = () => {
  return (
    <button className="rounded-md bg-slate-800 text-left p-5 space-y-4 overflow-hidden relative hover:ring-2 outline-none hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
      <span className="text-sm font-medium text-slate-300">há 2 dias</span>

      <p className="text-sm leading-6 text-slate-400">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, ad possimus
        voluptatem voluptate ipsam cum voluptas repudiandae quia optio error quas sed
        natus, velit, eveniet enim explicabo? Id, rem officia. Lorem ipsum dolor sit amet
        consectetur adipisicing elit. Aperiam, ad possimus voluptatem voluptate ipsam cum
        voluptas repudiandae quia optio error quas sed natus, velit, eveniet enim
        explicabo? Id, rem officia.
      </p>

      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
    </button>
  );
};
