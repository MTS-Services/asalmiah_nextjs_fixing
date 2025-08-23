/** @type {import('next').NextConfig} */

const nextConfig = {

  images: {
    domains: [
      "192.168.2.172",
      "offarat-api.toxsl.in",
      "picsum.photos",
      "www.gstatic.com",
      "192.168.2.225",
      "ibb.co",
    ],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allows any hostname
      },
      {
        protocol: "http",
        hostname: "**", // Allows any hostname
      },
    ],
    unoptimized: true,
  },
  // compiler: {
  //   removeConsole: process.env.NODE_ENV === 'production',
  // },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
