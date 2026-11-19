import { cache } from "react";
import { populateMedia, strapi, toImage } from "./strapi";
import { getExpoStatus, toDate } from "./utils";

function mapExposition(e) {
  const titre = e.titre ?? "Exposition";
  return {
    id: e.documentId,
    titre,
    slug: e.slug,
    dateDebut: e.dateDebut ?? null,
    dateFin: e.dateFin ?? null,
    lieu: e.lieu ?? null,
    ville: e.ville ?? null,
    lien: e.lien ?? null,
    cover: toImage(e.couverture, `Affiche : ${titre}`),
    gallery: (e.galerie ?? []).map((m) => toImage(m, titre)).filter(Boolean),
    description: e.description ?? [],
    status: getExpoStatus(e),
  };
}

export const getExpositions = cache(async () => {
  const json = await strapi(`/expositions?sort[0]=dateDebut:desc&${populateMedia("couverture")}`);
  return (json?.data ?? []).map(mapExposition);
});

export const getExpositionBySlug = cache(async (slug) => {
  const json = await strapi(
    `/expositions?filters[slug][$eq]=${encodeURIComponent(slug)}&${populateMedia("couverture")}&${populateMedia("galerie")}`
  );
  const e = json?.data?.[0];
  return e ? mapExposition(e) : null;
});

/** Exposition en cours ou la prochaine ; à défaut la plus récente. */
export function pickFeaturedExpo(expos) {
  const live = expos
    .filter((e) => e.status === "current" || e.status === "upcoming")
    .sort((a, b) => toDate(a.dateDebut) - toDate(b.dateDebut));
  return live[0] ?? expos.find((e) => e.status === "past") ?? null;
}
