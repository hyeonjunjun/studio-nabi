"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useStudioStore } from "@/lib/store";
import { NAV_LINKS } from "@/constants/navigation";
import MobileMenu from "@/components/MobileMenu";

/**
 * GlobalNav — Minimal cinematic nav
 *
 * HKJ mark (left) + ※ menu trigger (right).
 * No visible text links — everything goes through the overlay menu.
 * Hidden in hero, appears after scrolling past.
 * Scroll-direction show/hide.
 */
export default function GlobalNav() {
  const mobileMenuOpen = useStudioStore((s) => s.mobileMenuOpen);
  const setMobileMenuOpen = useStudioStore((s) => s.setMobileMenuOpen);
  const isLoaded = useStudioStore((s) => s.isLoaded);
  const navRef = useRef<HTMLElement>(null);
  const symbolRef = useRef<HTMLButtonElement>(null);
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

  // Show/hide based on scroll direction + hero threshold
  useEffect(() => {
    if (!navRef.current) return;

    const nav = navRef.current;
    let pastHero = false;

    gsap.set(nav, { y: -100, opacity: 0 });

    const hero = document.getElementById("hero");
    if (!hero) return;

    // Track whether we've scrolled past the hero
    const heroTrigger = ScrollTrigger.create({
      trigger: hero,
      start: "bottom top",
      onEnter: () => {
        pastHero = true;
        gsap.to(nav, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" });
      },
      onLeaveBack: () => {
        pastHero = false;
        gsap.to(nav, { y: -100, opacity: 0, duration: 0.3, ease: "power2.in" });
      },
    });

    // Direction-based show/hide — only active past the hero
    const directionTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (!pastHero) return;

        if (self.direction === 1) {
          // Scrolling down → hide
          gsap.to(nav, { y: -100, opacity: 0, duration: 0.3, ease: "power2.in", overwrite: true });
        } else {
          // Scrolling up → show
          gsap.to(nav, { y: 0, opacity: 1, duration: 0.3, ease: "power3.out", overwrite: true });
        }
      },
    });

    return () => {
      heroTrigger.kill();
      directionTrigger.kill();
    };
  }, []);

  // Entrance after preloader
  useEffect(() => {
    if (!isLoaded || !navRef.current) return;

    gsap.fromTo(
      navRef.current.querySelectorAll("[data-nav-el]"),
      { opacity: 0 },
      { opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
    );
  }, [isLoaded]);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{
          padding: "clamp(0.75rem, 2vh, 1.25rem) var(--page-px)",
          backgroundColor: "rgba(var(--color-bg-rgb), 0.92)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        {/* Studio mark */}
        <a href="/" data-nav-el>
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
        </a>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6" data-nav-el>
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

        {/* ※ Menu trigger — all screen sizes */}
        <button
          ref={symbolRef}
          onClick={() => setMobileMenuOpen(true)}
          data-nav-el
          className="group relative"
          style={{
            fontSize: "clamp(16px, 1.4vw, 20px)",
            color: "var(--color-text-dim)",
            lineHeight: 1,
            transition: "color 0.3s ease",
          }}
          aria-label="Open menu"
          onMouseEnter={() => {
            if (symbolRef.current) {
              gsap.to(symbolRef.current, {
                rotation: 90,
                duration: 0.4,
                ease: "power3.out",
              });
            }
          }}
          onMouseLeave={() => {
            if (symbolRef.current) {
              gsap.to(symbolRef.current, {
                rotation: 0,
                duration: 0.4,
                ease: "power3.out",
              });
            }
          }}
        >
          <span className="group-hover:text-[var(--color-text)] transition-colors duration-300">
            ※
          </span>
        </button>
      </nav>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
