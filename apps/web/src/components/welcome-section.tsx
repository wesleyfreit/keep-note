import Image from 'next/image';

export const WelcomeSection = () => {
  return (
    <section className="hidden w-1/3 items-center justify-center md:flex md:flex-col">
      <Image src="/sticky-note.png" alt="KeepNote" width={150} height={150} />
      <h1 className="text-wrap p-5 text-center text-2xl font-bold text-yellow-50 transition-all lg:text-3xl">
        Crie notas com rapidez e praticidade no KeepNote!
      </h1>
    </section>
  );
};
