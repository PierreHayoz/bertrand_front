import { fetchStrapi, getImageUrl } from "./strapi";

function mediaArray(field) {
  const data = field?.data ?? field ?? [];
  return Array.isArray(data) ? data : [];
}

function mediaAlt(m, fallback = "Image") {
  return m?.alternativeText ?? m?.attributes?.alternativeText ?? fallback;
}

function mediaCaption(m) {
  return m?.caption ?? m?.attributes?.caption ?? null;
}

export async function getExpositionBySlug(slug) {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!base) throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");

  const url =
    `${base}/api/expositions` +
    `?filters[slug][$eq]=${encodeURIComponent(slug)}` +
    `&populate=*`;

  const res = await fetchStrapi(url);
  const list = Array.isArray(res?.data) ? res.data : res?.data?.data ?? [];
  const e = list?.[0];
  if (!e) return null;

  const coverUrl = getImageUrl(e.couverture);
  const galleryMedia = mediaArray(e.galerie);

  const gallery = galleryMedia
    .map((m) => ({
      url: getImageUrl(m),
      alt: mediaAlt(m, e.titre ?? "Exposition"),
      caption: mediaCaption(m),
    }))
    .filter((x) => !!x.url);

  return {
    id: e.id,
    titre: e.titre ?? null,
    slug: e.slug ?? null,
    dateDebut: e.dateDebut ?? null,
    dateFin: e.dateFin ?? null,
    lieu: e.lieu ?? null,
    ville: e.ville ?? null,
    lien: e.lien ?? null,
    isHighlighted: e.miseEnAvant ?? false,

    // ✅ cover dédiée
    coverUrl: coverUrl ?? null,
    coverAlt: e.coverAlt ?? (e.titre ?? "Exposition"),
    coverCaption: e.coverCaption ?? null,

    // ✅ galerie
    gallery,

    description: e.description ?? [],
  };
}
export async function getExpositions() {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!base) throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");

  const url =
    `${base}/api/expositions` +
    `?sort[0]=dateDebut:desc` +
    `&populate=*`;

  const res = await fetchStrapi(url);
  const list = Array.isArray(res?.data) ? res.data : res?.data?.data ?? [];
  if (!Array.isArray(list)) return [];

  return list.map((e) => ({
    id: e.id,
    titre: e.titre ?? null,
    slug: e.slug ?? null,
    dateDebut: e.dateDebut ?? null,
    dateFin: e.dateFin ?? null,
    lieu: e.lieu ?? null,
    ville: e.ville ?? null,
    lien: e.lien ?? null,
    isHighlighted: e.miseEnAvant ?? false,

    // ✅ cover pour les cards
    coverUrl: getImageUrl(e.couverture) ?? null,
    coverAlt: e.coverAlt ?? (e.titre ?? "Exposition"),
  }));
}
