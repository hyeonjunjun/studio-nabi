"use client";

import ScrollSections from "@/components/ScrollSections";
import ScrollNav from "@/components/ScrollNav";
import HeroSection from "@/components/HeroSection";
import WorkSection from "@/components/WorkSection";
import ApproachSection from "@/components/ApproachSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import PageTransition from "@/components/PageTransition";

export default function Home() {
  return (
    <PageTransition>
      <ScrollNav />
      <ScrollSections>
        <HeroSection />
        <WorkSection />
        <ApproachSection />
        <AboutSection />
        <ContactSection />
      </ScrollSections>
    </PageTransition>
  );
}
