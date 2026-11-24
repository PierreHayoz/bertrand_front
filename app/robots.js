/*
 * Version de test (préproduction) : SITE_NOINDEX=1 dans l'environnement
 * → aucun moteur de recherche n'indexe le site (voir aussi metadata.robots dans layout.js).
 */
export default function robots() {
  if (process.env.SITE_NOINDEX === "1") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: "https://bertrandkolly.ch/sitemap.xml",
  };
}
