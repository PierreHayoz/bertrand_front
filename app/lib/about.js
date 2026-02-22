
import { fetchStrapi, getImageUrl } from "./strapi";

export async function getAbout() {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!base) throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");

  // simple & safe
  const url = `${base}/api/about?publicationState=preview&populate=*`;

  const res = await fetchStrapi(url);
  const a = res?.data;
  console.log(a)
  if (!a) return null;

  return {
    hero: {
      title: a.hero?.title ?? null,
      subtitle: a.hero?.subtitle ?? null,
    },

    image: {
      url: getImageUrl(a.image),
      alt: a.image?.alternativeText ?? a.hero?.title ?? "À propos",
    },

    citation: {
      text: a.citation?.citation ?? null,
      auteur: a.citation?.auteur ?? null,
    },

    contenu: a.contenu ?? [],
    gallery: (a.gallery ?? []).map((img) => ({
      url: getImageUrl(img),
      alt: img?.alternativeText ?? a.hero?.title ?? "Gallery image",
    })),
    cta: {
      title: a.ctaBlock?.title ?? null,
      text: a.ctaBlock?.text ?? null,
      label: a.ctaBlock?.ctaLabel ?? null,
      url: a.ctaBlock?.ctaUrl ?? null,
    },
  };
}

