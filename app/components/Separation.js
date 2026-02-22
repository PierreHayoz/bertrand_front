import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Separation({ separation }) {
  if (!separation?.title) return null;

  return (
    <section className="border-t border-stone-900/80 pt-10 md:pt-14">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* marge “magazine” */}
        <div className="hidden md:block md:col-span-2">
          <div className="text-xs tracking-[0.2em] uppercase text-stone-500">
            Invitation
          </div>
        </div>

        {/* CTA card */}
        <div className="md:col-span-8">
          <Link href={separation.url}>
            <div className="rounded-2xl group border border-stone-900/80 overflow-hidden relative p-6 md:p-8 hover:border-stone-700 transition-colors">

              {/* overlay animation */}
              <div className="w-full group-hover:left-0  top-0 duration-500 bg-stone-200 mix-blend-difference -left-full h-full absolute z-10"></div>

              {/* content */}
              <div className="relative">
                <h2 className="text-xl md:text-3xl font-light md:leading-9 text-stone-200">
                  {separation.title}
                </h2>

                <div className="flex justify-end mt-6">
                  <div
                    className="
              relative
              overflow-hidden
              px-4 py-2
              border border-stone-600
              rounded-full
              flex items-center
              w-fit
              transition-all duration-300
              group-hover:pr-8
            "
                  >
                    <span>{separation.label}</span>

                    <ArrowRight
                      size={14}
                      className="
                absolute right-3
                opacity-0
                translate-x-[-6px]
                transition-all duration-300 ease-out
                group-hover:opacity-100
                group-hover:translate-x-0
              "
                    />
                  </div>
                </div>
              </div>

            </div>
          </Link>
        </div>

        {/* colonne vide pour respirer */}
        <div className="hidden md:block md:col-span-2" />
      </div>
    </section>
  );
}
