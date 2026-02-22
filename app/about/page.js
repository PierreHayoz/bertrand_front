import Image from "next/image";
import { getAbout } from "../lib/about";
import BlocksRenderer from "../components/BlocksRenderer";
import Citation from "../components/Citation";
import ExploreCta from "../components/ExploreCTA";
import ExpoGalleryCarousel from "../components/ExpoGalleryCarousel";
import Reveal from "../components/Reveal";
import { Playfair_Display } from "next/font/google";
import PageHeaderAnimated from "../components/PageHeaderAnimated";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});
export default async function AboutPage() {
  const about = await getAbout();
  return (
    <main className="bg-stone-950 text-stone-200">
      <div className="mx-auto max-w-7xl px-8 md:px-16 pt-32 md:pt-44 pb-16 md:pb-24">
        <PageHeaderAnimated
          eyebrow="À propos"
          title={about.hero?.title}
          description={about.hero?.subtitle}
        />
        {about.image?.url ? (
          <Reveal delay={0.3}>
          <section className="mt-12 md:mt-16 border-t border-stone-900/80 pt-10 md:pt-14">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
              <div className="md:col-span-6">
                <div className="relative w-full overflow-hidden rounded-2xl border border-stone-900/80">
                  <div className="relative w-full aspect-square">
                    <Image
                      src={about.image.url}
                      alt={about.image.alt || "À propos"}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 900px"
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Bloc “note” à droite (optionnel, mais ça étoffe) */}
              <div className="md:col-span-4 md:col-start-9 text-stone-400 leading-6">
                <div className="text-xs tracking-[0.2em] uppercase text-stone-500">
                  Note
                </div>
                <p className="mt-4">
                  Quelques éléments de contexte sur la démarche, les médiums, et
                  la manière de constituer la collection.
                </p>

                <div className="mt-6 text-sm text-stone-500">
                  {about.updatedAt ? (
                    <span>Dernière mise à jour : {new Date(about.updatedAt).getFullYear()}</span>
                  ) : (
                    <span>Texte éditorial — portfolio</span>
                  )}
                </div>
              </div>
            </div>
          </section>
          </Reveal>
        ) : null}

        {/* Citation en interlude (si présente) */}
        {(about.citation?.text || about.citation?.auteur) ? (
          <section className="mt-12 md:mt-16">
            <div className="rounded-2xl border border-stone-900/80 p-6 md:p-10">

              <Reveal>
                <div className="md:px-8 px-4 h-full flex justify-center items-center">
                  <div className="text-white space-y-2">
                    <blockquote
                      className={` text-2xl leading-7`}
                    >
                      “{about.citation?.text}”
                    </blockquote>
                    <figcaption className="text-end pr-8 text-sm text-stone-300">
                      — {about.citation?.auteur}
                    </figcaption>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        ) : null}

        {/* Contenu */}
              <Reveal >

        <section className="mt-12 md:mt-16 border-t border-stone-900/80 pt-10 md:pt-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* marge gauche “vide” pour look magazine */}
            <div className="hidden md:block md:col-span-2">
              <div className="text-xs tracking-[0.2em] uppercase text-stone-500">
                Texte
              </div>
            </div>

            {/* contenu principal */}
            <div className="md:col-span-8">
              <div className="prose prose-invert prose-stone max-w-none prose-p:leading-7 prose-a:text-stone-200 hover:prose-a:text-white prose-strong:text-stone-200">
                <BlocksRenderer blocks={about.contenu} />
              </div>
            </div>
          </div>
          <ExpoGalleryCarousel images={about.gallery} />
        </section>
</Reveal>
        <ExploreCta
          cards={[
            {
              eyebrow: "Œuvres",
              title: "Parcourir l’archive",
              description: "Du plus récent au plus ancien.",
              href: "/oeuvres",
              label: "Voir les œuvres",
            },
            {
              eyebrow: "Agenda",
              title: "Parcourir mes expositions",
              description: "De la plus récente à la plus ancienne.",
              href: "/expositions",
              label: "Voir l'agenda",
            },
          ]}
        />
      </div>
    </main>
  );
}
