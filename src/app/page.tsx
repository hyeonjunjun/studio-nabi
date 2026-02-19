import HeroSanctuary from "@/components/sections/HeroSanctuary";
import IntroStatement from "@/components/sections/IntroStatement";
import WorkIndex from "@/components/sections/WorkIndex";
import Colophon from "@/components/sections/Colophon";

export default function Home() {
  return (
    <main>
      <HeroSanctuary />
      <IntroStatement />
      <WorkIndex />
      <Colophon />
    </main>
  );
}
