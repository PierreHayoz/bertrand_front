'use client'
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import TransitionLink from "./TransitionLink";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

function CtaCard({
    eyebrow,
    title,
    description,
    href,
    label,
}) {

    /* Detect mobile (touch devices) */
    const [isMobile, setIsMobile] = useState(false);
    const ref = useRef(null);

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
        <TransitionLink href={href}>
            <div
                ref={ref}
                className="
          relative overflow-hidden rounded-2xl
          border border-stone-900/80
          p-6 md:p-8
          group
          transition-all duration-300
          hover:border-stone-700
          active:scale-[0.98]
        "
            >
                {/* Overlay */}
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

                {/* Content */}
                <div className="relative ">
                    <div className="text-xs tracking-[0.2em] uppercase text-stone-500">
                        {eyebrow}
                    </div>

                    <div className="mt-4 text-xl md:text-2xl font-light text-stone-200">
                        {title}
                    </div>

                    {description && (
                        <p className="mt-3 text-stone-400 leading-6">
                            {description}
                        </p>
                    )}

                    <div className="flex justify-end mt-4">
                        <div
                            className={`
    relative overflow-hidden
    px-3 py-1
    border border-stone-600
    rounded-full
    flex items-center
    w-fit
    transition-all duration-300
    md:group-hover:pr-8
    ${active ? "pr-8" : ""}
  `}
                        >
                            <span>{label}</span>

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
    );
}

export default function ExploreCta({
    title = "Pour aller plus loin",
    cards = [
        {
            eyebrow: "Œuvres",
            title: "Parcourir l’archive",
            description: "Une sélection d’œuvres triées du plus récent au plus ancien.",
            href: "/oeuvres",
            label: "Voir les œuvres",
        },
        {
            eyebrow: "À propos",
            title: "Découvrir la démarche",
            description: "Contexte, influences, intentions et process.",
            href: "/about",
            label: "Me découvrir",
        },
    ],
}) {
    return (
        <Reveal>
            <section className="md:mt-16 border-t border-stone-900/80 pt-10 md:pt-14">
                <div>
                    <div className="text-xs tracking-[0.2em] uppercase text-stone-500">
                        Explorer
                    </div>
                    <h2 className="mt-2 text-xl md:text-2xl font-light text-stone-200">
                        {title}
                    </h2>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-6">
                        <CtaCard {...cards[0]} />
                    </div>
                    <div className="md:col-span-6">
                        <CtaCard {...cards[1]} />
                    </div>
                </div>
            </section>
        </Reveal>
    );
}
