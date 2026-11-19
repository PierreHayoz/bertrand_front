import Image from "next/image";
import { notFound } from "next/navigation";
import BlocksRenderer from "../../components/BlocksRenderer";
import Gallery from "../../components/Gallery";
import Reveal from "../../components/Reveal";
import TransitionLink from "../../components/TransitionLink";
import { ArrowLink, StatusLabel } from "../../components/ui";
import { getExpositionBySlug } from "../../lib/expositions";
import { formatDateRange, getExpoStatus, place, toPlainText } from "../../lib/utils";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const expo = await getExpositionBySlug(slug);
  if (!expo) return {};
  return {
    title: expo.titre,
    description: `${formatDateRange(expo.dateDebut, expo.dateFin)}, ${place(expo)}. ${toPlainText(expo.description).slice(0, 140)}`,
  };
}

export default async function ExpositionPage({ params }) {
  const { slug } = await params;
  const expo = await getExpositionBySlug(slug);
  if (!expo) notFound();

  const status = getExpoStatus(expo);
  const infos = [
    { label: "Dates", value: formatDateRange(expo.dateDebut, expo.dateFin) },
    { label: "Lieu", value: expo.lieu },
    { label: "Ville", value: expo.ville },
  ].filter((i) => i.value);

  return (
    <main className="pb-24 md:pb-36">
      <div className="container-site pt-32 md:pt-44">
        <TransitionLink href="/expositions" className="t-label text-muted hover:text-ink transition-colors">
          ← Toutes les expositions
        </TransitionLink>
      </div>

      <article className="container-site mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-12">
        <header className="md:col-span-7 md:col-start-6 md:row-start-1">
          <Reveal>
            <StatusLabel status={status} />
            <h1 className="mt-5 t-h1 text-ink text-balance">{expo.titre}</h1>
          </Reveal>
        </header>

        {expo.cover ? (
          <div className="md:col-span-4 md:row-span-3 md:row-start-1">
            <Reveal className="md:sticky md:top-28">
              <figure className="bg-surface">
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
            </Reveal>
          </div>
        ) : null}

        <Reveal className="md:col-span-7 md:col-start-6">
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-y border-line py-6">
            {infos.map((it) => (
              <div key={it.label}>
                <dt className="t-label text-muted">{it.label}</dt>
                <dd className="mt-2 text-ink">{it.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="md:col-span-6 md:col-start-6">
          <BlocksRenderer blocks={expo.description} />
          {expo.lien ? <ArrowLink href={expo.lien} className="mt-10">Plus d’informations</ArrowLink> : null}
        </Reveal>
      </article>

      <div className="mt-24 md:mt-36">
        <Gallery images={expo.gallery} label="Exposition" title="Images" />
      </div>
    </main>
  );
}
