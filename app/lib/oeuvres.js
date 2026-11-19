import { fetchStrapi, toImage } from "./strapi";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
// Plus récentes d'abord ; à date égale, le numéro le plus élevé d'abord.
const SORT = "sort[0]=date:desc&sort[1]=numero:desc";

export function mapOeuvre(o) {
  const titre = o?.titre ?? null;
  return {
    id: o.documentId ?? o.id,
    numero: o.numero ?? null,
    titre,
    format: o.format ?? null,
    date: o.date ?? null,
    year: o.date ? new Date(o.date).getFullYear() : null,
    image: toImage(o.image, `${titre ?? "Œuvre"}${o.numero ? ` (n° ${o.numero})` : ""}`),
  };
}

export async function getOeuvres() {
  if (!STRAPI_URL) throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");

  let page = 1;
  let all = [];
  let total = Infinity;

  while (all.length < total) {
    const json = await fetchStrapi(
      `${STRAPI_URL}/api/oeuvres?populate=image&${SORT}&pagination[page]=${page}&pagination[pageSize]=100`
    );
    total = json.meta.pagination.total;
    all = all.concat(json.data.map(mapOeuvre));
    page++;
    if (!json.data.length) break;
  }

  return all;
}

export async function getLatestOeuvres(limit = 9) {
  if (!STRAPI_URL) throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");
  const json = await fetchStrapi(
    `${STRAPI_URL}/api/oeuvres?populate=image&${SORT}&pagination[pageSize]=${limit}`
  );
  return (json?.data ?? []).map(mapOeuvre);
}
