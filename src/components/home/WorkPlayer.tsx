"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Work } from "@/data/works";
import { MediaRenderer } from "@/components/works/WorkTile";
import { durationSeconds, windEasing } from "@/lib/motion";

/** Zero-pads a positive integer to 2 digits, e.g. 1 -> "01". */
function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

interface WorkPlayerProps {
  works: Work[];
}

/**
 * Homepage centerpiece: one work at a time, browsed like a media player
 * rather than laid out as a grid — a single framed object, a title
 * readout, prev/next transport controls either side of a "view project"
 * link, and a filmstrip of every work along the bottom to jump straight
 * to one. Personality-forward and playful on purpose (per the Allagi
 * reference this was built from) — this is deliberately the one loud,
 * warm gesture on an otherwise quiet site; /works stays the plain,
 * documentation-oriented full catalog.
 *
 * Browsing (prev/next/filmstrip) is pure client state, no navigation —
 * only the frame itself and "view project" commit to `/works/[slug]`,
 * mirroring how the Allagi reference only ever navigates away via its
 * one explicit "Open in Spotify" action.
 *
 * `mode="sync"` on AnimatePresence: the incoming and outgoing frame
 * crossfade together rather than waiting for the outgoing one to
 * finish exiting first ("wait" mode), which would show a blank frame
 * between works — sync keeps the object feeling continuously present.
 */
export default function WorkPlayer({ works }: WorkPlayerProps) {
  const [index, setIndex] = useState(0);
  const work = works[index];

  const goPrev = () => setIndex((i) => (i - 1 + works.length) % works.length);
  const goNext = () => setIndex((i) => (i + 1) % works.length);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 px-[var(--edge-margin)] py-4 md:gap-6">
      <div className="flex min-h-0 w-full flex-1 items-center justify-center">
        <div className="relative aspect-[4/5] h-full max-h-[480px] w-auto max-w-full">
          <AnimatePresence mode="sync">
            <motion.div
              key={work.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: durationSeconds.base, ease: windEasing }}
              className="absolute inset-0"
            >
              <Link
                href={`/works/${work.slug}`}
                className="group block h-full w-full overflow-hidden rounded-lg bg-ws-ink/5 shadow-[0_24px_56px_-24px_rgba(28,28,26,0.28)] transition-opacity duration-300 hover:opacity-90"
              >
                <MediaRenderer media={work.media} fit="cover" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="text-center">
        <p className="font-instrument-sans text-[11px] font-medium uppercase tracking-[0.15em] text-ws-ink/50">
          {work.role}
        </p>
        <p className="mt-1 font-instrument-sans text-[17px] font-bold text-ws-ink">{work.title.toLowerCase()}</p>
      </div>

      <div className="flex items-center gap-6 rounded-full border border-ws-ink/10 bg-ws-ink/[0.03] px-5 py-2">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous work"
          className="font-instrument-sans text-[13px] text-ws-ink/50 transition-opacity hover:opacity-60"
        >
          &lsaquo;
        </button>
        <Link
          href={`/works/${work.slug}`}
          className="font-instrument-sans text-[10px] font-medium uppercase tracking-[0.15em] text-ws-ink transition-opacity hover:opacity-60"
        >
          view project
        </Link>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next work"
          className="font-instrument-sans text-[13px] text-ws-ink/50 transition-opacity hover:opacity-60"
        >
          &rsaquo;
        </button>
      </div>

      <div className="flex w-full max-w-[640px] items-center justify-center gap-2 overflow-x-auto">
        {works.map((w, i) => (
          <button
            key={w.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show ${w.title}`}
            aria-current={i === index}
            className={`relative h-11 w-11 shrink-0 overflow-hidden bg-ws-ink/5 transition-opacity ${
              i === index ? "ring-1 ring-ws-ink" : "opacity-45 hover:opacity-75"
            }`}
          >
            <MediaRenderer media={w.media} fit="cover" />
          </button>
        ))}
      </div>

      <div className="flex w-full max-w-[640px] items-center justify-between font-instrument-sans text-[10px] font-medium uppercase tracking-[0.15em] text-ws-ink/40">
        <span>{work.year}</span>
        <span className="tabular-nums">
          {pad2(index + 1)} / {pad2(works.length)}
        </span>
      </div>
    </div>
  );
}
