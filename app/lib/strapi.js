const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

/**
 * Fetch Strapi + JSON + erreurs explicites
 */
export async function fetchStrapi(url) {
  if (!STRAPI_URL) throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");

  const res = await fetch(url, { cache: "no-store" });
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

export function getImageUrl(image) {
  if (!STRAPI_URL || !image) return null;

  const rel = image?.url ?? image?.data?.url ?? null;
  if (!rel) return null;

  return rel.startsWith("http") ? rel : `${STRAPI_URL}${rel}`;
}
