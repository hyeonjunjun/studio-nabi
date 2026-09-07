import Link from "next/link";
import type { Work } from "@/data/works";
import { delay, duration } from "@/lib/motion";
import MotionReveal from "../MotionReveal";
import { MediaRenderer } from "./WorkTile";

/** Zero-pads a positive integer to 2 digits, e.g. 1 -> "01". */
function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

interface GridTileProps {
  work: Work;
  index: number;
}

/**
 * One work in the /works index — a plain two-column grid (ethanandtom-style:
 * uniform cells, media at its own natural aspect ratio, metadata always
 * visible underneath rather than hidden behind hover) instead of the
 * hand-curated poster composition this replaced. Same microtype as the
 * rest of the site for the index/title/category/year caption row.
 */
function GridTile({ work, index }: GridTileProps) {
  return (
    <MotionReveal delay={delay.primary + (index - 1) * delay.stagger} duration={duration.reveal}>
      <Link href={`/works/${work.slug}`} className="group block">
        <div className="relative w-full overflow-hidden bg-ws-ink/5 transition-opacity duration-300 group-hover:opacity-90">
          <MediaRenderer media={work.media} />
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-3 font-instrument-sans text-[10px] font-medium uppercase tracking-[0.15em] text-ws-ink/40">
          <span className="tabular-nums">{pad2(index)}</span>
          <span className="flex-1 truncate text-ws-ink">{work.title.toLowerCase()}</span>
          <span className="shrink-0">{work.category.toLowerCase()}</span>
          <span className="shrink-0">{work.year}</span>
        </div>
      </Link>
    </MotionReveal>
  );
}

interface WorkGridProps {
  works: Work[];
}

export default function WorkGrid({ works }: WorkGridProps) {
  return (
    <section
      aria-label="Selected work"
      // pb-56 (not a smaller pad) leaves room for CornerMark, which is
      // `absolute bottom-[edge-margin]` against <main> and lands wherever
      // this grid's own bottom edge happens to be — too little padding
      // here and its studio-info stack crowds the last row's caption.
      className="grid grid-cols-1 gap-x-12 gap-y-16 px-[var(--edge-margin)] pt-16 pb-56 md:grid-cols-2 md:gap-y-24"
    >
      {works.map((work, i) => (
        <GridTile key={work.id} work={work} index={i + 1} />
      ))}
    </section>
  );
}
