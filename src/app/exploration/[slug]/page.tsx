"use client";

import { use, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { EXPLORATIONS } from "@/constants/explorations";

export default function ExplorationPiecePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const heroRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  const piece = EXPLORATIONS.find((e) => e.id === slug);
  const currentIndex = EXPLORATIONS.findIndex((e) => e.id === slug);
  const nextPiece =
    currentIndex < EXPLORATIONS.length - 1
      ? EXPLORATIONS[currentIndex + 1]
      : EXPLORATIONS[0];

  useEffect(() => {
    if (!heroRef.current || !metaRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      heroRef.current,
      { clipPath: "inset(8% 8% 8% 8%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2 }
    );

    tl.fromTo(
      metaRef.current.querySelectorAll("[data-reveal]"),
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.06 },
      "-=0.4"
    );
  }, [slug]);

  if (!piece) {
    return (
      <main
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--ink-secondary)" }}>Piece not found.</p>
      </main>
    );
  }

  return (
    <main>
      {/* Hero — full viewport */}
      <div
        ref={heroRef}
        style={{
          position: "relative",
          height: "100vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {piece.heroType === "video" ? (
          <video
            src={piece.hero}
            autoPlay
            muted
            loop
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Image
            src={piece.hero}
            alt={piece.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="100vw"
            quality={95}
            priority
          />
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 40%)",
          }}
        />

        {/* Back link */}
        <Link
          href="/exploration"
          className="font-mono"
          style={{
            position: "absolute",
            top: "clamp(1.5rem, 3vh, 2.5rem)",
            left: "var(--page-px)",
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)",
            zIndex: 10,
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLElement).style.color = "#fff")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.7)")
          }
        >
          Exploration
        </Link>

        {/* Title overlay */}
        <div
          style={{
            position: "absolute",
            bottom: "clamp(2rem, 5vh, 4rem)",
            left: "var(--page-px)",
            right: "var(--page-px)",
            zIndex: 10,
          }}
        >
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              color: "#fff",
              lineHeight: 1.1,
              fontStyle: "italic",
              textShadow: "0 2px 12px rgba(0,0,0,0.25)",
            }}
          >
            {piece.title}
          </h1>
        </div>
      </div>

      {/* Meta section */}
      <div
        ref={metaRef}
        style={{
          paddingLeft: "var(--page-px)",
          paddingRight: "var(--page-px)",
          paddingTop: "clamp(3rem, 6vh, 5rem)",
          paddingBottom: "clamp(4rem, 8vh, 7rem)",
          maxWidth: "640px",
        }}
      >
        <p
          data-reveal
          className="font-display"
          style={{
            fontSize: "var(--text-title)",
            color: "var(--ink-full)",
            lineHeight: 1.5,
            fontStyle: "italic",
          }}
        >
          {piece.description}
        </p>

        <div
          data-reveal
          style={{
            marginTop: "clamp(1.5rem, 3vh, 2.5rem)",
            display: "flex",
            gap: "2rem",
          }}
        >
          <div>
            <span
              className="font-mono"
              style={{
                fontSize: "10px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--ink-muted)",
              }}
            >
              Medium
            </span>
            <p
              className="font-mono"
              style={{
                fontSize: "12px",
                color: "var(--ink-secondary)",
                marginTop: "0.25rem",
              }}
            >
              {piece.medium}
            </p>
          </div>
          <div>
            <span
              className="font-mono"
              style={{
                fontSize: "10px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--ink-muted)",
              }}
            >
              Date
            </span>
            <p
              className="font-mono"
              style={{
                fontSize: "12px",
                color: "var(--ink-secondary)",
                marginTop: "0.25rem",
              }}
            >
              {piece.date}
            </p>
          </div>
        </div>

        {piece.process && (
          <p
            data-reveal
            style={{
              fontSize: "var(--text-body)",
              color: "var(--ink-secondary)",
              lineHeight: 1.7,
              marginTop: "clamp(2rem, 4vh, 3rem)",
            }}
          >
            {piece.process}
          </p>
        )}
      </div>

      {/* Next piece */}
      <Link
        href={`/exploration/${nextPiece.id}`}
        style={{
          display: "block",
          position: "relative",
          height: "50vh",
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        {nextPiece.heroType === "video" ? (
          <video
            src={nextPiece.hero}
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.7,
            }}
          />
        ) : (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
            }}
          >
            <Image
              src={nextPiece.hero}
              alt={nextPiece.title}
              fill
              style={{ objectFit: "cover", opacity: 0.7 }}
              sizes="100vw"
            />
          </div>
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.15)",
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Next
          </span>
          <span
            className="font-display"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              color: "#fff",
              fontStyle: "italic",
              marginTop: "0.5rem",
            }}
          >
            {nextPiece.title}
          </span>
        </div>
      </Link>
    </main>
  );
}
