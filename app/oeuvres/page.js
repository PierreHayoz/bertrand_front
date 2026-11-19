import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtworkCaption, ArtworkGrid, ArtworkImage } from "../components/Artwork";
import { EXPLORE, ExploreLinks, PageHeader } from "../components/ui";
import { getOeuvres } from "../lib/oeuvres";

export const metadata = {
  title: "Œuvres",
  description: "Toutes les œuvres de Bertrand Kolly, de la plus récente à la plus ancienne.",
};

const PAGE_SIZE = 24;

// Page 1 : l'œuvre en vedette + 24 ; pages suivantes : 24.
function sliceFor(page) {
  return page === 1
    ? { start: 0, limit: PAGE_SIZE + 1 }
    : { start: PAGE_SIZE + 1 + (page - 2) * PAGE_SIZE, limit: PAGE_SIZE };
}

export default async function OeuvresPage({ searchParams }) {
  const sp = await searchParams;
  const page = Math.max(1, Number.parseInt(sp?.page, 10) || 1);

  const { items, total } = await getOeuvres(sliceFor(page));
  const totalPages = Math.max(1, 1 + Math.ceil(Math.max(0, total - (PAGE_SIZE + 1)) / PAGE_SIZE));
  if (page > totalPages) notFound();

  const featured = page === 1 ? items[0] : null;
  const grid = page === 1 ? items.slice(1) : items;

  return (
    <main>
      <PageHeader
        label="Catalogue"
        title="Œuvres"
        intro="Acrylique, pastel à l'huile, sur toile ou sur papier. De la plus récente à la plus ancienne."
        aside={
          <p className="text-muted">
            <span className="block font-serif text-6xl text-ink tabular-nums">{total}</span>
            <span className="t-label">œuvres · page {page} / {totalPages}</span>
          </p>
        }
      />

      {featured ? (
        <section className="container-site pb-24 md:pb-36">
          <div className="border-t border-line pt-6 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-8 items-end">
            <div className="md:col-span-4 md:pb-2">
              <p className="t-label text-muted" data-reveal="fade">
                Dernière création
              </p>
              <h2 className="mt-4 t-h1 text-ink" data-reveal="lines">
                {featured.titre}
              </h2>
              <div data-reveal="fade" data-delay="0.3">
                <ArtworkCaption oeuvre={{ ...featured, titre: null }} className="mt-6" />
              </div>
            </div>
            <div className="md:col-span-7 md:col-start-6 flex md:justify-end">
              <div data-reveal="image" data-delay="0.15">
                <ArtworkImage
                  oeuvre={featured}
                  list={items}
                  priority
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className="w-auto! max-w-full"
                  imgClassName="max-h-[78vh] w-auto! max-w-full"
                />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="container-site pb-24 md:pb-36" aria-label={`Œuvres, page ${page}`}>
        <ArtworkGrid oeuvres={grid} />
        <Pagination page={page} totalPages={totalPages} />
      </section>

      <ExploreLinks links={[EXPLORE.expositions, EXPLORE.about]} />
    </main>
  );
}

function Pagination({ page, totalPages }) {
  if (totalPages < 2) return null;
  const href = (p) => (p === 1 ? "/oeuvres" : `/oeuvres?page=${p}`);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-20 md:mt-28 border-t border-line pt-6 flex items-center justify-between gap-6" aria-label="Pagination">
      {page > 1 ? (
        <Link href={href(page - 1)} className="t-label text-ink hover:text-muted" rel="prev">
          ← Plus récentes
        </Link>
      ) : (
        <span />
      )}
      <ol className="hidden sm:flex flex-wrap justify-center gap-1">
        {pages.map((p) => (
          <li key={p}>
            <Link
              href={href(p)}
              aria-current={p === page ? "page" : undefined}
              className={`grid h-9 w-9 place-items-center rounded-full text-sm tabular-nums transition-colors ${
                p === page ? "bg-ink text-bg" : "text-muted hover:text-ink hover:bg-surface"
              }`}
            >
              {p}
            </Link>
          </li>
        ))}
      </ol>
      {page < totalPages ? (
        <Link href={href(page + 1)} className="t-label text-ink hover:text-muted" rel="next">
          Plus anciennes →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
