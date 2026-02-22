import React from 'react'

export default function GridSkeleton() {
  return (
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
  )
}
