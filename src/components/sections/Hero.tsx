"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useStudioStore } from "@/lib/store";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { NAV_LINKS } from "@/constants/navigation";

function useTime(tz: string) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 1_000);
    return () => clearInterval(id);
  }, [tz]);
  return time;
}

/**
 * Hero — Jonite-inspired layout
 *
 * In-flow nav at top (logo left, links spread right).
 * Below: two-column split.
 *   Left (~48%): serif descriptor centered, metadata cluster at bottom.
 *   Right (~52%): video starting partway down, respecting all padding.
 */
export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoInnerRef = useRef<HTMLVideoElement>(null);
  const isLoaded = useStudioStore((s) => s.isLoaded);
  const setMobileMenuOpen = useStudioStore((s) => s.setMobileMenuOpen);
  const nycTime = useTime("America/New_York");
  const seoulTime = useTime("Asia/Seoul");
  const prefersReduced = useReducedMotion();
  const lenis = useLenis();
  const router = useRouter();

  const handleNavClick = useCallback(
    (href: string) => {
      if (href.startsWith("#")) {
        const target = document.querySelector(href) as HTMLElement | null;
        if (target && lenis) {
          lenis.scrollTo(target, { duration: 1.2 });
        }
      } else {
        router.push(href);
      }
    },
    [lenis, router]
  );

  // Entrance reveal
  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;

    const els = containerRef.current.querySelectorAll("[data-hero-reveal]");
    gsap.fromTo(
      els,
      { opacity: 0 },
      { opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out" }
    );
  }, [isLoaded]);

  // Mouse parallax
  useEffect(() => {
    if (prefersReduced || !videoInnerRef.current) return;

    const video = videoInnerRef.current;
    const moveX = gsap.quickTo(video, "x", {
      duration: 0.8,
      ease: "power3.out",
    });
    const moveY = gsap.quickTo(video, "y", {
      duration: 0.8,
      ease: "power3.out",
    });

    const onMove = (e: MouseEvent) => {
      const cx = (e.clientX / window.innerWidth - 0.5) * 2;
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;
      moveX(cx * -16);
      moveY(cy * -10);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [prefersReduced]);

  // Scroll parallax
  useEffect(() => {
    if (prefersReduced || !videoInnerRef.current || !containerRef.current)
      return;

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 0.4,
      animation: gsap.fromTo(
        videoInnerRef.current,
        { yPercent: -3 },
        { yPercent: 5, ease: "none" }
      ),
    });

    return () => st.kill();
  }, [prefersReduced]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Nav — in flow, full width */}
      <div
        className="section-padding flex justify-between items-center"
        style={{ paddingTop: "clamp(1.5rem, 3vh, 2.5rem)", paddingBottom: 0 }}
        data-hero-reveal
      >
        <span
          className="font-display"
          style={{
            fontSize: "clamp(11px, 1vw, 13px)",
            color: "var(--color-text-dim)",
            letterSpacing: "0.05em",
          }}
        >
          HKJ
        </span>

        <div className="flex items-center gap-10 lg:gap-16">
          <div className="hidden md:flex items-center gap-10 lg:gap-16">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="font-mono relative group/link"
                style={{
                  fontSize: "var(--text-micro)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--color-text-dim)",
                }}
              >
                <span className="transition-colors duration-300 group-hover/link:text-[var(--color-text)]">
                  {link.label}
                </span>
                <span
                  className="absolute -bottom-0.5 left-0 right-0 h-[1px] origin-left scale-x-0 group-hover/link:scale-x-100 transition-transform duration-500"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              </button>
            ))}
          </div>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="group"
            style={{
              fontSize: "clamp(16px, 1.4vw, 20px)",
              color: "var(--color-text-dim)",
              lineHeight: 1,
            }}
            aria-label="Open menu"
          >
            <span className="group-hover:text-[var(--color-text)] transition-colors duration-300">
              ※
            </span>
          </button>
        </div>
      </div>

      {/* Content — two columns */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Left column — descriptor + metadata */}
        <div
          className="order-2 md:order-1 flex-1 md:flex-none md:w-[48%] flex flex-col"
          style={{
            paddingLeft: "var(--page-px)",
            paddingRight: "clamp(2rem, 3vw, 3rem)",
            paddingBottom: "clamp(2rem, 4vh, 3rem)",
          }}
          data-hero-reveal
        >
          {/* Descriptor — centered vertically */}
          <div className="flex-1 flex items-center">
            <p
              className="font-display"
              style={{
                fontSize: "clamp(1.3rem, 2vw, 1.9rem)",
                lineHeight: 1.4,
                color: "var(--color-text)",
                fontWeight: 300,
                maxWidth: "22ch",
              }}
            >
              Designing things that feel
              considered, from system
              to surface.
            </p>
          </div>

          {/* Metadata cluster — bottom */}
          <div className="flex items-end gap-10 flex-wrap">
            <div>
              <span
                className="font-mono block"
                style={{
                  fontSize: "var(--text-micro)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--color-text-ghost)",
                }}
              >
                New York
              </span>
              <span
                className="font-mono block mt-1"
                style={{
                  fontSize: "var(--text-micro)",
                  letterSpacing: "0.06em",
                  color: "var(--color-text-dim)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {nycTime || "--:--:--"}
              </span>
            </div>

            <div>
              <span
                className="font-mono block"
                style={{
                  fontSize: "var(--text-micro)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--color-text-ghost)",
                }}
              >
                Seoul
              </span>
              <span
                className="font-mono block mt-1"
                style={{
                  fontSize: "var(--text-micro)",
                  letterSpacing: "0.06em",
                  color: "var(--color-text-dim)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {seoulTime || "--:--:--"}
              </span>
            </div>

            <span
              className="font-mono ml-auto hidden md:block"
              style={{
                fontSize: "var(--text-micro)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-text-ghost)",
              }}
            >
              Est. &rsquo;26
            </span>
          </div>

          {/* Scroll indicator — anchored in left column */}
          <div
            className="flex items-center gap-3 mt-6"
          >
            <span
              className="font-mono"
              style={{
                fontSize: "var(--text-micro)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-text-ghost)",
              }}
            >
              Scroll
            </span>
            <div
              className="overflow-hidden"
              style={{ width: 24, height: 1 }}
            >
              <div
                style={{
                  width: "100%",
                  height: 1,
                  backgroundColor: "var(--color-text-dim)",
                  animation: "scrollLineHorizontal 2s ease-in-out infinite",
                }}
              />
            </div>
          </div>
        </div>

        {/* Right column — video, respects all padding */}
        <div
          className="order-1 md:order-2 h-[40vh] md:h-auto flex-none md:flex-1 relative"
          style={{
            paddingRight: "var(--page-px)",
            paddingBottom: "clamp(2rem, 4vh, 3rem)",
          }}
          data-hero-reveal
        >
          <div
            ref={videoWrapperRef}
            className="absolute overflow-hidden"
            style={{
              top: "18%",
              left: 0,
              right: "var(--page-px)",
              bottom: "clamp(2rem, 4vh, 3rem)",
              willChange: "transform",
            }}
          >
            <video
              ref={videoInnerRef}
              src="/assets/cloudsatsea.mp4"
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
              style={{
                backgroundColor: "var(--color-surface)",
                transform: "scale(1.1)",
                willChange: "transform",
              }}
            />
          </div>
        </div>
      </div>

    </section>
  );
}
