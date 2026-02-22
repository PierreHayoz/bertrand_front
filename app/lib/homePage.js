import { fetchStrapi, getImageUrl } from "./strapi";

export async function getHomepage() {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!base) throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");

  // Strapi v5: populate ok comme ça, et ton endpoint répond déjà 200
  const url =
    `${base}/api/homepage` +
    `?publicationState=preview` +
    `&populate[Hero]=*` +
    `&populate[ctaBlock]=*` +
    `&populate[citation]=*` +
    `&populate[firstSelectionOeuvres][populate]=Image` +
    `&populate[secondSelectionOeuvres][populate]=Image`;


  const res = await fetchStrapi(url);

  // ✅ Strapi v5: champs DIRECTEMENT dans res.data
  const h = res?.data;
  if (!h) return null;
console.log("RAW h.citation =", h.citation);
  return {
    hero: {
      title: h.Hero?.title ?? null,
      subtitle: h.Hero?.subtitle ?? null,
    },

    cta: {
      title: h.ctaBlock?.title ?? null,
      text: h.ctaBlock?.text ?? null,
      label: h.ctaBlock?.ctaLabel ?? null,
      url: h.ctaBlock?.ctaUrl ?? null,
    },

    firstSelection: mapOeuvres(h.firstSelectionOeuvres),
    secondSelection: mapOeuvres(h.secondSelectionOeuvres),

    citation: {
    text: h.citation?.citation ?? null,
    auteur: h.citation?.auteur ?? null,
  },
  };
}

/* ---------- helpers ---------- */

/**
 * Strapi v5 relation: généralement un array d'items directement (pas {data:{attributes}})
 */
function mapOeuvres(items) {
  if (!Array.isArray(items)) return [];

  return items.map((o) => ({
    id: o?.id ?? null,
    titre: o?.Titre ?? null,
    format: o?.Format ?? null,
    numero: o?.numero ?? null,
    date: o?.date ?? null,
    imageUrl: getImageUrl(o?.Image),
    imageAlt: o?.Image?.alternativeText ?? null,
  }));
}
