import { fetchStrapi } from "./strapi";
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
function toAbsoluteUrl(url) {
  if (!url || !STRAPI_URL) return null;
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
}
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
    imageUrl: toAbsoluteUrl(o?.Image?.formats?.small?.url ?? o?.Image?.url),
    imageUrlModal: toAbsoluteUrl(o?.Image?.formats?.medium?.url ?? o?.Image?.url),
    imageAlt: o?.Image?.alternativeText ?? null,
  }));
}
