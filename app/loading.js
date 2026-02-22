// app/loading.tsx
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

function SectionHeaderSkeleton({ align = "left" }) {
  const alignClass =
    align === "right" ? "md:ml-auto md:text-right" : align === "center" ? "mx-auto text-center" : "";

  return (
    <div className={`max-w-2xl ${alignClass}`}>
      <Skeleton className="h-3 w-32 rounded" />
      <Skeleton className="mt-4 h-10 w-[70%]" />
      <Skeleton className="mt-4 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-[85%]" />
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-12 gap-y-10 md:gap-y-0">
      <div className="col-span-3 md:col-span-7">
        <Skeleton className="h-3 w-48 rounded" />
        <Skeleton className="mt-6 h-14 w-[85%]" />
        <div className="mt-10 border-t border-stone-900/80 pt-6 flex gap-6">
          <div className="min-w-28 space-y-2">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
          <div className="min-w-28 space-y-2">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
          <div className="hidden md:block min-w-28 space-y-2">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        </div>
      </div>

      <div className="col-span-3 md:col-span-4 md:col-start-9">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="mt-2 h-4 w-[92%] rounded" />
        <Skeleton className="mt-2 h-4 w-[78%] rounded" />
        <Skeleton className="mt-8 h-3 w-64 rounded" />
      </div>
    </div>
  );
}

function StickyCardsSkeleton() {
  return (
    <div className="mt-10 md:mt-14 border-t border-stone-900/80 pt-10 space-y-20">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="grid md:grid-cols-12 gap-6 items-start">
          <Skeleton className="md:col-span-7 h-64 md:h-80 rounded-2xl" />
          <div className="md:col-span-5 space-y-3">
            <Skeleton className="h-6 w-40 rounded" />
            <Skeleton className="h-4 w-[85%] rounded" />
            <Skeleton className="h-4 w-[70%] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ObservationsGridSkeleton() {
  return (
    <div className="mt-10 md:mt-14 bg-stone-950 grid grid-cols-4 gap-2 md:gap-4 pb-16 pt-8 md:pb-32 md:pt-16">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="md:col-span-1 col-span-4">
          <Skeleton className="hidden md:block h-4 w-12 rounded" />
          <Skeleton className="mt-2 h-64 rounded-2xl" />
          <div className="mt-3 flex justify-between gap-4">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[90%] rounded" />
              <Skeleton className="h-3 w-[60%] rounded" />
            </div>
            <Skeleton className="h-6 w-10 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SeparationSkeleton() {
  return (
    <section className="border-t border-stone-900/80 pt-10 md:pt-14">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="hidden md:block md:col-span-2">
          <Skeleton className="h-3 w-24 rounded" />
        </div>
        <div className="md:col-span-8">
          <div className="rounded-2xl border border-stone-900/80 p-6 md:p-8">
            <Skeleton className="h-10 w-[80%] rounded" />
            <Skeleton className="mt-6 h-12 w-44 rounded-full" />
          </div>
        </div>
        <div className="hidden md:block md:col-span-2" />
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
          <div key={i} className="md:col-span-6 rounded-2xl border border-stone-900/80 p-6 md:p-8">
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
    <main className="bg-stone-950 text-stone-200 pb-10 md:pb-24">
      <div className="mx-auto max-w-7xl px-8 md:px-16">
        <section className="pt-32 md:pt-44 pb-14 md:pb-24">
          <HeroSkeleton />
        </section>

        <section className="pb-20 md:pb-28">
          <SectionHeaderSkeleton align="left" />
          <StickyCardsSkeleton />
        </section>

        <section className="pb-20 md:pb-28">
          <SeparationSkeleton />
        </section>

        <section className="pb-20 md:pb-28">
          <SectionHeaderSkeleton align="right" />
          <ObservationsGridSkeleton />
        </section>

        <ExploreCtaSkeleton />
      </div>
    </main>
  );
}
