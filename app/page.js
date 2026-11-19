import Image from "next/image";
import Artwork, { ArtworkGrid } from "./components/Artwork";
import Reveal from "./components/Reveal";
import TransitionLink from "./components/TransitionLink";
import { ArrowLink, CtaBand, Quote, SectionHeading, StatusLabel } from "./components/ui";
import { getHomepage } from "./lib/homePage";
import { getExpositions } from "./lib/expositions";
import { getLatestOeuvres } from "./lib/oeuvres";
import { formatDateRange, pickFeaturedExpo, place } from "./lib/utils";

// Les œuvres mises en avant sont toujours les plus récentes.
const RECENT_COUNT = 9;

export default async function Home() {
  const [homepage, expositions, recent] = await Promise.all([
    getHomepage(),
    getExpositions(),
    getLatestOeuvres(RECENT_COUNT),
  ]);

  const [latest, ...others] = recent;
  const expo = pickFeaturedExpo(expositions);

  return (
    <main>
      {/* En-tête : phrase de l'artiste + dernière œuvre */}
      <section className="container-site pt-32 md:pt-44 pb-20 md:pb-32 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-14 items-end">
        <Reveal className="md:col-span-7 md:pb-4">
          <p className="t-label text-muted">Artiste peintre · Fribourg</p>
          <h1 className="mt-6 t-display text-ink text-balance">{homepage?.hero.title}</h1>
          {homepage?.hero.subtitle ? (
            <p className="mt-8 t-lead text-muted max-w-[44ch]">{homepage.hero.subtitle}</p>
          ) : null}
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            <ArrowLink href="/oeuvres">Voir toutes les œuvres</ArrowLink>
            <ArrowLink href="/about">Le parcours</ArrowLink>
          </div>
        </Reveal>

        {latest ? (
          <Reveal className="md:col-span-5" delay={0.15}>
            <p className="t-label text-muted mb-4">Dernière œuvre</p>
            <Artwork
              oeuvre={latest}
              list={recent}
              priority
              sizes="(max-width: 768px) 100vw, 40vw"
              className="max-w-[34rem] md:ml-auto"
            />
          </Reveal>
        ) : null}
      </section>

      {/* Œuvres récentes */}
      {others.length ? (
        <section className="container-site pb-20 md:pb-32">
          <Reveal>
            <SectionHeading label="Atelier" title="Œuvres récentes">
              <ArrowLink href="/oeuvres">Toutes les œuvres</ArrowLink>
            </SectionHeading>
          </Reveal>
          <div className="mt-12 md:mt-16">
            <ArtworkGrid oeuvres={others} cols="columns-2 md:columns-4" sizes="(max-width: 768px) 50vw, 25vw" />
          </div>
        </section>
      ) : null}

      <CtaBand cta={homepage?.cta} />

      <Quote text={homepage?.citation.text} auteur={homepage?.citation.auteur} />

      {/* Exposition à la une */}
      {expo ? (
        <section className="container-site pb-24 md:pb-36">
          <Reveal>
            <SectionHeading
              label={expo.status === "past" ? "Dernière exposition" : "Exposition"}
              title={null}
            >
              <ArrowLink href="/expositions">Toutes les expositions</ArrowLink>
            </SectionHeading>
          </Reveal>
          <Reveal className="mt-10 md:mt-14">
            <TransitionLink
              href={`/expositions/${expo.slug}`}
              label={expo.titre}
              className="group grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
            >
              {expo.cover ? (
                <div className="md:col-span-4 overflow-hidden bg-surface">
                  <Image
                    src={expo.cover.src}
                    width={expo.cover.width}
                    height={expo.cover.height}
                    alt={expo.cover.alt}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="h-auto w-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                  />
                </div>
              ) : null}
              <div className="md:col-span-7 md:col-start-6">
                <StatusLabel status={expo.status} />
                <h2 className="mt-4 t-h1 text-ink text-balance">{expo.titre}</h2>
                <p className="mt-6 t-lead text-muted">{formatDateRange(expo.dateDebut, expo.dateFin)}</p>
                <p className="t-lead text-muted">{place(expo)}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-ink">
                  <span className="link-underline group-hover:bg-[length:100%_1px]">Voir l’exposition</span>
                  <span aria-hidden="true">→</span>
                </span>
              </div>
            </TransitionLink>
          </Reveal>
        </section>
      ) : null}
    </main>
  );
}
