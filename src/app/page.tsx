"use client";

import Sidebar from "@/components/Sidebar";
import SkyHero from "@/components/SkyHero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import NaturalBackground from "@/components/NaturalBackground";
import CustomCursor from "@/components/CustomCursor";
import InertialScroll from "@/components/InertialScroll";
import MaskReveal from "@/components/MaskReveal";

export default function Home() {
  return (
    <InertialScroll>
      {/* Main Layout Grid */}
      <div className="min-h-screen bg-background text-foreground grid md:grid-cols-[350px_1fr]">

        <CustomCursor />
        <Sidebar />

        {/* Right Content Panel - The "Canvas" */}
        <main className="relative min-h-screen border-l border-foreground/5 ml-0 md:ml-0 pt-24 md:pt-0">

          {/* Background Texture confined to Content Canvas */}
          <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none">
            <NaturalBackground />
          </div>

          {/* Muted SkyHero Background */}
          <div className="fixed top-0 right-0 w-full md:w-[calc(100vw-350px)] h-screen z-0 opacity-20 pointer-events-none mix-blend-multiply grayscale">
            <SkyHero />
          </div>

          {/* Scrollable Content */}
          <div className="relative z-10 px-6 md:px-24 py-24 md:py-32 space-y-32">

            {/* Hero Statement */}
            <section className="min-h-[60vh] flex flex-col justify-center border-b border-foreground/10 pb-24">
              <MaskReveal direction="up" duration={1.2}>
                <h2 className="text-6xl md:text-9xl font-bold uppercase tracking-tighter leading-[0.85] font-heading mb-12">
                  Digital<br />Serenity.
                </h2>
              </MaskReveal>
              <MaskReveal delay={0.3}>
                <p className="text-xl md:text-2xl font-serif max-w-2xl leading-relaxed text-foreground/80 border-l-2 border-accent pl-8">
                  A structured approach to digital chaos. Building interfaces that
                  honor the principles of calm, clarity, and biological motion.
                </p>
              </MaskReveal>
            </section>

            <About />
            <Projects />
            <Contact />
          </div>
        </main>
      </div>
    </InertialScroll>
  );
}
