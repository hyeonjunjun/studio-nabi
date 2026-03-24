import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Legacy routes → home
      { source: "/works",               destination: "/", permanent: true },
      { source: "/explore",             destination: "/", permanent: true },
      { source: "/explore/:slug",       destination: "/", permanent: true },
      { source: "/coddiwomple",         destination: "/", permanent: true },
      { source: "/coddiwomple/:slug",   destination: "/", permanent: true },
      { source: "/journal",             destination: "/", permanent: true },
      { source: "/journal/:slug",       destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
