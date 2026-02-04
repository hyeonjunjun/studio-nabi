"use client";

import { AnimatePresence, motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Preloader from "../components/Preloader";
import ImmersiveSlider from "../components/ImmersiveSlider";
import LandingHero from "../components/LandingHero";
import Philosophy from "../components/Philosophy";
import LandingFooter from "../components/LandingFooter";
import CustomScrollbar from "../components/CustomScrollbar";
import SectionFade from "../components/SectionFade";
import ProjectHUD from "../components/ProjectHUD";
import ProjectMenu from "../components/ProjectMenu";
import ProjectDetail from "../components/ProjectDetail";
import { Project, PROJECTS } from "../constants/projects";

export default function Home() {
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Hard Reset to Hero on Reload
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  // SCROLL LOGIC FOR WORK SECTION
  const workContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: workContainerRef,
    offset: ["start start", "end end"]
  });

  // Map scroll progress (0 to 1) to project index (0 to Length-1)
  // CLAMPED to 0.75: This means we reach the last project at 75% scroll, 
  // giving it a long "dwell time" (25% of scroll) before the section ends.
  const rawIndex = useTransform(scrollYProgress, [0, 0.75], [0, PROJECTS.length - 1]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Sync motion value to state for rendering
  useEffect(() => {
    const unsubscribe = rawIndex.on("change", (latest) => {
      setActiveIndex(Math.round(latest));
    });
    return () => unsubscribe();
  }, [rawIndex]);

  // Work Section Fade Logic - Anchored at start and end
  const workOpacity = useTransform(scrollYProgress, [0, 0.02, 0.98, 1], [1, 1, 1, 1]);
  const workScale = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [1, 1, 1, 1]);

  // Body Scroll Lock when Project Open
  useEffect(() => {
    if (selectedProject || isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [selectedProject, isMenuOpen]);

  return (
    <div className="relative w-full min-h-screen bg-transparent text-white font-serif selection:bg-[#FEF3C7] selection:text-black">
      <AnimatePresence mode="wait">
        {!preloaderComplete && (
          <Preloader onComplete={() => setPreloaderComplete(true)} />
        )}
      </AnimatePresence>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: preloaderComplete ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 w-full min-h-screen" // Removed overflow-x-hidden from here to rely on body, helping sticky
      >
        <div className="fixed top-0 left-0 w-full z-50 pointer-events-none">
          <ProjectHUD
            isMenuOpen={isMenuOpen}
            onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
          />
        </div>

        <CustomScrollbar />

        <ProjectMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />

        <AnimatePresence>
          {selectedProject && (
            <ProjectDetail
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          )}
        </AnimatePresence>

        {/* SECTION 1: HERO */}
        <SectionFade className="w-full h-screen">
          <LandingHero />
        </SectionFade>

        {/* SECTION 2: PHILOSOPHY */}
        <SectionFade className="w-full min-h-[50vh]">
          <Philosophy />
        </SectionFade>

        {/* SECTION 3: WORK (Sticky Buffer) */}
        <motion.div
          ref={workContainerRef}
          style={{ opacity: workOpacity, scale: workScale }}
          className="relative w-full h-[500vh]"
        >
          <div className="sticky top-0 h-screen overflow-hidden">
            <ImmersiveSlider
              isPaused={!!selectedProject || isMenuOpen}
              onProjectClick={(project: Project) => setSelectedProject(project)}
              activeIndex={activeIndex}
            />
          </div>
        </motion.div>

        {/* SECTION 4: FOOTER */}
        <SectionFade className="w-full">
          <LandingFooter />
        </SectionFade>
      </motion.main>
    </div>
  );
}
