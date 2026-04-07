import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import GeometricFrame from "@/components/GeometricFrame";
import { PIECES } from "@/constants/pieces";

const experiments = PIECES.filter((p) => p.type === "experiment").sort(
  (a, b) => a.order - b.order
);

export default function ArchivePage() {
  return (
    <main id="main" className="min-h-screen">
      <div className="pt-16 px-6 md:px-10">
        <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3 block mb-8">
          Archive
        </span>

        <div className="max-w-[800px]">
          {experiments.map((piece) => (
            <Link
              key={piece.slug}
              href={`/archive/${piece.slug}`}
              data-cursor="link"
              className="flex items-center gap-4 py-4 border-b border-fg-4 group"
            >
              {/* Thumbnail */}
              <div className="w-[120px] h-[90px] flex-shrink-0 overflow-hidden">
                <GeometricFrame variant="thumbnail" accentGradient="cool">
                  {piece.video ? (
                    <video
                      src={piece.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : piece.image ? (
                    <Image
                      src={piece.image}
                      alt={piece.title}
                      width={120}
                      height={90}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: piece.cover.bg }}
                    />
                  )}
                </GeometricFrame>
              </div>

              {/* Title */}
              <span className="font-body text-[15px] text-fg flex-1">
                {piece.title}
              </span>

              {/* Type label */}
              <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3">
                Experiment
              </span>

              {/* Year */}
              <span className="font-mono text-[11px] text-fg-3 tabular-nums">
                {piece.year}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
