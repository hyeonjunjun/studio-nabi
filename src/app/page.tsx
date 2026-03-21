"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";
import { gsap } from "@/lib/gsap";
import { PROJECTS } from "@/constants/projects";

// TODO: Replace "hkj" wordmark with a proper logotype/monogram asset
// TODO: Add a hero tagline beneath the wordmark (e.g. "Design Engineering")

const visibleProjects = PROJECTS.filter((p) => !p.wip);

export default function Home() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll("[data-project-card]");
    gsap.fromTo(
      cards,
      { autoAlpha: 0, y: 32 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.07,
        delay: 0.1,
      }
    );
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        paddingTop: "clamp(5rem, 10vh, 8rem)",
        paddingBottom: "var(--section-py)",
      }}
    >
      {/* ── Hero header ── */}
      {/* TODO: Add a tagline or brief studio descriptor here */}
      <header
        className="section-padding"
        style={{ marginBottom: "clamp(3rem, 7vh, 6rem)" }}
      >
        <h1
          className="font-display italic"
          style={{
            fontSize: "var(--text-display)",
            color: "var(--color-text)",
            lineHeight: 1.1,
          }}
        >
          Selected Work
        </h1>
        <p
          style={{
            fontSize: "var(--text-body)",
            color: "var(--color-text-secondary)",
            marginTop: "0.5rem",
          }}
        >
          Design engineering — craft at every layer.
        </p>
      </header>

      {/* ── Project grid ── */}
      <div
        ref={gridRef}
        className="section-padding"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
          gap: "clamp(1.5rem, 3vw, 2.5rem)",
        }}
      >
        {visibleProjects.map((project) => (
          <TransitionLink
            key={project.id}
            href={`/work/${project.id}`}
            data-project-card
            style={{ visibility: "hidden", display: "block" }}
          >
            <article
              style={{
                backgroundColor: "var(--color-surface)",
                borderRadius: "4px",
                overflow: "hidden",
                transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.transform = "translateY(-4px)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")
              }
            >
              {/* Cover image or color fill */}
              <div
                style={{
                  aspectRatio: project.cardFormat === "portrait" ? "3/4" : "16/10",
                  position: "relative",
                  backgroundColor: project.cover?.bg ?? "var(--color-elevated)",
                  overflow: "hidden",
                }}
              >
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={85}
                  />
                ) : null}
              </div>

              {/* Card meta */}
              <div style={{ padding: "1rem 1.25rem 1.25rem" }}>
                <div
                  className="flex items-center justify-between"
                  style={{ marginBottom: "0.25rem" }}
                >
                  <span
                    className="font-mono uppercase"
                    style={{
                      fontSize: "var(--text-micro)",
                      letterSpacing: "0.1em",
                      color: "var(--color-text-ghost)",
                    }}
                  >
                    {project.sector}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "var(--text-micro)",
                      color: "var(--color-text-ghost)",
                    }}
                  >
                    {project.year}
                  </span>
                </div>
                <h2
                  className="font-display"
                  style={{
                    fontSize: "var(--text-h3)",
                    color: "var(--color-text)",
                    lineHeight: 1.25,
                  }}
                >
                  {project.title}
                </h2>
                <p
                  style={{
                    fontSize: "var(--text-small)",
                    color: "var(--color-text-secondary)",
                    marginTop: "0.35rem",
                    lineHeight: 1.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {project.pitch}
                </p>
              </div>
            </article>
          </TransitionLink>
        ))}
      </div>

      {/* ── Coddiwomple section ── */}
      <section
        className="section-padding"
        style={{
          marginTop: "clamp(4rem, 10vh, 8rem)",
          paddingTop: "2rem",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <div className="flex items-end justify-between">
          <div>
            <h2
              className="font-display italic"
              style={{
                fontSize: "var(--text-h2)",
                color: "var(--color-text)",
                lineHeight: 1.1,
              }}
            >
              Coddiwomple
            </h2>
            <p
              style={{
                fontSize: "var(--text-body)",
                color: "var(--color-text-secondary)",
                marginTop: "0.4rem",
                maxWidth: "38ch",
              }}
            >
              Visual studies, material research, and things that caught the light.
            </p>
          </div>
          <TransitionLink
            href="/coddiwomple"
            className="font-mono uppercase"
            style={{
              fontSize: "var(--text-micro)",
              letterSpacing: "0.1em",
              color: "var(--color-text-dim)",
              transition: "color 0.2s ease",
              flexShrink: 0,
              marginLeft: "2rem",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "var(--color-text)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "var(--color-text-dim)")
            }
          >
            View all →
          </TransitionLink>
        </div>
      </section>

      {/* TODO: Add footer signature / contact line here */}
      {/* TODO: Consider a custom cursor for the grid hover states */}
      {/* TODO: favicon — update /app/favicon.ico with a custom mark */}
    </main>
  );
}
