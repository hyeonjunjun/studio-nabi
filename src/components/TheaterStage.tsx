"use client";

import { AnimatePresence } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";
import { useURLSync } from "@/hooks/useURLSync";
import TopBar from "@/components/TopBar";
import Scene3D from "@/components/Scene3D";
import IndexView from "@/components/views/IndexView";
import ArchiveView from "@/components/views/ArchiveView";
import AboutView from "@/components/views/AboutView";
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

      {/* Text column — narrow, left, generous padding */}
      <div
        className="absolute z-10"
        style={{
          left: 0,
          top: 48,
          bottom: 0,
          width: "30%",
          paddingLeft: "clamp(24px, 5vw, 64px)",
          paddingRight: 16,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ maxWidth: 280, width: "100%" }}>
          <AnimatePresence mode="wait">
            {isDetailExpanded ? (
              <DetailView key="detail" />
            ) : activeTab === "index" ? (
              <IndexView key="index" />
            ) : activeTab === "archive" ? (
              <ArchiveView key="archive" />
            ) : (
              <AboutView key="about" />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 3D canvas — right 68%, no chrome around it */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          right: 0,
          top: 0,
          bottom: 0,
          width: "68%",
          zIndex: 5,
          transform: activeTab === "about" ? "scale(0.75)" : "scale(1)",
          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <Scene3D />
      </div>
    </div>
  );
}
