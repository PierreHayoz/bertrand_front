import Link from "next/link";
import { getExpositions } from "../lib/expositions";
import ExploreCta from "../components/ExploreCTA";
import { ArrowRight } from "lucide-react";
import PageHeaderAnimated from "../components/PageHeaderAnimated";
import Reveal from "../components/Reveal";

// Helpers dates (évite les surprises)
function toDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}
function toPlainText(node) {
  if (!node) return "";

  if (typeof node === "string" || typeof node === "number") return String(node);

  if (Array.isArray(node)) {
    return node
      .map(toPlainText)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  }

  if (typeof node === "object") {
    if ("text" in node) return toPlainText(node.text);
    if ("children" in node) return toPlainText(node.children);
    return Object.values(node)
      .map(toPlainText)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  }

  return "";
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function getStatus(expo, now = new Date()) {
  const start = toDate(expo.dateDebut);
  const end = toDate(expo.dateFin);

  if (!start) return { key: "unknown" };

  const n = now;
  const s = startOfDay(start);

  if (end) {
    const e = endOfDay(end);
    if (n < s) return { key: "upcoming" };
    if (n >= s && n <= e) return { key: "current" };
    return { key: "past" };
  }

  // Si pas de dateFin : on considère "en cours" seulement le jour du début
  const sEnd = endOfDay(start);
  if (n < s) return { key: "upcoming" };
  if (n >= s && n <= sEnd) return { key: "current" };
  return { key: "past" };
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

export default async function Page() {
  const expositions = (await getExpositions()) ?? [];

  // Tri : d'abord les plus proches/actuelles, puis passées par date desc
  const now = new Date();

  const withStatus = expositions
    .map((e) => ({ expo: e, status: getStatus(e, now) }))
    .sort((a, b) => {
      const aStart = toDate(a.expo.dateDebut)?.getTime() ?? 0;
      const bStart = toDate(b.expo.dateDebut)?.getTime() ?? 0;

      const order = (k) =>
        k === "current" ? 0 : k === "upcoming" ? 1 : k === "past" ? 2 : 3;

      const oa = order(a.status.key);
      const ob = order(b.status.key);

      if (oa !== ob) return oa - ob;

      // upcoming: plus proche d'abord
      if (a.status.key === "upcoming") return aStart - bStart;
      // current: plus récent d'abord
      if (a.status.key === "current") return bStart - aStart;
      // past: plus récent d'abord
      return bStart - aStart;
    });

  const currentOrUpcoming = withStatus.filter(
    (x) => x.status.key === "current" || x.status.key === "upcoming"
  );
  const past = withStatus.filter((x) => x.status.key === "past");

  return (
    <main className="bg-stone-950 text-stone-200">
      <div className="mx-auto max-w-7xl px-8 md:px-16 pt-32 md:pt-44 pb-16 md:pb-24">
        {/* Header */}
        <PageHeaderAnimated
          eyebrow="Agenda"
          title="Expositions"
          description="Expositions en cours, à venir, et archives."
        />

        {/* À venir / En cours */}
        <Reveal delay={0.3}>
          <section className="mt-12 md:mt-16 border-t border-stone-900/80 pt-10 md:pt-14">
            <div className="flex items-end justify-between gap-6">
              <div>
                <div className="text-xs tracking-[0.2em] uppercase text-stone-500">
                  Sélection
                </div>
                <h2 className="mt-2 text-xl md:text-2xl font-light text-stone-200">
                  En cours & à venir
                </h2>
              </div>
              <div className="hidden md:block text-stone-500 text-sm">
                {currentOrUpcoming.length} exposition
                {currentOrUpcoming.length > 1 ? "s" : ""}
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {currentOrUpcoming.length ? (
                currentOrUpcoming.map(({ expo, status }) => (
                  <ExpoCard key={expo.id} expo={expo} status={status.key} />
                ))
              ) : (
                <div className="rounded-2xl border border-stone-900/80 p-6 text-stone-400">
                  Aucune exposition annoncée pour le moment.
                </div>
              )}
            </div>
          </section>
        </Reveal>
        {/* Passées */}
        <Reveal delay={0.3}>
          <section className="mt-12 md:mt-16 border-t border-stone-900/80 pt-10 md:pt-14">
            <div className="flex items-end justify-between gap-6">
              <div>
                <div className="text-xs tracking-[0.2em] uppercase text-stone-500">
                  Archive
                </div>
                <h2 className="mt-2 text-xl md:text-2xl font-light text-stone-200">
                  Passées
                </h2>
              </div>
              <div className="hidden md:block text-stone-500 text-sm">
                {past.length} exposition{past.length > 1 ? "s" : ""}
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {past.length ? (
                past.map(({ expo, status }) => (
                  <ExpoCard key={expo.id} expo={expo} status={status.key} />
                ))
              ) : (
                <div className="rounded-2xl border border-stone-900/80 p-6 text-stone-400">
                  Pas d’archives pour l’instant.
                </div>
              )}
            </div>
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

function StatusPill({ status }) {
  const label =
    status === "current" ? "En cours" : status === "upcoming" ? "À venir" : "Passée";

  const cls =
    status === "current"
      ? "border-stone-500 text-stone-200"
      : status === "upcoming"
        ? "border-stone-500 text-stone-200"
        : "border-stone-500 text-stone-500";

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${cls}`}>
      {label}
    </span>
  );
}

function ExpoCard({ expo, status }) {
  const place = [expo.lieu, expo.ville, expo.pays].filter(Boolean).join(", ");
  const dates = formatDateRange(expo.dateDebut, expo.dateFin);

  const href = expo.slug ? `/expositions/${expo.slug}` : null;
  const desc = toPlainText(expo.description);

  const CardContent = (
    <div className="rounded-2xl border group border-stone-900/80 relative overflow-hidden hover:border-stone-700 transition-colors">

      {/* overlay */}
      <div className="absolute w-full h-full bg-stone-200 mix-blend-difference  top-full group-hover:top-0 duration-500 z-10"></div>

      {/* content */}
      <div className="relative p-5 md:p-6 flex items-center justify-between gap-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-lg md:text-xl font-light text-stone-200 transition-colors duration-300 truncate">
              {expo.titre}
            </div>

            <StatusPill status={status} />
          </div>

          <div className="mt-3 text-sm text-stone-400 ">
            {dates ? <span>{dates}</span> : null}
            {place ? <span className="text-stone-600"> · </span> : null}
            {place ? <span>{place}</span> : null}
          </div>

          {desc ? (
            <p className="mt-4 text-stone-400 leading-6 line-clamp-2">
              {desc}
            </p>
          ) : null}
        </div>

        <div className="shrink-0">
          {href ? (
            <div className="flex justify-end">
              <div
                className="
                relative overflow-hidden
                px-3 py-1
                border border-stone-600
                rounded-full
                flex items-center
                w-fit
                transition-all duration-300
                group-hover:pr-8
              "
              >
                <span>voir en détail</span>

                <ArrowRight
                  size={14}
                  className="
                  absolute right-3
                  opacity-0
                  translate-x-[-6px]
                  transition-all duration-300 ease-out
                  group-hover:opacity-100
                  group-hover:translate-x-0
                "
                />
              </div>
            </div>
          ) : expo.lien ? (
            <a
              href={expo.lien}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-stone-300 hover:text-stone-200 underline underline-offset-4"
            >
              Infos
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{CardContent}</Link>;
  }

  return CardContent;
}
