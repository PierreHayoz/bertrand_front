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
    // Grille
    imageUrl: toAbsoluteUrl(o.Image?.formats?.small?.url ?? o.Image?.url),
    // Modal
    imageUrlModal: toAbsoluteUrl(o.Image?.formats?.medium?.url ?? o.Image?.url),
    // Image mise en avant
    imageUrlFeatured: toAbsoluteUrl(o.Image?.formats?.medium?.url ?? o.Image?.url),
    imageAlt: o.Image?.alternativeText ?? null,
  };
}

export async function getOeuvres() {
  if (!STRAPI_URL) throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");

  const res = await fetch(`${STRAPI_URL}/api/oeuvres?populate=Image`, {
    next: { revalidate: 3600 }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Strapi /oeuvres failed (${res.status}): ${text.slice(0, 200)}`);
  }
  const json = await res.json();
  return (json?.data ?? []).map(mapOeuvre);
}
