import { ArtworkGrid } from "../components/Artwork";
import Reveal from "../components/Reveal";
import { PageHeader } from "../components/ui";
import { getOeuvres } from "../lib/oeuvres";

export const metadata = {
  title: "Œuvres",
  description: "Toutes les œuvres de Bertrand Kolly, de la plus récente à la plus ancienne.",
};

export default async function OeuvresPage() {
  const oeuvres = (await getOeuvres()) ?? [];

  // Regroupement par année (les œuvres arrivent déjà triées, plus récentes d'abord)
  const byYear = [];
  for (const o of oeuvres) {
    const year = o.year ?? "Sans date";
    const last = byYear[byYear.length - 1];
    if (last?.year === year) last.items.push(o);
    else byYear.push({ year, items: [o] });
  }

  return (
    <main className="pb-24 md:pb-36">
      <PageHeader
        label="Catalogue"
        title="Œuvres"
        intro="Acrylique, pastel à l'huile, sur toile ou sur papier. De la plus récente à la plus ancienne ; cliquez sur une œuvre pour l'agrandir."
        aside={
          <div className="space-y-2">
            <p className="font-serif text-6xl text-ink tabular-nums">{oeuvres.length}</p>
            <p className="t-label">œuvres</p>
          </div>
        }
      />

      <nav className="container-site sticky top-16 md:top-20 z-20 bg-bg/90 backdrop-blur-md border-y border-line" aria-label="Années">
        <ul className="flex gap-6 overflow-x-auto py-3 text-sm">
          {byYear.map(({ year, items }) => (
            <li key={year} className="shrink-0">
              <a href={`#annee-${year}`} className="text-muted hover:text-ink transition-colors">
                {year} <span className="text-faint tabular-nums">({items.length})</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {byYear.map(({ year, items }) => (
        <section key={year} id={`annee-${year}`} className="container-site pt-16 md:pt-24 scroll-mt-32">
          <Reveal className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10 md:mb-14">
            <h2 className="md:col-span-3 t-h1 text-ink tabular-nums">{year}</h2>
            <p className="md:col-span-9 self-end text-muted">
              {items.length} œuvre{items.length > 1 ? "s" : ""}
            </p>
          </Reveal>
          <ArtworkGrid oeuvres={items} cols="columns-2 md:columns-3 lg:columns-4" sizes="(max-width: 768px) 50vw, 25vw" />
        </section>
      ))}

      {oeuvres.length === 0 ? (
        <p className="container-site text-muted">Aucune œuvre pour le moment.</p>
      ) : null}
    </main>
  );
}
