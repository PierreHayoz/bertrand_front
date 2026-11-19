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
    `?populate[hero]=*` +
    `&populate[appelAction]=*` +
    `&populate[citation]=*` +
    `&populate[selection][populate]=image` +
    `&populate[observations][populate]=image`;


  const res = await fetchStrapi(url);

  // ✅ Strapi v5: champs DIRECTEMENT dans res.data
  const h = res?.data;
  if (!h) return null;
  return {
    hero: {
      title: h.hero?.titre ?? null,
      subtitle: h.hero?.sousTitre ?? null,
    },

    cta: {
      title: h.appelAction?.titre ?? null,
      text: h.appelAction?.texte ?? null,
      label: h.appelAction?.libelleBouton ?? null,
      url: h.appelAction?.lienBouton ?? null,
    },

    firstSelection: mapOeuvres(h.selection),
    secondSelection: mapOeuvres(h.observations),

    citation: {
    text: h.citation?.texte ?? null,
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
    titre: o?.titre ?? null,
    format: o?.format ?? null,
    numero: o?.numero ?? null,
    date: o?.date ?? null,
    imageUrl: toAbsoluteUrl(o?.image?.formats?.small?.url ?? o?.image?.url),
    imageUrlModal: toAbsoluteUrl(o?.image?.formats?.medium?.url ?? o?.image?.url),
    imageAlt: o?.image?.alternativeText ?? null,
  }));
}
