"use client";

import { AnimatePresence, motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Preloader from "../components/Preloader";
import TechnicalGrid from "../components/TechnicalGrid";
import LandingHero from "../components/LandingHero";
import Philosophy from "../components/Philosophy";
import Ethos from "../components/Ethos";
import LandingFooter from "../components/LandingFooter";
import CustomScrollbar from "../components/CustomScrollbar";
import SectionFade from "../components/SectionFade";
import ProjectHUD from "../components/ProjectHUD";
import ProjectMenu from "../components/ProjectMenu";
import ProjectDetail from "../components/ProjectDetail";
import { Project, PROJECTS } from "../constants/projects";

import ParticleSacredGeometry from "../components/ParticleSacredGeometry";

export default function Home() {
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);



  // Body Scroll Lock when Project Open
  useEffect(() => {
    if (selectedProject || isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [selectedProject, isMenuOpen]);

  return (
    <div className="relative w-full min-h-screen bg-transparent text-black font-serif selection:bg-[#FEF3C7] selection:text-black">
      <ParticleSacredGeometry />

      <AnimatePresence mode="wait">
        {!preloaderComplete && (
          <Preloader onCompleteAction={() => setPreloaderComplete(true)} />
        )}
      </AnimatePresence>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: preloaderComplete ? 1 : 0 }}
        transition={{ duration: 2.2, ease: [0.25, 1, 0.5, 1] }}
        className="relative z-10 w-full min-h-screen"
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

        {/* SECTION 2.5: ETHOS */}
        <SectionFade className="w-full">
          <Ethos />
        </SectionFade>

        {/* SECTION 3: WORK (Technical Grid) */}
        <TechnicalGrid onProjectClick={(p) => setSelectedProject(p)} />

        {/* SECTION 4: FOOTER */}
        <SectionFade className="w-full">
          <LandingFooter />
        </SectionFade>
      </motion.main>
    </div>
  );
}
