import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";
import { PIECES } from "@/constants/pieces";

const experiments = PIECES.filter((p) => p.type === "experiment").sort(
  (a, b) => a.order - b.order
);

const anim = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
  transition: { duration: 0.3 },
};

export default function ArchiveView() {
  const selectedSlug = useTheaterStore((s) => s.selectedSlug);
  const setSelectedSlug = useTheaterStore((s) => s.setSelectedSlug);
  const expandDetail = useTheaterStore((s) => s.expandDetail);

  // If current slug is not an experiment, select the first experiment
  useEffect(() => {
    const isExperiment = experiments.some((e) => e.slug === selectedSlug);
    if (!isExperiment && experiments.length > 0) {
      setSelectedSlug(experiments[0].slug);
    }
  }, [selectedSlug, setSelectedSlug]);

  const selected =
    experiments.find((p) => p.slug === selectedSlug) ?? experiments[0];

  if (!selected) return null;

  return (
    <motion.div className="w-full" {...anim}>
      {/* Experiment selector */}
      <div className="flex flex-col gap-1">
        {experiments.map((p) => (
          <button
            key={p.slug}
            onClick={() => setSelectedSlug(p.slug)}
            className="flex items-baseline gap-2 text-left"
            style={{
              color: p.slug === selected.slug ? "var(--fg)" : "var(--fg-3)",
            }}
          >
            <span
              className="font-mono text-[9px] tabular-nums"
              style={{ width: "5ch" }}
            >
              {String(p.order).padStart(2, "0")}
            </span>
            <span className="text-[14px]">{p.title}</span>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div
        className="h-px w-8 my-5"
        style={{ background: "var(--fg-4)" }}
      />

      {/* Metadata grid */}
      <div
        className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 font-mono text-[9px] uppercase tracking-[0.06em]"
      >
        <span style={{ color: "var(--fg-3)" }}>N</span>
        <span style={{ color: "var(--fg-2)" }}>
          {String(selected.order).padStart(2, "0")}
        </span>

        <span style={{ color: "var(--fg-3)" }}>Title</span>
        <span style={{ color: "var(--fg-2)" }}>{selected.title}</span>

        <span style={{ color: "var(--fg-3)" }}>Year</span>
        <span style={{ color: "var(--fg-2)" }}>{selected.year}</span>

        <span style={{ color: "var(--fg-3)" }}>Type</span>
        <span style={{ color: "var(--fg-2)" }}>
          {selected.tags.join(" / ")}
        </span>

        <span style={{ color: "var(--fg-3)" }}>Status</span>
        <span style={{ color: "var(--fg-2)" }}>{selected.status}</span>
      </div>

      {/* Description */}
      <p
        className="mt-4 text-[13px] max-w-[320px]"
        style={{ color: "var(--fg-2)", lineHeight: 1.7 }}
      >
        {selected.description}
      </p>

      {/* View details button */}
      <button
        onClick={expandDetail}
        data-cursor-label="View"
        className="mt-5 font-mono text-[9px] uppercase tracking-[0.06em]"
        style={{ color: "var(--fg)" }}
      >
        View details &rarr;
      </button>
    </motion.div>
  );
}
