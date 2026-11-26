/** @type {import('next').NextConfig} */

// Adresse de Strapi utilisée par ce build (prod : https://contenu.bertrandkolly.ch).
// Ses images sont toujours autorisées, quel que soit le port en local.
const strapi = new URL(process.env.NEXT_PUBLIC_STRAPI_URL || "https://contenu.bertrandkolly.ch");

const nextConfig = {
  images: {
    // AVIF d'abord (≈ 30 % plus léger que WebP), WebP sinon
    formats: ["image/avif", "image/webp"],
    // les images Strapi ne changent pas d'URL (hash) : cache long côté optimiseur
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Next 16 bloque les images servies depuis une IP locale (protection SSRF).
    // Autorisé seulement quand Strapi tourne en local (dev, ou build de production testé en local).
    dangerouslyAllowLocalIP: strapi.hostname === "localhost",
    remotePatterns: [
      {
        protocol: strapi.protocol.replace(":", ""),
        hostname: strapi.hostname,
        port: strapi.port,
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "contenu.bertrandkolly.ch",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
