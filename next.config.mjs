/** @type {import('next').NextConfig} */
// next.config.js
const nextConfig = {
  images: {
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
                      