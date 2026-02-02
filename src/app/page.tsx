"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import Preloader from "@/components/Preloader";
import AmbientBackground from "@/components/AmbientBackground";

export default function Home() {
  const [preloaderComplete, setPreloaderComplete] = useState(false);

  return (
    <div className="relative w-full min-h-screen text-[#EDEDED] font-sans">
      <AnimatePresence mode="wait">
        {!preloaderComplete && (
          <Preloader onComplete={() => setPreloaderComplete(true)} />
        )}
      </AnimatePresence>

      <AmbientBackground />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: preloaderComplete ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10"
      >
        <HeroSection />
      </motion.main>
    </div>
  );
}
