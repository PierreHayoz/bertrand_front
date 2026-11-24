/** @type {import('next').NextConfig} */
// next.config.js
const nextConfig = {
  images: {
    // AVIF d'abord (≈ 30 % plus léger que WebP), WebP sinon
    formats: ["image/avif", "image/webp"],
    // les images Strapi ne changent pas d'URL (hash) : cache long côté optimiseur
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Next 16 bloque les images servies depuis une IP locale (protection SSRF).
    // Autorisé seulement quand Strapi tourne en local (dev, ou build de production testé en local).
    dangerouslyAllowLocalIP: (process.env.NEXT_PUBLIC_STRAPI_URL ?? "").startsWith("http://localhost"),
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'contenu.bertrandkolly.ch',
        pathname: '/uploads/**',
      },
    ],
  },
};


export default nextConfig;
                      