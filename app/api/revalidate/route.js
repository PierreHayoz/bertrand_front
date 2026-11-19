import { revalidateTag } from "next/cache";
import { STRAPI_TAG } from "@/app/lib/strapi";

/**
 * Webhook Strapi (Réglages → Webhooks) : POST /api/revalidate
 * avec l'en-tête `Authorization: Bearer <REVALIDATE_SECRET>`.
 * Vide le cache du contenu pour que les modifications apparaissent tout de suite.
 */
export async function POST(request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ error: "REVALIDATE_SECRET non configuré" }, { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  revalidateTag(STRAPI_TAG, { expire: 0 });
  return Response.json({ revalidated: true, at: new Date().toISOString() });
}
