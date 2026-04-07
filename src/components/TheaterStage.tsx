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

function ActiveView({
  activeTab,
  isDetailExpanded,
}: {
  activeTab: string;
  isDetailExpanded: boolean;
}) {
  if (isDetailExpanded) return <DetailView key="detail" />;

  switch (activeTab) {
    case "index":
      return <IndexView key="index" />;
    case "archive":
      return <ArchiveView key="archive" />;
    case "about":
      return <AboutView key="about" />;
    default:
      return null;
  }
}

export default function TheaterStage() {
  useURLSync();

  const preloaderDone = useTheaterStore((s) => s.preloaderDone);
  const activeTab = useTheaterStore((s) => s.activeTab);
  const isDetailExpanded = useTheaterStore((s) => s.isDetailExpanded);

  if (!preloaderDone) return null;

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden" id="main">
      <TopBar />
      <BottomBar />

      {/* Content zone — overlaps with 3D scene for poster-style compositions */}
      <div
        className="absolute"
        style={{
          left: 0,
          top: 56,
          bottom: 44,
          width: "55%",
          paddingLeft: "clamp(32px, 8vw, 96px)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <div className="relative w-full h-full" style={{ pointerEvents: "auto" }}>
          <AnimatePresence mode="wait">
            <ActiveView activeTab={activeTab} isDetailExpanded={isDetailExpanded} />
          </AnimatePresence>
        </div>
      </div>

      {/* 3D scene — positioned to be partially behind the text */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          right: 0,
          top: 56,
          bottom: 44,
          width: "62%",
          zIndex: 5,
        }}
      >
        <Scene3D />
      </div>
    </div>
  );
}
