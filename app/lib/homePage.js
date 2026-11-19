import { fetchStrapi } from "./strapi";

export async function getHomepage() {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!base) throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");

  const res = await fetchStrapi(
    `${base}/api/homepage?populate[hero]=*&populate[appelAction]=*&populate[citation]=*`
  );
  const h = res?.data;
  if (!h) return null;

  return {
    hero: {
      title: h.hero?.titre ?? null,
      subtitle: h.hero?.sousTitre ?? null,
    },
    cta: {
      title: h.appelAction?.titre ?? null,
      text: h.appelAction?.texte ?? null,
      label: h.appelAction?.libelleBouton ?? null,
      url: h.appelAction?.lienBouton ?? null,
    },
    citation: {
      text: h.citation?.texte ?? null,
      auteur: h.citation?.auteur ?? null,
    },
  };
}
