"use client";

import GlobalNav from "@/components/GlobalNav";
import HeroSection from "@/components/HeroSection";
import ArchiveSection from "@/components/ArchiveSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import PageTransition from "@/components/PageTransition";

export default function Home() {
  return (
    <PageTransition>
      <GlobalNav />
      <main id="main">
        <HeroSection />
        <ArchiveSection />
        <AboutSection />
        <ContactSection />
      </main>
    </PageTransition>
  );
}
