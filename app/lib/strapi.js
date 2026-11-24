import "server-only";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

/** Tag de cache commun à tout le contenu Strapi (invalidé par /api/revalidate). */
export const STRAPI_TAG = "strapi";

/**
 * Requête Strapi mise en cache : rafraîchie au plus toutes les 5 minutes,
 * et immédiatement quand Strapi appelle le webhook /api/revalidate.
 */
export async function strapi(path) {
  if (!STRAPI_URL) throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");

  const res = await fetch(`${STRAPI_URL}/api${path}`, {
    next: { revalidate: 300, tags: [STRAPI_TAG] },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Strapi ${res.status} on ${path}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

function absolute(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
}

/** Champs utiles d'un média (évite de rapatrier toutes les métadonnées). */
export const MEDIA_FIELDS = ["url", "width", "height", "formats", "alternativeText"]
  .map((f, i) => `[fields][${i}]=${f}`);

export function populateMedia(name) {
  return MEDIA_FIELDS.map((f) => `populate[${name}]${f}`).join("&");
}

/**
 * Média Strapi -> image pour next/image, proportions réelles conservées.
 * `src` sert aux vignettes, `srcLarge` à la visionneuse et aux grands visuels.
 */
export function toImage(media, fallbackAlt = "") {
  if (!media?.url) return null;
  const f = media.formats ?? {};
  return {
    src: absolute((f.medium ?? f.small ?? media).url),
    srcLarge: absolute((f.large ?? f.medium ?? media).url),
    width: media.width ?? 1000,
    height: media.height ?? 1000,
    alt: media.alternativeText || fallbackAlt,
  };
}
