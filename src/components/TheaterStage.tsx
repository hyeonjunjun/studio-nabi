"use client";

import { AnimatePresence } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";
import { useURLSync } from "@/hooks/useURLSync";
import TopBar from "@/components/TopBar";
import BottomBar from "@/components/BottomBar";
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

  // Index uses a full-viewport poster layout (no left/right split)
  const isFullViewport = activeTab === "index" && !isDetailExpanded;

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden" id="main">
      <TopBar />
      <BottomBar />

      {/* 3D scene — behind everything on Index, beside content otherwise */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          right: 0,
          top: 56,
          bottom: 44,
          width: isFullViewport ? "100%" : "58%",
          zIndex: isFullViewport ? 0 : 5,
          opacity: isFullViewport ? 0.5 : 1,
          transition: "width 0.5s ease, opacity 0.5s ease",
        }}
      >
        <Scene3D />
      </div>

      {/* Content zone */}
      {isFullViewport ? (
        /* Index: full-viewport poster composition */
        <div
          className="absolute z-10"
          style={{ top: 56, bottom: 44, left: 0, right: 0 }}
        >
          <AnimatePresence mode="wait">
            <IndexView key="index" />
          </AnimatePresence>
        </div>
      ) : (
        /* Other views: left-side panel */
        <div
          className="absolute z-10"
          style={{
            left: 0,
            top: 56,
            bottom: 44,
            width: "45%",
            paddingLeft: "clamp(32px, 8vw, 96px)",
            paddingRight: 24,
            display: "flex",
            alignItems: "center",
          }}
        >
          <AnimatePresence mode="wait">
            {isDetailExpanded ? (
              <DetailView key="detail" />
            ) : activeTab === "archive" ? (
              <ArchiveView key="archive" />
            ) : (
              <AboutView key="about" />
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
