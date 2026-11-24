/**
 * Grande image de la visionneuse, servie par l'optimiseur de Next (AVIF/WebP, cache).
 * Même URL pour le préchargement et pour l'affichage : l'image préchargée est réutilisée.
 * Passer par le site plutôt que directement par Strapi marche aussi quand Strapi
 * n'est pas joignable depuis le navigateur (lien de test, Strapi local).
 */
export function viewerSrc(image) {
  if (!image?.srcLarge) return null;
  return `/_next/image?url=${encodeURIComponent(image.srcLarge)}&w=1920&q=75`;
}
