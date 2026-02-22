"use client";

import Link from "next/link";
import { useModal } from "@/context/ModalContext";
import ImageHover from "./ImageHover";
import ExploreCta from "./ExploreCTA";
import PageHeaderAnimated from "./PageHeaderAnimated";
import Reveal from "./Reveal";

export default function OeuvresLayout({
  latest,
  rest,
  total,
  page,
  totalPages,
  nextExpo,
}) {
  const { openModal } = useModal();

  return (
    <main className="bg-stone-950 text-stone-200 ">
      <div className="mx-auto max-w-7xl px-8 md:px-16 pt-32 md:pt-44 pb-16 md:pb-24">
        <PageHeaderAnimated
          eyebrow="Archive"
          title={"Œuvres"}
          description={`${total} pièces — page ${page} / ${totalPages}`}
        />
        {/* si aucune oeuvre */}
        {total === 0 ? (
          <div className="mt-12 md:mt-16 rounded-2xl border border-stone-900/80 p-6 text-stone-400">
            Aucune œuvre trouvée. Vérifie que `getOeuvres()` renvoie bien un tableau
            et que l’API Strapi répond côté serveur.
          </div>
        ) : null}

        {/* Featured */}
        {latest ? (
          <Reveal delay={0.3}>
            <section className="mt-12 md:mt-16 border-t border-stone-900/80 pt-10 md:pt-14">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                <div className="md:col-span-5">
                  <div className="text-xs tracking-[0.2em] uppercase text-stone-500">
                    Dernière création
                  </div>

                  <h2 className="mt-4 text-2xl md:text-4xl font-light leading-tight text-stone-200">
                    {latest.titre}
                  </h2>

                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-stone-400">
                    {latest.numero ? (
                      <span className="rounded-full border border-stone-800 px-3 py-1">
                        N° {latest.numero}
                      </span>
                    ) : null}
                    {latest.format ? (
                      <span className="rounded-full border border-stone-800 px-3 py-1">
                        {latest.format}
                      </span>
                    ) : null}
                    {latest.date ? (
                      <span className="rounded-full border border-stone-800 px-3 py-1">
                        {new Date(latest.date).getFullYear()}
                      </span>
                    ) : null}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openModal(latest, [latest, ...rest])}
                  className="md:col-span-7 text-left rounded-2xl border border-stone-900/80 hover:border-stone-700 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <ImageHover
                    type="first"
                    format={latest.format}
                    numero={latest.numero}
                    title={latest.titre}
                    date={latest.date ? new Date(latest.date).getFullYear() : null}
                    width={1100}
                    height={1100}
                    alt={latest.imageAlt ?? latest.titre ?? "oeuvre"}
                    text="afficher"
                    src={latest.imageUrl}
                  />
                </button>
              </div>
            </section>
          </Reveal>
        ) : null}

        {/* Grid */}
        <section className="mt-12 md:mt-16 border-t border-stone-900/80 pt-10 md:pt-14">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {rest.map((oeuvre) => (
              <div key={oeuvre.id} onClick={() => openModal(oeuvre)}>
                <Reveal>
                
                <ImageHover
                  type="first"
                  format={oeuvre.format}
                  numero={oeuvre.numero}
                  title={oeuvre.titre}
                  date={oeuvre.date ? new Date(oeuvre.date).getFullYear() : null}
                  width={700}
                  height={700}
                  alt={oeuvre.imageAlt ?? oeuvre.titre ?? "oeuvre"}
                  text="afficher"
                  src={oeuvre.imageUrl}
                />
                </Reveal>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <nav className="mt-10 flex items-center justify-between">
            <Link
              href={`/oeuvres?page=${Math.max(1, page - 1)}`}
              aria-disabled={page <= 1}
              className={`rounded-full border px-5 py-3 transition-colors ${page <= 1
                ? "border-stone-900 text-stone-600 pointer-events-none"
                : "border-stone-800 text-stone-200 hover:bg-stone-200 hover:text-stone-950"
                }`}
            >
              ← Précédent
            </Link>

            <div className="text-stone-500 text-sm">
              Page {page} / {totalPages}
            </div>

            <Link
              href={`/oeuvres?page=${Math.min(totalPages, page + 1)}`}
              aria-disabled={page >= totalPages}
              className={`rounded-full border px-5 py-3 transition-colors ${page >= totalPages
                ? "border-stone-900 text-stone-600 pointer-events-none"
                : "border-stone-800 text-stone-200 hover:bg-stone-200 hover:text-stone-950"
                }`}
            >
              Suivant →
            </Link>
          </nav>
        </section>

        <ExploreCta
          cards={[
            {
              eyebrow: "Agenda",
              title: "Parcourir mes expositions",
              description: "De la plus récente à la plus ancienne.",
              href: "/expositions",
              label: "Voir l'agenda",
            },
            {
              eyebrow: "À propos",
              title: "Découvrir la démarche",
              description: "Contexte, influences, intentions.",
              href: "/about",
              label: "Me découvrir",
            },
          ]}
        />
      </div>
    </main>
  );
}
