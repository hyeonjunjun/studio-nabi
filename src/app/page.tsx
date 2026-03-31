"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { PIECES } from "@/constants/pieces";
import { CONTACT_EMAIL, SOCIALS } from "@/constants/contact";

const pieces = [...PIECES].sort((a, b) => a.order - b.order);

type Filter = "all" | "brand" | "product" | "lab";

function matchesFilter(piece: (typeof pieces)[0], filter: Filter): boolean {
  if (filter === "all") return true;
  if (filter === "lab") return piece.type === "experiment";
  if (filter === "brand")
    return piece.tags.some((t) => ["brand", "ecommerce", "3d", "texture", "material"].includes(t));
  if (filter === "product")
    return piece.tags.some((t) => ["mobile", "ai", "product", "design-system", "ui", "webgl", "generative"].includes(t));
  return true;
}

const TAG_MAP: Record<string, string> = {
  brand: "BD", ecommerce: "BD", "3d": "BD",
  mobile: "PD", ai: "AI", product: "PD",
  "design-system": "PD", ui: "PD",
  texture: "CD", material: "CD", webgl: "CD", generative: "CD",
};

function getTag(tags: string[]): string {
  for (const t of tags) if (TAG_MAP[t]) return TAG_MAP[t];
  return "CD";
}

// Grid items: projects + statement card + mark card
type GridItem =
  | { kind: "project"; piece: (typeof pieces)[0]; globalIndex: number }
  | { kind: "statement" }
  | { kind: "mark" };

function buildGrid(filtered: typeof pieces): GridItem[] {
  const items: GridItem[] = [];

  filtered.forEach((piece, i) => {
    const globalIndex = pieces.indexOf(piece);
    items.push({ kind: "project", piece, globalIndex });

    // Insert statement card after 3rd project
    if (i === 2) items.push({ kind: "statement" });
  });

  // Mark card at the end
  items.push({ kind: "mark" });

  return items;
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [hoverImageIdx, setHoverImageIdx] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = pieces.filter((p) => matchesFilter(p, activeFilter));
  const gridItems = buildGrid(filtered);

  const filters: { label: string; value: Filter }[] = [
    { label: "All", value: "all" },
    { label: "Product", value: "product" },
    { label: "Brand", value: "brand" },
    { label: "Lab", value: "lab" },
  ];

  // Hover image cycling
  useEffect(() => {
    if (!hoveredSlug) return;
    setHoverImageIdx(0);
    const interval = setInterval(() => {
      setHoverImageIdx((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, [hoveredSlug]);

  // Entrance animation
  useEffect(() => {
    if (!gridRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gridRef.current.querySelectorAll(".card-enter").forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
        (el as HTMLElement).style.transform = "none";
      });
      return;
    }

    const cards = gridRef.current.querySelectorAll(".card-enter");
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.06,
      ease: "power4.out",
      delay: 0.1,
    });
  }, [activeFilter]);

  // Current time for top bar
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true }));
    };
    fmt();
    const i = setInterval(fmt, 60_000);
    return () => clearInterval(i);
  }, []);

  return (
    <>
      {/* Cloud background */}
      <div className="cloud-bg" />

      {/* Top bar */}
      <header className="top-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(16px, 3vw, 32px)" }}>
          <span className="top-bar-mark">HKJ</span>
          <span className="top-bar-live">{time ? `New York · ${time}` : ""}</span>
        </div>
        <nav className="top-bar-nav">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
          ))}
          <a href={`mailto:${CONTACT_EMAIL}`}>Connect</a>
          <Link href="/about">About</Link>
        </nav>
      </header>

      {/* Card grid */}
      <div className="card-grid" ref={gridRef} id="main">
        {gridItems.map((item) => {
          if (item.kind === "statement") {
            return (
              <div key="statement" className="card card--statement card-enter">
                <div />
                <div>
                  <div className="statement-headline">
                    Build with intention<br />
                    Make things that feel right
                  </div>
                  <div className="statement-sub">
                    Curated works at the intersection of design, engineering, and craft.
                  </div>
                </div>
                <div />
              </div>
            );
          }

          if (item.kind === "mark") {
            return (
              <div key="mark" className="card card--mark card-enter">
                <div />
                <div>
                  <div className="mark-logo">HKJ</div>
                  <div className="mark-sub">HKJ Studio — Est. 2025</div>
                </div>
                <div />
              </div>
            );
          }

          const { piece, globalIndex } = item;
          const tag = getTag(piece.tags);
          const href = piece.type === "project" ? `/work/${piece.slug}` : `/lab/${piece.slug}`;
          const isHovered = hoveredSlug === piece.slug;
          const images = piece.image ? [piece.image] : [];
          const currentImage = images.length > 0 ? images[hoverImageIdx % images.length] : null;

          return (
            <Link
              key={piece.slug}
              href={href}
              className="card card-enter"
              onMouseEnter={() => setHoveredSlug(piece.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
            >
              {/* Hover image layer */}
              {currentImage && (
                <div className={`card-image-layer${isHovered ? " visible" : ""}`}>
                  <Image
                    src={currentImage}
                    alt={piece.title}
                    fill
                    sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, 17vw"
                  />
                  <div className="card-image-overlay" />
                  <div className="card-image-text">
                    <div className="card-name">{piece.title}</div>
                    <div className="card-foot">
                      <span>{piece.year}</span>
                      <span>{piece.status === "wip" ? "WIP" : "—"}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Default text content */}
              <div className="card-head">
                <span>{String(globalIndex + 1).padStart(2, "0")}</span>
                <span>{tag}</span>
              </div>
              <div className="card-body">
                <div className="card-desc">{piece.description}</div>
                <div className="card-name">{piece.title}</div>
              </div>
              <div className="card-foot">
                <span>{piece.year}</span>
                <span>{piece.status === "wip" ? "WIP" : "—"}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom bar */}
      <footer className="bottom-bar">
        <div className="bottom-bar-filters">
          {filters.map((f) => (
            <button
              key={f.value}
              className={`filter-btn${activeFilter === f.value ? " active" : ""}`}
              onClick={() => setActiveFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className="bottom-bar-info">
          Design engineer — brands, products, concepts
        </span>
      </footer>
    </>
  );
}
