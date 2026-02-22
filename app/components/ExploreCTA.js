import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

function CtaCard({ eyebrow, title, description, href, label }) {
    return (
        <Link
            href={href}
        >
            <div className="rounded-2xl group border border-stone-900/80  overflow-hidden relative p-6 md:p-8 hover:border-stone-700 transition-colors">
                <div className="w-full group-hover:left-0 top-0  duration-500 bg-stone-200 mix-blend-difference -left-full  h-full absolute z-10"></div>
                <div className="text-xs tracking-[0.2em] uppercase text-stone-500">
                    {eyebrow}
                </div>
                <div className="mt-4 text-xl md:text-2xl font-light text-stone-200">
                    {title}
                </div>
                {description ? (
                    <p className="mt-3 text-stone-400 leading-6">{description}</p>
                ) : null}
                <div className="flex justify-end mt-4">
                    <div
                        className="
    relative
    overflow-hidden
    px-3 py-1
    border border-stone-600
    rounded-full
    flex items-center
    w-fit
    transition-all duration-300
    group-hover:pr-8
  "
                    >
                        <span>{label}</span>

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
        </Link>
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
        <Reveal delay={0.2}>
        <section className="mt-12 md:mt-16 border-t border-stone-900/80 pt-10 md:pt-14">
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
