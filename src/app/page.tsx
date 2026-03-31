"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { PIECES } from "@/constants/pieces";
import { CONTACT_EMAIL, SOCIALS } from "@/constants/contact";

const projects = PIECES.filter((p) => p.type === "project").sort(
  (a, b) => a.order - b.order
);

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);

  // Live clock
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () =>
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    fmt();
    const i = setInterval(fmt, 60_000);
    return () => clearInterval(i);
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!mainRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      mainRef.current.querySelectorAll(".fade-in").forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
      });
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.to(".nav", { opacity: 1, duration: 0.3 }, 0);
    tl.to(".headline", { opacity: 1, duration: 0.4 }, 0.1);
    tl.to(".project", { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, 0.3);
    tl.to(".foot", { opacity: 1, duration: 0.3 }, 0.5);

    // Set initial states for projects (slide up)
    gsap.set(".project", { y: 20 });
  }, []);

  return (
    <main className="home" id="main" ref={mainRef}>
      {/* Nav */}
      <header className="nav fade-in">
        <Link href="/" className="nav-mark">
          HKJ
        </Link>
        <div className="nav-links">
          <Link href="/about">About</Link>
          <a href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
        </div>
      </header>

      {/* Headline */}
      <div className="headline fade-in">
        <h1>where craft meets intention</h1>
      </div>

      {/* Projects */}
      <section className="projects">
        {projects.map((piece) => {
          const idx = PIECES.indexOf(piece);
          const href = `/work/${piece.slug}`;

          return (
            <Link key={piece.slug} href={href} className="project fade-in">
              <div className="project-img">
                {piece.image ? (
                  <Image
                    src={piece.image}
                    alt={piece.title}
                    width={800}
                    height={533}
                    sizes="(max-width: 768px) 90vw, 30vw"
                    priority={idx < 2}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div className="project-empty">
                    <span>{piece.status === "wip" ? "In progress" : ""}</span>
                  </div>
                )}
              </div>
              <div className="project-meta">
                <span className="project-name">{piece.title}</span>
                <span className="project-detail">
                  {piece.tags[0]} · {piece.year}
                </span>
              </div>
            </Link>
          );
        })}
      </section>

      {/* Footer */}
      <footer className="foot fade-in">
        <span>{time ? `New York · ${time}` : "\u00A0"}</span>
        <div className="foot-right">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.label}
            </a>
          ))}
          <span>Est. 2025</span>
        </div>
      </footer>
    </main>
  );
}
