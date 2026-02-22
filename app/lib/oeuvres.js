const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

function toAbsoluteUrl(url) {
  if (!url || !STRAPI_URL) return null;
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
}

function mapOeuvre(o) {
  return {
    id: o.id,
    titre: o.Titre ?? null,
    format: o.Format ?? null,
    numero: o.numero ?? null,
    date: o.date ?? null,
    imageUrl: toAbsoluteUrl(o.Image?.url),
    imageAlt: o.Image?.alternativeText ?? null,
  };
}

export async function getOeuvres() {
  if (!STRAPI_URL) throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");

  const res = await fetch(`${STRAPI_URL}/api/oeuvres?populate=Image`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Strapi /oeuvres failed (${res.status}): ${text.slice(0, 200)}`);
  }
  const json = await res.json();
  return (json?.data ?? []).map(mapOeuvre);
}
