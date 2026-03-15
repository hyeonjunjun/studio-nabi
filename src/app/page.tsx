import Hero from "@/components/sections/Hero";
import Viewfinder from "@/components/sections/Viewfinder";
import Contact from "@/components/sections/Contact";
import Colophon from "@/components/sections/Colophon";
import SectionDivider from "@/components/ui/SectionDivider";

export default function Home() {
  return (
    <main>
      <Hero />
      <SectionDivider direction="left" />
      <Viewfinder />
      <SectionDivider direction="right" />
      <Contact />
      <Colophon />
    </main>
  );
}
