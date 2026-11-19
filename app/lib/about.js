import { fetchStrapi, toImage } from "./strapi";

export async function getAbout() {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!base) throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");

  const res = await fetchStrapi(`${base}/api/about?populate=*`);
  const a = res?.data;
  if (!a) return null;

  return {
    hero: {
      title: a.hero?.titre ?? null,
      subtitle: a.hero?.sousTitre ?? null,
    },
    image: toImage(a.image, "Bertrand Kolly"),
    citation: {
      text: a.citation?.texte ?? null,
      auteur: a.citation?.auteur ?? null,
    },
    contenu: a.contenu ?? [],
    gallery: (a.galerie ?? []).map((img) => toImage(img, "Bertrand Kolly")).filter(Boolean),
    cta: {
      title: a.appelAction?.titre ?? null,
      text: a.appelAction?.texte ?? null,
      label: a.appelAction?.libelleBouton ?? null,
      url: a.appelAction?.lienBouton ?? null,
    },
  };
}
