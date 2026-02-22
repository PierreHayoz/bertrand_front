// app/about/loading.tsx
function Skeleton({ className = "" }) {
  return (
    <div
      className={[
        "animate-pulse rounded-xl bg-stone-900/70",
        className,
      ].join(" ")}
    />
  );
}

function HeaderSkeleton() {
  return (
    <header className="max-w-2xl">
      <Skeleton className="h-3 w-24 rounded" />
      <Skeleton className="mt-6 h-12 md:h-16 w-[85%]" />
      <Skeleton className="mt-6 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-[80%]" />
    </header>
  );
}

function ImageNoteSkeleton() {
  return (
    <section className="mt-12 md:mt-16 border-t border-stone-900/80 pt-10 md:pt-14">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        <div className="md:col-span-6">
          <div className="relative w-full overflow-hidden rounded-2xl border border-stone-900/80">
            <div className="relative w-full aspect-square">
              <Skeleton className="absolute inset-0 rounded-none" />
            </div>
          </div>
        </div>

        <div className="md:col-span-4 md:col-start-9 text-stone-400 leading-6">
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="mt-5 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-[92%]" />
          <Skeleton className="mt-2 h-4 w-[70%]" />
          <Skeleton className="mt-8 h-3 w-40 rounded" />
        </div>
      </div>
    </section>
  );
}

function CitationSkeleton() {
  return (
    <section className="mt-12 md:mt-16">
      <div className="rounded-2xl border border-stone-900/80 p-6 md:p-10">
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="mt-3 h-4 w-[75%]" />
        <Skeleton className="mt-6 h-3 w-40" />
      </div>
    </section>
  );
}

function TextSkeleton() {
  return (
    <section className="mt-12 md:mt-16 border-t border-stone-900/80 pt-10 md:pt-14">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="hidden md:block md:col-span-2">
          <Skeleton className="h-3 w-16 rounded" />
        </div>

        <div className="md:col-span-8 space-y-5">
          {/* faux paragraphes */}
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-[96%] rounded" />
          <Skeleton className="h-4 w-[90%] rounded" />
          <div className="h-4" />

          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-[94%] rounded" />
          <Skeleton className="h-4 w-[78%] rounded" />
          <div className="h-4" />

          {/* faux heading + paragraph */}
          <Skeleton className="h-7 w-56 rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-[88%] rounded" />
          <Skeleton className="h-4 w-[70%] rounded" />
        </div>
      </div>
    </section>
  );
}

function ExploreCtaSkeleton() {
  return (
    <section className="mt-12 md:mt-16 border-t border-stone-900/80 pt-10 md:pt-14">
      <Skeleton className="h-3 w-24 rounded" />
      <Skeleton className="mt-3 h-8 w-64 rounded" />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="md:col-span-6 rounded-2xl border border-stone-900/80 p-6 md:p-8"
          >
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="mt-4 h-7 w-[75%] rounded" />
            <Skeleton className="mt-3 h-4 w-[92%] rounded" />
            <Skeleton className="mt-2 h-4 w-[70%] rounded" />
            <div className="flex justify-end mt-6">
              <Skeleton className="h-9 w-36 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Loading() {
  return (
    <main className="bg-stone-950 text-stone-200">
      <div className="mx-auto max-w-7xl px-8 md:px-16 pt-32 md:pt-44 pb-16 md:pb-24">
        <HeaderSkeleton />
        <ImageNoteSkeleton />
        <CitationSkeleton />
        <TextSkeleton />
        <ExploreCtaSkeleton />
      </div>
    </main>
  );
}
