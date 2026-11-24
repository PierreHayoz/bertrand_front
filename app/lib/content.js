import { cache } from "react";
import { MEDIA_FIELDS, populateMedia, strapi, toImage } from "./strapi";

const cta = (c) =>
  c?.titre
    ? {
        title: c.titre,
        text: c.texte ?? null,
        label: c.libelleBouton ?? null,
        url: c.lienBouton ?? null,
        image: toImage(c.image, "Tableaux de Bertrand Kolly exposés"),
      }
    : null;

// Bandeau jaune : textes + photo facultative
const CTA_POPULATE = `populate[appelAction][populate][image]${MEDIA_FIELDS.join("&populate[appelAction][populate][image]")}`;

const quote = (c) => (c?.texte ? { text: c.texte, auteur: c.auteur ?? null } : null);

export async function getHomepage() {
  const json = await strapi(`/homepage?populate[hero]=true&${CTA_POPULATE}&populate[citation]=true`);
  const h = json?.data;
  return {
    hero: { title: h?.hero?.titre?.trim() ?? null, subtitle: h?.hero?.sousTitre ?? null },
    cta: cta(h?.appelAction),
    quote: quote(h?.citation),
  };
}

export async function getAbout() {
  const json = await strapi(
    `/about?populate[hero]=true&populate[citation]=true&${CTA_POPULATE}&${populateMedia("image")}&${populateMedia("galerie")}`
  );
  const a = json?.data;
  if (!a) return null;
  return {
    hero: { title: a.hero?.titre ?? "À propos", subtitle: a.hero?.sousTitre ?? null },
    image: toImage(a.image, "Bertrand Kolly"),
    quote: quote(a.citation),
    contenu: a.contenu ?? [],
    gallery: (a.galerie ?? []).map((m) => toImage(m, "Bertrand Kolly à l'atelier")).filter(Boolean),
    cta: cta(a.appelAction),
  };
}

/** Coordonnées du pied de page (dédupliqué par requête : en-tête + pied de page). */
export const getContact = cache(async () => {
  try {
    const json = await strapi("/footer?populate[contact]=true&populate[vente]=true");
    const f = json?.data;
    return {
      texte: f?.texteContact ?? null,
      telephone: f?.contact?.telephone ?? null,
      email: f?.contact?.email ?? null,
      adresse: f?.contact?.adresse ?? null,
      npaLocalite: f?.contact?.npaLocalite ?? null,
      // Bouton vers le site de vente : affiché seulement si une adresse est renseignée
      vente: f?.vente?.lien
        ? {
            texte: f.vente.texte || "Envie d’acquérir une œuvre ?",
            label: f.vente.libelleBouton || "Voir les tableaux à vendre",
            url: f.vente.lien,
          }
        : null,
    };
  } catch (e) {
    console.error("Contact indisponible:", e.message);
    return null;
  }
});
