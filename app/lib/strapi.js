const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

/**
 * Fetch Strapi + JSON + erreurs explicites
 */
export async function fetchStrapi(url) {
  if (!STRAPI_URL) throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");

  const res = await fetch(url, { next: { revalidate: 0 } });
  const text = await res.text();

  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (e) {
    console.error("Strapi JSON parse error:", e);
  }

  if (!res.ok) {
    const msg = json?.error?.message || text?.slice(0, 200) || `Request failed: ${res.status}`;
    throw new Error(`Strapi error (${res.status}): ${msg}`);
  }

  return json;
}

function absolute(url) {
  if (!url || !STRAPI_URL) return null;
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
}

export function getImageUrl(image, format = "small") {
  if (!image) return null;
  return absolute(image?.formats?.[format]?.url ?? image?.url ?? null);
}

/**
 * Média Strapi -> image prête pour next/image, en conservant les proportions réelles.
 * `src` = format courant (grilles), `srcLarge` = grand format (visionneuse, couvertures).
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
