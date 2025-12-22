import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "zcwwhcmjfwy59an0.public.blob.vercel-storage.com",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/forms/:slug*",
        destination: "/api/download?slug=:slug",
      },
    ];
  },

  reactStrictMode: true, // Keep this ON
  // This helps debug infinite loops in dev
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // ignore errors during build
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
