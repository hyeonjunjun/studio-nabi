import HeroSanctuary from "@/components/sections/HeroSanctuary";
import WorkOverview from "@/components/sections/WorkOverview";
import PhilosophyStrip from "@/components/sections/PhilosophyStrip";
import Colophon from "@/components/sections/Colophon";
import StickyNav from "@/components/StickyNav";

export default function Home() {
  return (
    <main>
      <StickyNav />
      <HeroSanctuary />
      <WorkOverview />
      <PhilosophyStrip />
      <Colophon />
    </main>
  );
}

