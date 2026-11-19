
import { fetchStrapi, getImageUrl } from "./strapi";

export async function getAbout() {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!base) throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");

  // simple & safe
  const url = `${base}/api/about?populate=*`;

  const res = await fetchStrapi(url);
  const a = res?.data;
  if (!a) return null;

  return {
    hero: {
      title: a.hero?.titre ?? null,
      subtitle: a.hero?.sousTitre ?? null,
    },

    image: {
      url: getImageUrl(a.image),
      alt: a.image?.alternativeText ?? a.hero?.titre ?? "À propos",
    },

    citation: {
      text: a.citation?.texte ?? null,
      auteur: a.citation?.auteur ?? null,
    },

    contenu: a.contenu ?? [],
    gallery: (a.galerie ?? []).map((img) => ({
      url: getImageUrl(img),
      alt: img?.alternativeText ?? a.hero?.titre ?? "Gallery image",
    })),
    cta: {
      title: a.appelAction?.titre ?? null,
      text: a.appelAction?.texte ?? null,
      label: a.appelAction?.libelleBouton ?? null,
      url: a.appelAction?.lienBouton ?? null,
    },
  };
}

