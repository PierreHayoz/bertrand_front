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

  let page = 1;
  let allOeuvres = [];
  let total = Infinity;

  while (allOeuvres.length < total) {
    const res = await fetch(
`${STRAPI_URL}/api/oeuvres?populate=Image&pagination[page]=${page}&pagination[pageSize]=100&sort=date:desc`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error(`Strapi error ${res.status}`);
    const json = await res.json();
    total = json.meta.pagination.total;
    allOeuvres = [...allOeuvres, ...json.data.map(mapOeuvre)];
    page++;
  }

  return allOeuvres;
}
