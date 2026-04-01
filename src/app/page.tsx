"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PIECES } from "@/constants/pieces";
import { CONTACT_EMAIL } from "@/constants/contact";

const projects = PIECES.filter((p) => p.type === "project").sort(
  (a, b) => a.order - b.order
);

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const router = useRouter();

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

  // Page transition: fade out before navigation
  const navigateTo = useCallback(
    (href: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      if (!mainRef.current) {
        router.push(href);
        return;
      }
      mainRef.current.classList.add("page-exit");
      setTimeout(() => router.push(href), 300);
    },
    [router]
  );

  return (
    <main className="home border-reveal" id="main" ref={mainRef}>
      {/* Nav */}
      <header className="nav">
        <Link href="/" className="nav-mark">HKJ</Link>
        <div className="nav-links">
          <a href="/about" onClick={navigateTo("/about")}>About</a>
          <a href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
        </div>
      </header>

      {/* Center */}
      <div className="center">
        <div className="headline">
          <h1>Design, engineered.</h1>
        </div>

        <section className="projects">
          {projects.map((piece) => {
            const href = `/work/${piece.slug}`;
            return (
              <a
                key={piece.slug}
                href={href}
                onClick={navigateTo(href)}
                className="project"
              >
                <div className="project-img">
                  {piece.image ? (
                    <Image
                      src={piece.image}
                      alt={piece.title}
                      width={800}
                      height={600}
                      sizes="(max-width: 768px) 90vw, 30vw"
                      priority
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="project-empty">
                      <span>{piece.status === "wip" ? "Coming soon" : ""}</span>
                    </div>
                  )}
                </div>
                <span className="project-name">{piece.title}</span>
                <span className="project-detail">{piece.tags[0]} · {piece.year}</span>
              </a>
            );
          })}
        </section>
      </div>

      {/* Footer */}
      <footer className="foot">
        <span>{time ? `New York · ${time}` : "\u00A0"}</span>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </footer>
    </main>
  );
}
