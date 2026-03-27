"use client";

import { useRef } from "react";
import { useStudioStore } from "@/lib/store";
import { IndexView } from "@/components/views/IndexView";
import { DriftView } from "@/components/views/DriftView";
import { ArchiveView } from "@/components/views/ArchiveView";
import { BottomBar } from "@/components/BottomBar";
import { DetailOverlay } from "@/components/DetailOverlay";
import { Preloader } from "@/components/Preloader";

export default function HomePage() {
  const activeView = useStudioStore((s) => s.activeView);
  const viewRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={viewRef} data-view={activeView} style={{ position: "relative" }}>
        {activeView === "index" && <IndexView />}
        {activeView === "drift" && <DriftView />}
        {activeView === "archive" && <ArchiveView />}
      </div>
      <BottomBar />
      <DetailOverlay />
      <Preloader containerRef={viewRef} />
    </>
  );
}
