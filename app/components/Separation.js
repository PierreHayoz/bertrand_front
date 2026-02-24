"use client";

import { ArrowRight } from "lucide-react";
import TransitionLink from "./TransitionLink";
import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";

export default function Separation({ separation }) {
  if (!separation?.title) return null;

  const ref = useRef(null);

  /* Detect touch devices */
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");
    setIsMobile(media.matches);
  }, []);

  /* Scroll trigger */
  const isInView = useInView(ref, {
    margin: "-180px",
    once: true,
  });

  const active = isMobile && isInView;

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
          <TransitionLink href={separation.url}>
            <div
              ref={ref}
              className="
                rounded-2xl md:group border border-stone-900/80
                overflow-hidden relative p-6 md:p-8
                hover:border-stone-700
                transition-all duration-300
                active:scale-[0.99]
              "
            >
              
              {/* overlay */}
              <div
                className={`
                  absolute top-0 h-full w-full
                  bg-stone-200 mix-blend-difference z-10
                  transition-all duration-500
                  -left-full
                  md:group-hover:left-0
                  ${active ? "left-0" : ""}
                `}
              />

              {/* content */}
              <div className="relative ">
                <h2 className="text-xl md:text-3xl font-light md:leading-9 text-stone-200">
                  {separation.title}
                </h2>

                <div className="flex justify-end mt-6">
                  <div
                    className={`
                      relative overflow-hidden
                      px-4 py-2
                      border border-stone-600
                      rounded-full
                      flex items-center
                      w-fit
                      transition-all duration-300
                      md:group-hover:pr-8
                      ${active ? "pr-8" : ""}
                    `}
                  >
                    <span>{separation.label}</span>

                    <ArrowRight
                      size={14}
                      className={`
                        absolute right-3
                        transition-all duration-300 ease-out
                        opacity-0 -translate-x-1
                        md:group-hover:opacity-100 md:group-hover:translate-x-0
                        ${active ? "opacity-100 translate-x-0" : ""}
                      `}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TransitionLink>
        </div>

        {/* colonne vide */}
        <div className="hidden md:block md:col-span-2" />
      </div>
    </section>
  );
}