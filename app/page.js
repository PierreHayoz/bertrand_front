import { ArtworkGrid } from "./components/Artwork";
import ArtworkStack from "./components/ArtworkStack";
import { ArrowLink, CtaBand, EXPLORE, ExploreLinks, Quote, SectionHeading } from "./components/ui";
import { getHomepage } from "./lib/content";
import { getExpositions, pickFeaturedExpo } from "./lib/expositions";
import { getOeuvres } from "./lib/oeuvres";

// Les œuvres de l'accueil sont toujours les plus récentes.
const STACK = 6;
const GRID = 8;

export default async function Home() {
  const [homepage, { items }, expositions] = await Promise.all([
    getHomepage(),
    getOeuvres({ limit: STACK + GRID }),
    getExpositions(),
  ]);

  const selection = items.slice(0, STACK);
  const dernieres = items.slice(STACK);
  const expo = pickFeaturedExpo(expositions);

  return (
    <main>
      {/* En-tête : tient dans la hauteur de l'écran, quelle que soit la longueur du titre */}
      <section className="container-site flex min-h-svh flex-col justify-end pt-28 md:pt-32 pb-16 md:pb-24">
        <p className="t-label text-muted" data-reveal="fade">
          Artiste peintre · Fribourg
        </p>
        <h1 className="mt-6 max-w-[24ch] t-display text-ink text-balance" data-reveal="lines" data-delay="0.05">
          {homepage.hero.title}
        </h1>
        <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-6 items-end border-t border-line pt-6">
          {homepage.hero.subtitle ? (
            <p className="md:col-span-6 t-lead text-muted" data-reveal="fade" data-delay="0.45">
              {homepage.hero.subtitle}
            </p>
          ) : null}
          <div
            className="md:col-span-5 md:col-start-8 flex flex-wrap gap-x-8 gap-y-3 md:justify-end"
            data-reveal="fade"
            data-delay="0.6"
          >
            <ArrowLink href="/oeuvres">Les œuvres</ArrowLink>
            <ArrowLink href="/about">Le parcours</ArrowLink>
          </div>
        </div>
      </section>

      {selection.length ? (
        <section className="container-site pb-24 md:pb-36">
          <SectionHeading
            label="Sélection"
            title="À parcourir lentement"
            intro="Les dernières œuvres sorties de l’atelier. Cliquez sur une œuvre pour l’agrandir."
          />
          <div className="mt-10 md:mt-14">
            <ArtworkStack oeuvres={selection} />
          </div>
        </section>
      ) : null}

      <CtaBand cta={homepage.cta} />

      {dernieres.length ? (
        <section className="container-site pt-24 md:pt-36">
          <SectionHeading label="Observations" title="Dernières pièces">
            <ArrowLink href="/oeuvres">Toutes les œuvres</ArrowLink>
          </SectionHeading>
          <div className="mt-14 md:mt-20">
            <ArtworkGrid oeuvres={dernieres.slice(0, 4)} />
          </div>
          <Quote quote={homepage.quote} />
          <ArtworkGrid oeuvres={dernieres.slice(4)} />
        </section>
      ) : null}

      <div className="pt-24 md:pt-36">
        <ExploreLinks
          links={[
            expo ? { ...EXPLORE.expositions, text: `${expo.status === "past" ? "Dernière" : "Prochaine"} : ${expo.titre}` } : EXPLORE.expositions,
            EXPLORE.about,
          ]}
        />
      </div>
    </main>
  );
}
