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

/** Un titre vide ou « Sans titre » n'est pas un vrai titre. */
const vraiTitre = (t) => {
  const s = t?.trim();
  return s && !/^sans[\s-]*titre$/i.test(s) ? s : null;
};

function mapOeuvre(o) {
  // Sans vrai titre : « Œuvre nᵒ 345 ». Dès que Bertrand saisit un titre dans Strapi, il remplace celui-ci.
  const titrePropre = vraiTitre(o.titre);
  // espace insécable : « nᵒ » et le numéro restent sur la même ligne
  const titre = titrePropre ?? (o.numero ? `Œuvre nᵒ ${o.numero}` : "Œuvre");
  return {
    id: o.documentId,
    numero: o.numero ?? null,
    titre,
    sansTitre: !titrePropre,
    format: o.format ?? null,
    year: o.date ? Number(o.date.slice(0, 4)) : null,
    image: toImage(o.image, `${titre}${titrePropre && o.numero ? `, œuvre nᵒ ${o.numero}` : ""}, Bertrand Kolly`),
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
