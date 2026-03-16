"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { PROJECTS } from "@/constants/projects";
import Colophon from "@/components/sections/Colophon";
import SequentialVideo from "@/components/ui/SequentialVideo";

/**
 * Work Index — Typographic project archive
 *
 * Numbered rows with title, metadata, and video/image thumbnails.
 * Hover: index number shifts to accent, thumbnail lifts.
 * WobblyRule dividers between entries.
 */
export default function WorkPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const rows = containerRef.current.querySelectorAll("[data-work-row]");
    rows.forEach((row) => {
      gsap.fromTo(
        row,
        { opacity: 0.15, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
          },
        }
      );
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Header */}
      <header
        className="section-padding"
        style={{
          paddingTop: "clamp(10rem, 18vh, 14rem)",
          paddingBottom: "clamp(3rem, 6vh, 5rem)",
        }}
      >
        <Link
          href="/"
          className="font-mono inline-block mb-16 transition-colors duration-300 hover:text-[var(--color-accent)]"
          style={{
            fontSize: "var(--text-micro)",
            color: "var(--color-text-dim)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          &larr; Back
        </Link>

        <span className="micro block mb-6">Selected Work</span>

        <p
          className="font-sans"
          style={{
            fontSize: "var(--text-body)",
            color: "var(--color-text-secondary)",
            maxWidth: "48ch",
            lineHeight: 1.7,
          }}
        >
          Projects spanning material science, design systems, and mobile
          experiences.
        </p>
      </header>

      {/* Project index */}
      <section
        className="section-padding"
        style={{ paddingBottom: "clamp(6rem, 12vh, 10rem)" }}
      >
        {PROJECTS.map((project, i) => {
          const isWip = project.wip;
          const num = String(i + 1).padStart(2, "0");

          const row = (
            <article data-work-row className="group/row py-10 md:py-14">
              <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                {/* Index number */}
                <span
                  className="font-display flex-none md:w-20 transition-colors duration-500 group-hover/row:text-[var(--color-accent)]"
                  style={{
                    fontSize: "clamp(2.5rem, 4vw, 4rem)",
                    lineHeight: 0.9,
                    color: "var(--color-border-strong)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {num}
                </span>

                {/* Text content */}
                <div className="flex-1 min-w-0">
                  <h2
                    className="font-display"
                    style={{
                      fontSize: "var(--text-h2)",
                      lineHeight: 1.2,
                      color: "var(--color-text)",
                    }}
                  >
                    {project.title}
                  </h2>

                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span
                      className="font-mono"
                      style={{
                        fontSize: "var(--text-micro)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--color-text-dim)",
                      }}
                    >
                      {project.sector}
                    </span>
                    <span
                      style={{
                        color: "var(--color-text-ghost)",
                        fontSize: "var(--text-micro)",
                      }}
                    >
                      &middot;
                    </span>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: "var(--text-micro)",
                        letterSpacing: "0.1em",
                        color: "var(--color-text-dim)",
                      }}
                    >
                      {project.year}
                    </span>
                    {isWip && (
                      <>
                        <span
                          style={{
                            color: "var(--color-text-ghost)",
                            fontSize: "var(--text-micro)",
                          }}
                        >
                          &middot;
                        </span>
                        <span
                          className="font-mono"
                          style={{
                            fontSize: "var(--text-micro)",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: project.mood || "var(--color-accent)",
                            opacity: 0.7,
                          }}
                        >
                          In Progress
                        </span>
                      </>
                    )}
                  </div>

                  <p
                    className="font-sans mt-4"
                    style={{
                      fontSize: "var(--text-small)",
                      color: "var(--color-text-ghost)",
                      lineHeight: 1.7,
                      maxWidth: "44ch",
                    }}
                  >
                    {project.pitch}
                  </p>

                  {/* Tags */}
                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono"
                        style={{
                          fontSize: "var(--text-micro)",
                          letterSpacing: "0.06em",
                          color: "var(--color-text-ghost)",
                          border: "1px solid var(--color-border)",
                          padding: "0.15em 0.5em",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Thumbnail / video preview */}
                <div
                  className="flex-none overflow-hidden transition-transform duration-700 ease-out group-hover/row:scale-[1.02]"
                  style={{
                    width: "clamp(200px, 24vw, 320px)",
                    aspectRatio: "16/10",
                    backgroundColor: "var(--color-surface)",
                  }}
                >
                  {isWip ? (
                    <div
                      className="w-full h-full relative"
                      style={{ backgroundColor: "var(--color-surface)" }}
                    >
                      <div
                        className="absolute inset-3"
                        style={{
                          border: `1px solid ${project.mood || "var(--color-border)"}`,
                          opacity: 0.12,
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className="font-mono"
                          style={{
                            fontSize: "var(--text-micro)",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: "var(--color-text-ghost)",
                            opacity: 0.3,
                          }}
                        >
                          WIP
                        </span>
                      </div>
                    </div>
                  ) : project.cardVideos && project.cardVideos.length > 1 ? (
                    <SequentialVideo
                      sources={project.cardVideos}
                      className="w-full h-full object-cover"
                    />
                  ) : project.cardVideo ? (
                    <video
                      src={project.cardVideo}
                      muted
                      autoPlay
                      loop
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  ) : project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundColor: project.mood || "var(--color-surface)",
                      }}
                    />
                  )}
                </div>
              </div>
            </article>
          );

          return (
            <div key={project.id}>
              {i > 0 && <div className="hairline" />}
              {isWip ? (
                row
              ) : (
                <Link
                  href={`/work/${project.id}`}
                  className="block"
                  data-cursor="project"
                >
                  {row}
                </Link>
              )}
            </div>
          );
        })}
      </section>

      <Colophon />
    </div>
  );
}
