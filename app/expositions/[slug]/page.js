import Image from "next/image";
import { notFound } from "next/navigation";
import BlocksRenderer from "../../components/BlocksRenderer";
import Gallery from "../../components/Gallery";
import TransitionLink from "../../components/TransitionLink";
import { ArrowLink, EXPLORE, ExploreLinks, StatusLabel } from "../../components/ui";
import { getExpositionBySlug, getExpositions } from "../../lib/expositions";
import { formatDateRange, place, toPlainText } from "../../lib/utils";

export async function generateStaticParams() {
  return (await getExpositions()).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const expo = await getExpositionBySlug(slug);
  if (!expo) return {};
  return {
    title: expo.titre,
    description: `${formatDateRange(expo.dateDebut, expo.dateFin)}, ${place(expo)}. ${toPlainText(expo.description).slice(0, 140)}`,
    openGraph: expo.cover ? { images: [{ url: expo.cover.srcLarge, width: expo.cover.width, height: expo.cover.height }] } : undefined,
  };
}

export default async function ExpositionPage({ params }) {
  const { slug } = await params;
  const expo = await getExpositionBySlug(slug);
  if (!expo) notFound();

  const infos = [
    { label: "Dates", value: formatDateRange(expo.dateDebut, expo.dateFin) },
    { label: "Lieu", value: expo.lieu },
    { label: "Ville", value: expo.ville },
  ].filter((i) => i.value);

  return (
    <main>
      <div className="container-site pt-32 md:pt-44">
        <TransitionLink href="/expositions" className="t-label text-muted hover:text-ink transition-colors">
          ← Toutes les expositions
        </TransitionLink>
      </div>

      <article className="container-site mt-10 md:mt-14 pb-24 md:pb-36 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-12">
        <header className="intro md:col-span-7 md:col-start-6 md:row-start-1">
          <StatusLabel status={expo.status} />
          <h1 className="mt-5 t-h1 text-ink text-balance">{expo.titre}</h1>
        </header>

        {expo.cover ? (
          <figure className="md:col-span-4 md:row-span-3 md:row-start-1 md:sticky md:top-28 self-start bg-surface">
            <Image
              src={expo.cover.srcLarge}
              width={expo.cover.width}
              height={expo.cover.height}
              alt={expo.cover.alt}
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
              className="h-auto w-full"
            />
          </figure>
        ) : null}

        <dl className="reveal md:col-span-7 md:col-start-6 grid grid-cols-1 sm:grid-cols-3 gap-6 border-y border-line py-6">
          {infos.map((it) => (
            <div key={it.label}>
              <dt className="t-label text-muted">{it.label}</dt>
              <dd className="mt-2 text-ink">{it.value}</dd>
            </div>
          ))}
        </dl>

        <div className="reveal md:col-span-6 md:col-start-6">
          <BlocksRenderer blocks={expo.description} />
          {expo.lien ? <ArrowLink href={expo.lien} className="mt-10">Plus d’informations</ArrowLink> : null}
        </div>
      </article>

      <Gallery images={expo.gallery} label="Exposition" title="Images" />

      <ExploreLinks links={[EXPLORE.oeuvres, EXPLORE.expositions]} />
    </main>
  );
}
