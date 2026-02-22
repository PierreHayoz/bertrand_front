import Hero from "./components/Hero";
import ObservationsCardsList from "./components/ObservationsCardsList";
import Separation from "./components/Separation";
import StickyCardsList from "./components/StickyCardsList";
import SectionHeader from "./components/SectionHeader";
import { getHomepage } from "./lib/homePage";
import { getExpositions } from "./lib/expositions";
import ExploreCta from "./components/ExploreCTA";
import Reveal from "./components/Reveal";
function toDate(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function pickNextExpo(expos = []) {
  const now = new Date();
  const list = (expos ?? [])
    .map((e) => ({ ...e, start: toDate(e.dateDebut), end: toDate(e.dateFin) }))
    .filter((e) => e.start);

  // en cours ou à venir
  return (
    list
      .filter((e) => (e.end ? now <= e.end : now <= e.start))
      .sort((a, b) => a.start - b.start)[0] ?? null
  );
}
export default async function Home() {
  const homepage = await getHomepage();
  const expositions = await getExpositions();
  const nextExpo = pickNextExpo(expositions);

  return (
    <main className="bg-stone-950 text-stone-200 pb-10 md:pb-24">
      <div className="mx-auto max-w-7xl px-8 md:px-16">
        <section className="pt-32 md:pt-44 pb-14 md:pb-24">
          <Hero title={homepage.hero.title} subtitle={homepage.hero.subtitle} />
        </section>

        {/* Sticky selection */}
        <section className="pb-20 md:pb-28">
          <Reveal delay={0.3}>
            <SectionHeader
              eyebrow="Sélection"
              title="À parcourir lentement"
              description="Une série d’œuvres mises en avant — cliquez pour ouvrir la fiche."
              align="left"
            />
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 md:mt-14 border-t border-stone-900/80 pt-10">
              <StickyCardsList oeuvres={homepage.firstSelection} />
            </div>
          </Reveal>
        </section>

        {/* CTA / séparation */}
        <section className="pb-20 md:pb-28">
          <Reveal >
            <Separation separation={homepage.cta} />
          </Reveal>
        </section>

        {/* Observations */}
        <section className="pb-20 md:pb-28">
          <SectionHeader
            eyebrow="Observations"
            title="Dernières pièces"
            description="Triées du plus récent au plus ancien. Une citation apparaît comme interlude."
            align="right"
          />
          <div className="mt-10 md:mt-14">
            <ObservationsCardsList
              oeuvres={homepage.secondSelection}
              citation={homepage.citation}
            />
          </div>
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
