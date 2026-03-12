"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PROJECTS } from "@/constants/projects";
import SplitText from "@/components/ui/SplitText";

/* ─── Layout presets for scattered zigzag grid ─── */

interface CardLayout {
  width: string;
  maxWidth: number;
  marginLeft: string;
  marginTop: string;
  aspectRatio: string;
}

const LAYOUTS: CardLayout[] = [
  {
    width: "55%",
    maxWidth: 800,
    marginLeft: "0%",
    marginTop: "0",
    aspectRatio: "3 / 2",
  },
  {
    width: "38%",
    maxWidth: 560,
    marginLeft: "55%",
    marginTop: "-6rem",
    aspectRatio: "4 / 3",
  },
  {
    width: "45%",
    maxWidth: 660,
    marginLeft: "18%",
    marginTop: "4rem",
    aspectRatio: "16 / 10",
  },
];

/* ═══════════════════════════════════════════
   SelectedWork — Scattered Asymmetric Grid
   Joffrey Spitzer-inspired zigzag image layout
   ═══════════════════════════════════════════ */

export default function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const displayProjects = PROJECTS.filter((p) => p.id !== "gyeol");

  useGSAP(
    () => {
      if (reduced || !sectionRef.current) return;

      gsap.from(".work-card", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          once: true,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-section="work"
      className="relative"
      style={{
        backgroundColor: "var(--color-bg)",
        padding: "8rem var(--page-px) 6rem",
      }}
    >
      {/* Section header */}
      <div className="flex items-end justify-between mb-16 md:mb-24">
        <SplitText
          text="Cases"
          tag="h2"
          type="chars"
          animation="slide-up"
          stagger={0.04}
          delay={0.1}
          duration={0.7}
          className="font-display"
          style={{
            fontSize: "clamp(3rem, 10vw, 8rem)",
            lineHeight: 0.95,
            color: "var(--color-text)",
          }}
        />
        <span
          className="font-mono uppercase hidden sm:block"
          style={{
            fontSize: "var(--text-micro)",
            letterSpacing: "0.2em",
            color: "var(--color-text-ghost)",
            paddingBottom: "0.5rem",
          }}
        >
          {String(displayProjects.length).padStart(2, "0")} Projects
        </span>
      </div>

      {/* Scattered grid */}
      <div className="scattered-grid flex flex-col">
        {displayProjects.map((project, i) => {
          const layout = LAYOUTS[i % LAYOUTS.length];
          const num = String(i + 1).padStart(2, "0");

          return (
            <Link
              key={project.id}
              href={`/work/${project.id}`}
              data-cursor="explore"
              className="work-card scattered-card group block"
              style={
                {
                  "--card-w": layout.width,
                  "--card-max-w": `${layout.maxWidth}px`,
                  "--card-ml": layout.marginLeft,
                  "--card-mt": i === 0 ? "0" : layout.marginTop,
                } as React.CSSProperties
              }
            >
              {/* Image */}
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: layout.aspectRatio }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
              </div>

              {/* Metadata */}
              <div className="flex items-start justify-between mt-4 gap-4">
                <div className="flex items-baseline gap-2">
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "var(--text-micro)",
                      color: "var(--color-text-ghost)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {num}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "var(--text-micro)",
                      color: "var(--color-text-ghost)",
                      opacity: 0.4,
                    }}
                  >
                    /
                  </span>
                  <span
                    className="font-display"
                    style={{
                      fontSize: "var(--text-lg)",
                      color: "var(--color-text)",
                    }}
                  >
                    {project.title.split(":")[0]}
                  </span>
                </div>
                <span
                  className="font-mono uppercase hidden sm:block shrink-0"
                  style={{
                    fontSize: "var(--text-micro)",
                    letterSpacing: "0.1em",
                    color: "var(--color-text-ghost)",
                    paddingTop: "0.25rem",
                  }}
                >
                  {project.sector}
                </span>
              </div>

              <p
                className="font-sans mt-1"
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-dim)",
                  lineHeight: 1.5,
                  maxWidth: 440,
                }}
              >
                {project.pitch}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
