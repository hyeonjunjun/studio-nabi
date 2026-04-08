"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";
import { PIECES } from "@/constants/pieces";
import { CASE_STUDIES } from "@/constants/case-studies";

export default function DetailView() {
  const selectedSlug = useTheaterStore((s) => s.selectedSlug);
  const setSelectedSlug = useTheaterStore((s) => s.setSelectedSlug);
  const collapseDetail = useTheaterStore((s) => s.collapseDetail);
  const expandDetail = useTheaterStore((s) => s.expandDetail);

  const allProjects = PIECES.filter((p) => p.type === "project").sort(
    (a, b) => a.order - b.order
  );

  const piece = PIECES.find((p) => p.slug === selectedSlug);
  if (!piece) return null;

  const cs = CASE_STUDIES[piece.slug];
  const num = String(piece.order).padStart(2, "0");

  // Next project (wrapping)
  const currentIdx = allProjects.findIndex((p) => p.slug === piece.slug);
  const nextProject = allProjects[(currentIdx + 1) % allProjects.length];

  return (
    <motion.div
      className="w-full h-full overflow-y-auto"
      style={{ scrollbarWidth: "none" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          paddingInline: "clamp(24px, 5vw, 64px)",
        }}
      >
        {/* ── Metadata header ── */}
        <div
          style={{
            paddingTop: 24,
            paddingBottom: 48,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <div className="font-mono" style={{ fontSize: 9, letterSpacing: "0.06em", color: "var(--fg-3)" }}>
            <span>{num}</span>
            <span style={{ margin: "0 8px", opacity: 0.3 }}>/</span>
            <span>{piece.title.toUpperCase()}</span>
            <span style={{ margin: "0 8px", opacity: 0.3 }}>/</span>
            <span>{piece.status === "wip" ? "WIP" : piece.year}</span>
          </div>
          <span
            className="font-mono uppercase"
            style={{ fontSize: 9, letterSpacing: "0.06em", color: "var(--fg-3)" }}
          >
            {piece.tags.join(" / ")}
          </span>
        </div>

        {/* ── Hero image ── */}
        {piece.image && (
          <div style={{ marginBottom: 64 }}>
            <Image
              src={piece.image}
              alt={piece.title}
              width={1600}
              height={1000}
              sizes="900px"
              className="w-full"
              style={{ display: "block", objectFit: "cover" }}
              priority
            />
          </div>
        )}

        {/* ── Title + Description ── */}
        <div style={{ marginBottom: 64 }}>
          <h1
            className="font-display"
            style={{
              fontSize: 16,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              lineHeight: 1.3,
              color: "var(--fg)",
              marginBottom: 16,
            }}
          >
            {piece.title}
          </h1>
          <p
            className="font-display"
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              letterSpacing: "-0.01em",
              color: "var(--fg-2)",
              maxWidth: 480,
            }}
          >
            {piece.description}
          </p>
        </div>

        {/* ── Case study sections ── */}
        {cs && (
          <>
            {/* Editorial */}
            <div style={{ marginBottom: 64 }}>
              <span
                className="font-mono uppercase block"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.06em",
                  color: "var(--fg-3)",
                  marginBottom: 20,
                }}
              >
                Overview
              </span>
              <p
                className="font-display"
                style={{
                  fontSize: 14,
                  lineHeight: 1.8,
                  letterSpacing: "-0.01em",
                  color: "var(--fg-2)",
                  maxWidth: 520,
                }}
              >
                {cs.editorial.copy}
              </p>
            </div>

            {/* Process */}
            {cs.process && (
              <div style={{ marginBottom: 64 }}>
                <span
                  className="font-mono uppercase block"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.06em",
                    color: "var(--fg-3)",
                    marginBottom: 20,
                  }}
                >
                  {cs.process.title}
                </span>
                <p
                  className="font-display"
                  style={{
                    fontSize: 14,
                    lineHeight: 1.8,
                    letterSpacing: "-0.01em",
                    color: "var(--fg-2)",
                    maxWidth: 520,
                  }}
                >
                  {cs.process.copy}
                </p>
              </div>
            )}

            {/* Engineering */}
            {cs.engineering && (
              <div style={{ marginBottom: 64 }}>
                <span
                  className="font-mono uppercase block"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.06em",
                    color: "var(--fg-3)",
                    marginBottom: 20,
                  }}
                >
                  {cs.engineering.title}
                </span>
                <p
                  className="font-display"
                  style={{
                    fontSize: 14,
                    lineHeight: 1.8,
                    letterSpacing: "-0.01em",
                    color: "var(--fg-2)",
                    maxWidth: 520,
                    marginBottom: 20,
                  }}
                >
                  {cs.engineering.copy}
                </p>
                <div className="flex flex-wrap" style={{ gap: 8 }}>
                  {cs.engineering.signals.map((s) => (
                    <span
                      key={s}
                      className="font-mono uppercase"
                      style={{
                        fontSize: 8,
                        letterSpacing: "0.06em",
                        color: "var(--fg-3)",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Next project ── */}
        {nextProject && (
          <div
            style={{
              borderTop: "1px solid var(--fg-4)",
              paddingTop: 32,
              paddingBottom: 64,
              marginTop: 32,
            }}
          >
            <button
              onClick={() => {
                setSelectedSlug(nextProject.slug);
                // Scroll back to top
                const scrollEl = document.querySelector("[data-detail-scroll]");
                scrollEl?.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-left group"
              data-cursor-label="Next"
            >
              <span
                className="font-mono uppercase block"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.06em",
                  color: "var(--fg-3)",
                  marginBottom: 8,
                }}
              >
                Next
              </span>
              <span
                className="font-body block"
                style={{
                  fontSize: 13,
                  color: "var(--fg-2)",
                  transition: "color 0.3s ease",
                }}
              >
                {nextProject.title}
              </span>
            </button>
          </div>
        )}

        {/* ── Bottom project index ── */}
        <div
          style={{
            borderTop: "1px solid var(--fg-4)",
            paddingTop: 24,
            paddingBottom: 48,
          }}
        >
          <span
            className="font-mono uppercase block"
            style={{
              fontSize: 9,
              letterSpacing: "0.06em",
              color: "var(--fg-3)",
              marginBottom: 16,
            }}
          >
            Index
          </span>
          <div className="flex flex-col" style={{ gap: 0 }}>
            {allProjects.map((p) => {
              const isActive = p.slug === piece.slug;
              return (
                <button
                  key={p.slug}
                  onClick={() => {
                    if (p.slug === piece.slug) return;
                    setSelectedSlug(p.slug);
                    const scrollEl = document.querySelector("[data-detail-scroll]");
                    scrollEl?.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-left font-body"
                  style={{
                    padding: "8px 0",
                    display: "flex",
                    alignItems: "baseline",
                    gap: 16,
                    color: isActive ? "var(--fg)" : "var(--fg-3)",
                    transition: "color 0.3s ease",
                  }}
                >
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.04em",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {String(p.order).padStart(2, "0")}
                  </span>
                  <span style={{ fontSize: 13, letterSpacing: "-0.005em" }}>
                    {p.title}
                  </span>
                  <span
                    className="font-mono ml-auto"
                    style={{ fontSize: 9, letterSpacing: "0.04em", color: "var(--fg-3)" }}
                  >
                    {p.status === "wip" ? "WIP" : p.year}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
