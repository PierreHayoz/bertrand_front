const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

/**
 * Fetch Strapi + JSON + erreurs explicites
 */
export async function fetchStrapi(url) {
  if (!STRAPI_URL) throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");

  const res = await fetch(url, { next: { revalidate: 3600 } });
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


export function getImageUrl(image, format = "small") {
  if (!STRAPI_URL || !image) return null;

  const formatted = image?.formats?.[format]?.url ?? null;
  const rel = formatted ?? image?.url ?? null;

  if (!rel) return null;
  return rel.startsWith("http") ? rel : `${STRAPI_URL}${rel}`;
}