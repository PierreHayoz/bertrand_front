import OeuvresLayout from "../components/OeuvresLayout";
import { getOeuvres } from "../lib/oeuvres";
import { getExpositions } from "../lib/expositions";
import { Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import GridSkeleton from "./GridSkeleton";

const PAGE_SIZE = 24;
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});
export default async function Page({ searchParams }) {
  const oeuvres = (await getOeuvres()) ?? [];
  const expositions = (await getExpositions()) ?? [];

  // ✅ Next.js 15: searchParams est une Promise -> on await avant d'accéder aux props
  const sp = await searchParams;

  const pageRaw = Array.isArray(sp?.page) ? sp.page[0] : sp?.page;
  const page = Math.max(1, Number(pageRaw ?? 1) || 1);

  const sorted = oeuvres
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const start = (page - 1) * PAGE_SIZE;
  const pageItems = sorted.slice(start, start + PAGE_SIZE);

  // featured seulement sur page 1
  const latest = page === 1 ? pageItems[0] ?? null : null;
  const rest = page === 1 ? pageItems.slice(1) : pageItems;

  const nextExpo = pickNextExpo(expositions);

  return (
  <OeuvresLayout
    latest={latest}
    rest={rest}
    total={total}
    page={page}
    totalPages={totalPages}
    nextExpo={nextExpo}
  />
  );
}

function toDate(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function pickNextExpo(expos = []) {
  const now = new Date();
  const valid = expos
    .map((e) => ({ ...e, start: toDate(e.dateDebut), end: toDate(e.dateFin) }))
    .filter((e) => e.start);

  // en cours ou à venir
  return (
    valid
      .filter((e) => (e.end ? now <= e.end : now <= e.start))
      .sort((a, b) => a.start - b.start)[0] ?? null
  );
}
