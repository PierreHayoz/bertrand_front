import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getExpositionBySlug } from "../../lib/expositions";
import BlocksRenderer from "../../components/BlocksRenderer";
import ExpoGalleryCarousel from "@/app/components/ExpoGalleryCarousel";
import ExploreCta from "@/app/components/ExploreCTA";

function toDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDateRange(debut, fin) {
  const d1 = toDate(debut);
  if (!d1) return "";
  const f1 = d1.toLocaleDateString("fr-CH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const d2 = toDate(fin);
  if (!d2) return f1;

  const f2 = d2.toLocaleDateString("fr-CH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `${f1} — ${f2}`;
}

function getStatus(expo, now = new Date()) {
  const start = toDate(expo.dateDebut);
  const end = toDate(expo.dateFin);

  if (!start) return "unknown";

  const s = new Date(start);
  s.setHours(0, 0, 0, 0);

  if (end) {
    const e = new Date(end);
    e.setHours(23, 59, 59, 999);
    if (now < s) return "upcoming";
    if (now >= s && now <= e) return "current";
    return "past";
  }

  // pas de fin : "en cours" seulement le jour du début
  const sEnd = new Date(start);
  sEnd.setHours(23, 59, 59, 999);
  if (now < s) return "upcoming";
  if (now >= s && now <= sEnd) return "current";
  return "past";
}

function StatusPill({ status }) {
  const label =
    status === "current"
      ? "En cours"
      : status === "upcoming"
        ? "À venir"
        : status === "past"
          ? "Passée"
          : "—";

  const cls =
    status === "current"
      ? "border-stone-600 text-stone-200"
      : status === "upcoming"
        ? "border-stone-700 text-stone-300"
        : "border-stone-800 text-stone-500";

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${cls}`}>
      {label}
    </span>
  );
}


function InfoPanel({ expo, dates, place, status }) {
  // champs optionnels : adapte selon ton Strapi (commissaire, organisation, etc.)
  const infos = [
    dates ? { label: "Dates", value: dates } : null,
    place ? { label: "Lieu", value: place } : null,
    expo.organisateur ? { label: "Organisation", value: expo.organisateur } : null,
    expo.commissaire ? { label: "Commissariat", value: expo.commissaire } : null,
    expo.participants ? { label: "Participants", value: expo.participants } : null,
  ].filter(Boolean);

  return (
    <aside className="md:col-span-4 md:col-start-9">
      <div className="rounded-2xl border border-stone-900/80 p-6   sticky top-32">
        <div className="flex items-center justify-between gap-4">
          <div className="text-xs tracking-[0.2em] uppercase text-stone-500">
            Infos
          </div>
          <StatusPill status={status} />
        </div>

        <div className="mt-6 space-y-5">
          {infos.map((it) => (
            <div key={it.label}>
              <div className="text-sm text-stone-500">{it.label}</div>
              <div className="mt-1 text-stone-200">{it.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          

          {expo.lien ? (
            <a
              href={expo.lien}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-stone-700 px-4 py-2 text-stone-200 hover:bg-stone-200 hover:text-stone-950 transition-colors"
            >
              Infos ↗
            </a>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

export default async function Page({ params }) {
  const { slug } = await params; // ✅ unwrap

  const expo = await getExpositionBySlug(slug);
  if (!expo) return notFound();

  const place = [expo.lieu, expo.ville, expo.pays].filter(Boolean).join(", ");
  const dates = formatDateRange(expo.dateDebut, expo.dateFin);
  const status = getStatus(expo);

  return (
    <main className="bg-stone-950 text-stone-200 min-h-screen">
      <div className="mx-auto max-w-7xl px-8 md:px-16 pt-32 md:pt-44  pb-16 md:pb-24">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/expositions"
            className="text-xs tracking-[0.2em] uppercase text-stone-500 hover:text-stone-300 transition-colors"
          >
            ← Retour aux expositions
          </Link>
        </div>

        {/* Header */}
        <header className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-xs tracking-[0.2em] uppercase text-stone-500">
              Exposition
            </div>
            <StatusPill status={status} />
          </div>

          <h1 className="mt-4 text-3xl md:text-5xl font-light leading-[1.05] text-stone-200">
            {expo.titre}
          </h1>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-stone-400">
            {dates ? (
              <span className="rounded-full border border-stone-800 px-3 py-1">
                {dates}
              </span>
            ) : null}
            {place ? (
              <span className="rounded-full border border-stone-800 px-3 py-1">
                {place}
              </span>
            ) : null}
          </div>

          {expo.chapo ? (
            <p className="mt-6 text-stone-400 leading-7 max-w-3xl">
              {expo.chapo}
            </p>
          ) : null}
        </header>

        {/* Hero image */}
        {expo.coverUrl ? (
          <section className="mt-12 md:mt-16 border-t border-stone-900/80 pt-10 md:pt-14">
            <div className="max-w-6xl">
              <div className="rounded-2xl border border-stone-900/80 overflow-hidden">
                <div className="relative w-full h-[500px] bg-stone-950">
                  <Image
                    src={expo.coverUrl}
                    alt={expo.coverAlt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 1200px"
                    priority
                  />
                </div>
              </div>

              {expo.imageCaption ? (
                <div className="mt-3 text-sm text-stone-500">
                  {expo.imageCaption}
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {/* Texte + panneau infos */}
        <section className="mt-12 md:mt-16 border-t border-stone-900/80 pt-10 md:pt-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* marge gauche */}
            <div className="hidden md:block md:col-span-2">
              <div className="text-xs tracking-[0.2em] uppercase text-stone-500">
                Texte
              </div>
            </div>

            {/* texte principal */}
            <div className="md:col-span-6">
              <div className="prose prose-invert prose-stone max-w-none prose-p:leading-7 prose-strong:text-stone-200 prose-a:text-stone-200 hover:prose-a:text-white">
                <BlocksRenderer blocks={expo.description} />
              </div>
            </div>

            {/* sidebar infos */}
            <InfoPanel expo={expo} dates={dates} place={place} status={status} />
          </div>
        </section>

        {/* Galerie */}
        <ExpoGalleryCarousel images={expo.gallery} />

        {/* CTA bas de page */}
 
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