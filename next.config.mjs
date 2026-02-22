/** @type {import('next').NextConfig} */
// next.config.js
const nextConfig = {
  images: {
        unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
    ],
  },
};


export default nextConfig;
                      