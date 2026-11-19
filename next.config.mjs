/** @type {import('next').NextConfig} */
// next.config.js
const nextConfig = {
  images: {
    // Next 16 bloque les images servies depuis une IP locale (protection SSRF).
    // En dev, Strapi tourne sur localhost : on l'autorise uniquement dans ce cas.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
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
                      