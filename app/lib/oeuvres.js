import { populateMedia, strapi, toImage } from "./strapi";

// Plus récentes d'abord ; à date égale, numéro le plus élevé d'abord.
const QUERY = [
  "sort[0]=date:desc",
  "sort[1]=numero:desc",
  "fields[0]=numero",
  "fields[1]=titre",
  "fields[2]=format",
  "fields[3]=date",
  populateMedia("image"),
].join("&");

function mapOeuvre(o) {
  const titre = o.titre ?? "Sans titre";
  return {
    id: o.documentId,
    numero: o.numero ?? null,
    titre,
    format: o.format ?? null,
    year: o.date ? Number(o.date.slice(0, 4)) : null,
    image: toImage(o.image, `${titre}${o.numero ? `, œuvre n° ${o.numero}` : ""}`),
  };
}

/** Tranche d'œuvres (offset/limit) + total, en une seule requête. */
export async function getOeuvres({ start = 0, limit = 24 } = {}) {
  const json = await strapi(`/oeuvres?${QUERY}&pagination[start]=${start}&pagination[limit]=${limit}`);
  return {
    items: (json?.data ?? []).map(mapOeuvre),
    total: json?.meta?.pagination?.total ?? 0,
  };
}
