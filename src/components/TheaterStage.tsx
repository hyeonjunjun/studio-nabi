"use client";

import { AnimatePresence } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";
import { useURLSync } from "@/hooks/useURLSync";
import TopBar from "@/components/TopBar";
import ProjectCarousel from "@/components/ProjectCarousel";
import AboutView from "@/components/views/AboutView";
import ArchiveView from "@/components/views/ArchiveView";
import DetailView from "@/components/views/DetailView";

export default function TheaterStage() {
  useURLSync();

  const preloaderDone = useTheaterStore((s) => s.preloaderDone);
  const activeTab = useTheaterStore((s) => s.activeTab);
  const isDetailExpanded = useTheaterStore((s) => s.isDetailExpanded);

  if (!preloaderDone) return null;

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden" id="main">
      <TopBar />

      {/* Main content area — full viewport below nav */}
      <div
        className="absolute"
        style={{ top: 48, left: 0, right: 0, bottom: 0 }}
      >
        <AnimatePresence mode="wait">
          {isDetailExpanded ? (
            <DetailView key="detail" />
          ) : activeTab === "index" ? (
            <ProjectCarousel key="index" type="project" />
          ) : activeTab === "archive" ? (
            <ProjectCarousel key="archive" type="experiment" />
          ) : (
            <AboutView key="about" />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
