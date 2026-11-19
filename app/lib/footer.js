import { cache } from "react";
import { unstable_rethrow } from "next/navigation";

/** Coordonnées (pied de page Strapi), partagées par l'en-tête et le pied de page. */
export const getFooter = cache(async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/footer?populate=*`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const f = (await res.json())?.data;
    if (!f) return null;
    return {
      texte: f.texteContact ?? null,
      telephone: f.contact?.telephone ?? null,
      email: f.contact?.email ?? null,
      adresse: f.contact?.adresse ?? null,
      npaLocalite: f.contact?.npaLocalite ?? null,
    };
  } catch (e) {
    // laisse passer les signaux internes de Next (rendu dynamique), avale le reste
    unstable_rethrow(e);
    console.error("Footer fetch failed:", e?.message);
    return null;
  }
});
