export default function Loading() {
  return (
    <main className="bg-stone-950 text-stone-200">
      <div className="mx-auto max-w-7xl px-8 md:px-16 pt-32 md:pt-44 pb-16 md:pb-24">
        {/* Header de page */}
        <header className="max-w-2xl">
          <div className="h-3 w-24 rounded bg-stone-800/70 animate-pulse" />
          <div className="mt-4 h-10 md:h-14 w-72 md:w-[28rem] rounded bg-stone-800/70 animate-pulse" />
          <div className="mt-5 space-y-2">
            <div className="h-4 w-full max-w-xl rounded bg-stone-800/70 animate-pulse" />
            <div className="h-4 w-5/6 max-w-lg rounded bg-stone-800/70 animate-pulse" />
          </div>
        </header>

        {/* Featured */}
        <section className="mt-12 md:mt-16 border-t border-stone-900/80 pt-10 md:pt-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            {/* texte */}
            <div className="md:col-span-5">
              <div className="h-3 w-40 rounded bg-stone-800/70 animate-pulse" />
              <div className="mt-4 h-9 md:h-12 w-80 md:w-[26rem] rounded bg-stone-800/70 animate-pulse" />

              <div className="mt-5 flex flex-wrap gap-3">
                <div className="h-8 w-20 rounded-full bg-stone-800/70 animate-pulse" />
                <div className="h-8 w-28 rounded-full bg-stone-800/70 animate-pulse" />
                <div className="h-8 w-20 rounded-full bg-stone-800/70 animate-pulse" />
              </div>

              <div className="mt-6 space-y-2">
                <div className="h-4 w-full max-w-md rounded bg-stone-800/70 animate-pulse" />
                <div className="h-4 w-4/5 max-w-sm rounded bg-stone-800/70 animate-pulse" />
              </div>
            </div>

            {/* image */}
            <div className="md:col-span-7">
              <div className="rounded-2xl border border-stone-900/80 overflow-hidden">
                <div className="aspect-square md:aspect-[4/3] w-full bg-stone-800/70 animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        {/* Toolbar */}
        <div className="mt-12 md:mt-16 flex items-end justify-between border-t border-stone-900/80 pt-8">
          <div>
            <div className="h-3 w-32 rounded bg-stone-800/70 animate-pulse" />
            <div className="mt-2 h-4 w-24 rounded bg-stone-800/70 animate-pulse" />
          </div>
          <div className="hidden md:block h-4 w-48 rounded bg-stone-800/70 animate-pulse" />
        </div>

        {/* Grid */}
        <section className="mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-stone-900/80 overflow-hidden"
            >
              <div className="aspect-square w-full bg-stone-800/70 animate-pulse" />
              <div className="p-4">
                <div className="h-4 w-3/4 rounded bg-stone-800/70 animate-pulse" />
                <div className="mt-3 flex gap-2">
                  <div className="h-6 w-16 rounded-full bg-stone-800/70 animate-pulse" />
                  <div className="h-6 w-20 rounded-full bg-stone-800/70 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
