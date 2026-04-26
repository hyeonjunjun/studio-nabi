import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/work", destination: "/", permanent: true },
      { source: "/works", destination: "/", permanent: true },
      { source: "/lab", destination: "/", permanent: true },
      { source: "/lab/:slug", destination: "/work/:slug", permanent: true },
      // Architecture pass 2026-04-26: about/contact/colophon collapsed
      // into /studio; shelf renamed to /bookmarks.
      { source: "/about", destination: "/studio", permanent: true },
      { source: "/contact", destination: "/studio", permanent: true },
      { source: "/colophon", destination: "/studio", permanent: true },
      { source: "/shelf", destination: "/bookmarks", permanent: true },
      { source: "/journal", destination: "/notes", permanent: true },
      { source: "/journal/:slug", destination: "/notes/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
