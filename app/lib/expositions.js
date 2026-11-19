import { fetchStrapi, toImage } from "./strapi";

function mapExposition(e) {
  const titre = e.titre ?? null;
  return {
    id: e.documentId ?? e.id,
    titre,
    slug: e.slug ?? null,
    dateDebut: e.dateDebut ?? null,
    dateFin: e.dateFin ?? null,
    lieu: e.lieu ?? null,
    ville: e.ville ?? null,
    lien: e.lien ?? null,
    isHighlighted: e.miseEnAvant ?? false,
    cover: toImage(e.couverture, titre ? `Affiche : ${titre}` : "Affiche de l'exposition"),
    gallery: (Array.isArray(e.galerie) ? e.galerie : [])
      .map((m) => toImage(m, titre ?? "Exposition"))
      .filter(Boolean),
    description: e.description ?? [],
  };
}

export async function getExpositionBySlug(slug) {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!base) throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");

  const res = await fetchStrapi(
    `${base}/api/expositions?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
  );
  const e = Array.isArray(res?.data) ? res.data[0] : null;
  return e ? mapExposition(e) : null;
}

export async function getExpositions() {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!base) throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");

  const res = await fetchStrapi(`${base}/api/expositions?sort[0]=dateDebut:desc&populate=*`);
  return (Array.isArray(res?.data) ? res.data : []).map(mapExposition);
}
