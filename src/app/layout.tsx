import type { Metadata } from "next";
import { Space_Mono, Inter, Newsreader } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CurtainPreloader from "@/components/CurtainPreloader";
import Cursor from "@/components/Cursor";
import GlobalNav from "@/components/GlobalNav";

/* ── Typography ── */

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-mono",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-satoshi", // CSS var name kept generic for easy swap to Satoshi later
});

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-editorial-new", // CSS var name kept generic for easy swap to Editorial New later
  style: ["normal", "italic"],
});

/* ── Metadata ── */

export const metadata: Metadata = {
  title: {
    default: "HKJ Studio — Ryan Jun",
    template: "%s | HKJ Studio",
  },
  description:
    "Design engineering at the intersection of high-fidelity craft and deep systems thinking.",
};

/* ── Root Layout ── */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceMono.variable} ${inter.variable} ${newsreader.variable} antialiased`}
        style={{
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
        }}
      >
        <CurtainPreloader />
        <Cursor />
        <GlobalNav />

        {/* Paper Noise Texture */}
        <div className="paper-noise" />

        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
