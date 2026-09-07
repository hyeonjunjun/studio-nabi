import type { Work } from "@/data/works";
import WorkPlayer from "./WorkPlayer";

interface WorkShowcaseProps {
  works: Work[];
}

/**
 * Homepage centerpiece: solely WorkPlayer, full-bleed under the top bar.
 * Thin wrapper kept so `page.tsx` doesn't need to know the centerpiece
 * is a client component.
 *
 * HomeTimeline/TimelineStop/TimelineAxis/ArcCarousel are left in place,
 * unused, in case a future direction wants them back (same precedent as
 * WorkGrid after the /works retirement).
 */
export default function WorkShowcase({ works }: WorkShowcaseProps) {
  return (
    <div className="h-full w-full">
      <WorkPlayer works={works} />
    </div>
  );
}
