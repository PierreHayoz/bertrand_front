import { getExpositions } from "./lib/expositions";

const BASE = "https://bertrandkolly.ch";

export default async function sitemap() {
  const pages = ["", "/oeuvres", "/expositions", "/about"].map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.8,
  }));

  let expos = [];
  try {
    expos = (await getExpositions()).map((e) => ({
      url: `${BASE}/expositions/${e.slug}`,
      lastModified: e.dateDebut ?? undefined,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    // Strapi indisponible : sitemap minimal
  }

  return [...pages, ...expos];
}
