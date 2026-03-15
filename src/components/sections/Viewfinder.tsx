"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PROJECTS } from "@/constants/projects";
import SequentialVideo from "@/components/ui/SequentialVideo";

/**
 * Viewfinder — Pinned Full-Viewport Cinematic Gallery
 *
 * Each project is a full-viewport scene pinned during scroll.
 * Media starts at scale(0.6) with rounded corners, then grows
 * to fill the entire viewport — dramatic, theatrical pacing.
 *
 * Last card plays in REVERSE: starts full-bleed and scales DOWN,
 * creating a pull-back "closing" of the gallery.
 *
 * GYEOL supports sequential b-roll via cardVideos array.
 */
export default function Viewfinder() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const mm = gsap.matchMedia();

    // ── Desktop: pinned gallery ──
    mm.add("(min-width: 768px)", () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-project-card]");
      const lastIndex = cards.length - 1;

      cards.forEach((card, idx) => {
        const wrapper = card.querySelector("[data-media-wrapper]") as HTMLElement;
        const media = card.querySelector("[data-media]") as HTMLElement;
        const overlay = card.querySelector("[data-overlay]") as HTMLElement;
        const info = card.querySelector("[data-info]") as HTMLElement;
        const isFirst = idx === 0;
        const isLast = idx === lastIndex;
        const isMiddle = !isFirst && !isLast;

        if (!wrapper || !media) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top top",
            end: "+=100%",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        });

        if (isLast) {
          // ── LAST CARD: Reversed — starts full, scales DOWN ──

          gsap.set(wrapper, { scale: 1, borderRadius: "0rem" });
          gsap.set(media, { scale: 1 });
          if (overlay) gsap.set(overlay, { opacity: 1 });

          if (info) {
            const children = info.querySelectorAll("[data-reveal]");
            gsap.set(children, { opacity: 1, y: 0 });
          }

          tl.to(wrapper, {
            scale: 0.6,
            borderRadius: "2rem",
            duration: 1,
            ease: "power2.inOut",
          });

          tl.to(media, { scale: 1.35, duration: 1, ease: "none" }, 0);

          if (overlay) {
            tl.to(overlay, { opacity: 0, duration: 0.5, ease: "none" }, 0);
          }

          if (info) {
            const children = info.querySelectorAll("[data-reveal]");
            tl.to(
              children,
              {
                opacity: 0,
                y: 60,
                duration: 0.4,
                stagger: 0.04,
                ease: "power2.in",
              },
              0
            );
          }
        } else if (isMiddle) {
          // ── MIDDLE CARDS: clipPath wipe reveal ──

          // Start full-scale but clipped from bottom
          gsap.set(wrapper, { scale: 1, borderRadius: "0rem", clipPath: "inset(100% 0% 0% 0%)" });
          gsap.set(media, { scale: 1.08 });

          // 1. Wipe in — clipPath reveals from bottom to top
          tl.to(
            wrapper,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1,
              ease: "power3.inOut",
            }
          );

          // 2. Subtle zoom settle on inner media
          tl.to(
            media,
            { scale: 1, duration: 1, ease: "power2.out" },
            0
          );

          // 3. Darken overlay
          if (overlay) {
            tl.fromTo(
              overlay,
              { opacity: 0 },
              { opacity: 1, duration: 0.5, ease: "none" },
              0.4
            );
          }

          // 4. Staggered info reveal
          if (info) {
            const children = info.querySelectorAll("[data-reveal]");
            tl.fromTo(
              children,
              { opacity: 0, y: 80 },
              {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.06,
                ease: "power3.out",
              },
              0.5
            );
          }
        } else {
          // ── FIRST CARD: Scale UP ──

          tl.fromTo(
            wrapper,
            { scale: 0.6, borderRadius: "2rem" },
            { scale: 1, borderRadius: "0rem", duration: 1, ease: "power2.inOut" }
          );

          tl.fromTo(
            media,
            { scale: 1.35 },
            { scale: 1, duration: 1, ease: "none" },
            0
          );

          if (overlay) {
            tl.fromTo(
              overlay,
              { opacity: 0 },
              { opacity: 1, duration: 0.5, ease: "none" },
              0.4
            );
          }

          if (info) {
            const children = info.querySelectorAll("[data-reveal]");
            tl.fromTo(
              children,
              { opacity: 0, y: 120 },
              {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.06,
                ease: "power3.out",
              },
              0.5
            );
          }
        }
      });
    });

    // ── Mobile: un-pinned with simpler reveals ──
    mm.add("(max-width: 767px)", () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-project-card]");

      cards.forEach((card) => {
        const wrapper = card.querySelector("[data-media-wrapper]") as HTMLElement;
        const media = card.querySelector("[data-media]") as HTMLElement;
        const info = card.querySelector("[data-info]") as HTMLElement;

        if (!wrapper || !media) return;

        gsap.fromTo(
          wrapper,
          { scale: 0.75, borderRadius: "1.5rem" },
          {
            scale: 1,
            borderRadius: "0rem",
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              end: "top 20%",
              scrub: 0.6,
            },
          }
        );

        gsap.fromTo(
          media,
          { scale: 1.2 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.4,
            },
          }
        );

        if (info) {
          gsap.fromTo(
            info.children,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.06,
              ease: "power3.out",
              scrollTrigger: {
                trigger: info,
                start: "top 90%",
              },
            }
          );
        }
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="viewfinder">
      {/* Section label */}
      <div
        className="section-padding"
        style={{
          paddingTop: "clamp(4rem, 8vh, 6rem)",
          paddingBottom: "clamp(2rem, 4vh, 3rem)",
        }}
      >
        <span className="micro">Selected Work</span>
      </div>

      {/* Project cards — full viewport each */}
      {PROJECTS.map((project, i) => {
        const isFirst = i === 0;
        const isLast = i === PROJECTS.length - 1;
        const isMiddle = !isFirst && !isLast;
        const isWip = project.wip;

        const cardContent = (
          <>
            {/* Media container — scale/clipPath target */}
            <div
              data-media-wrapper
              className="absolute inset-0 overflow-hidden"
              style={{
                transform: isMiddle ? "scale(1)" : isLast ? "scale(1)" : "scale(0.6)",
                borderRadius: isMiddle ? "0rem" : isLast ? "0rem" : "2rem",
                clipPath: isMiddle ? "inset(100% 0% 0% 0%)" : undefined,
                willChange: "transform, clip-path",
              }}
            >
              {/* Inner media — counter-parallax */}
              <div
                data-media
                className="absolute inset-0"
                style={{
                  transform: isMiddle ? "scale(1.08)" : isLast ? "scale(1)" : "scale(1.35)",
                  willChange: "transform",
                }}
              >
                {isWip ? (
                  /* WIP styled card — typographic treatment */
                  <div
                    className="w-full h-full relative"
                    style={{ backgroundColor: "var(--color-surface)" }}
                  >
                    {/* Subtle accent border inset */}
                    <div
                      className="absolute inset-8 md:inset-16"
                      style={{
                        border: `1px solid ${project.mood || "var(--color-border)"}`,
                        opacity: 0.15,
                      }}
                    />

                    {/* Centered WIP label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                      <span
                        className="font-mono"
                        style={{
                          fontSize: "var(--text-micro)",
                          letterSpacing: "0.25em",
                          textTransform: "uppercase",
                          color: project.mood || "var(--color-text-ghost)",
                          opacity: 0.6,
                        }}
                      >
                        In Progress
                      </span>
                      <div
                        style={{
                          width: 40,
                          height: 1,
                          backgroundColor: project.mood || "var(--color-accent)",
                          opacity: 0.3,
                        }}
                      />
                    </div>

                    {/* Corner markers */}
                    <span
                      className="absolute font-mono"
                      style={{
                        top: "clamp(1.5rem, 4vh, 3rem)",
                        left: "clamp(1.5rem, 4vw, 3rem)",
                        fontSize: "var(--text-micro)",
                        letterSpacing: "0.1em",
                        color: "var(--color-text-ghost)",
                        opacity: 0.4,
                      }}
                    >
                      WIP
                    </span>
                    <span
                      className="absolute font-mono"
                      style={{
                        top: "clamp(1.5rem, 4vh, 3rem)",
                        right: "clamp(1.5rem, 4vw, 3rem)",
                        fontSize: "var(--text-micro)",
                        letterSpacing: "0.1em",
                        color: "var(--color-text-ghost)",
                        opacity: 0.4,
                      }}
                    >
                      {project.year}
                    </span>
                  </div>
                ) : project.cardVideos && project.cardVideos.length > 1 ? (
                  <SequentialVideo
                    sources={project.cardVideos}
                    className="w-full h-full object-cover"
                    style={{ filter: "brightness(0.8)" }}
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
                    style={{ filter: "brightness(0.8)" }}
                  />
                ) : project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    style={{ filter: "brightness(0.8)" }}
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

              {/* Dark gradient overlay */}
              <div
                data-overlay
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(17,17,16,0.85) 0%, rgba(17,17,16,0.2) 50%, transparent 100%)",
                  opacity: isLast ? 1 : 0,
                }}
              />
            </div>

            {/* Project info — overlaid on media, bottom-left */}
            <div
              data-info
              className="absolute inset-0 z-10 flex flex-col justify-end"
              style={{
                padding: "clamp(2rem, 5vh, 4rem) var(--page-px)",
              }}
            >
              {/* Counter */}
              <span
                data-reveal
                className="font-mono"
                style={{
                  fontSize: "var(--text-micro)",
                  color: "rgba(212, 207, 199, 0.4)",
                  letterSpacing: "0.15em",
                }}
              >
                {String(i + 1).padStart(2, "0")} /{" "}
                {String(PROJECTS.length).padStart(2, "0")}
              </span>

              {/* Title — large display serif */}
              <h3
                data-reveal
                className="font-display"
                style={{
                  fontSize: "clamp(2rem, 5vw, 4.5rem)",
                  lineHeight: 1.05,
                  color: "#fff",
                  marginTop: "0.75rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {project.title}
              </h3>

              {/* Meta row */}
              <div
                data-reveal
                className="flex items-center gap-4 mt-4"
              >
                <span
                  className="font-mono"
                  style={{
                    fontSize: "var(--text-micro)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(212, 207, 199, 0.5)",
                  }}
                >
                  {project.sector}
                </span>
                <span
                  style={{
                    color: "rgba(212, 207, 199, 0.25)",
                    fontSize: "var(--text-micro)",
                  }}
                >
                  /
                </span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: "var(--text-micro)",
                    letterSpacing: "0.12em",
                    color: "rgba(212, 207, 199, 0.5)",
                  }}
                >
                  {project.year}
                </span>
                {isWip && (
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
                    &mdash; Coming Soon
                  </span>
                )}
              </div>

              {/* Pitch */}
              <p
                data-reveal
                className="font-sans"
                style={{
                  fontSize: "var(--text-small)",
                  color: "rgba(212, 207, 199, 0.45)",
                  lineHeight: 1.6,
                  maxWidth: "42ch",
                  marginTop: "0.75rem",
                }}
              >
                {project.pitch}
              </p>
            </div>
          </>
        );

        return (
          <div
            key={project.id}
            data-project-card
            className="relative w-full overflow-hidden"
            style={{
              height: "100vh",
              backgroundColor: "var(--color-bg)",
            }}
          >
            {isWip ? (
              <div className="block h-full w-full relative">
                {cardContent}
              </div>
            ) : (
              <Link
                href={`/work/${project.id}`}
                className="block h-full w-full relative"
                data-cursor="project"
              >
                {cardContent}
              </Link>
            )}
          </div>
        );
      })}
    </section>
  );
}
