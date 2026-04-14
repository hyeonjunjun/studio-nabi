"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavCoordinates() {
  const pathname = usePathname();
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const d = new Date();
      const hh = String(d.getUTCHours()).padStart(2, "0");
      const mm = String(d.getUTCMinutes()).padStart(2, "0");
      const ss = String(d.getUTCSeconds()).padStart(2, "0");
      const day = String(d.getUTCDate()).padStart(2, "0");
      const mon = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" }).toUpperCase();
      const yr = String(d.getUTCFullYear()).slice(-2);
      setTime(`GMT ${day} ${mon} ${yr}  ${hh}:${mm}:${ss}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const navActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ── Top bar ── */}
      <nav
        aria-label="Primary"
        style={{
          position: "fixed",
          top: 8,
          left: 8,
          right: 8,
          height: 28,
          zIndex: 50,
          background: "var(--pill-bg)",
          borderRadius: 3,
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "0 16px",
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--nd-600)",
        }}
      >
        <Link
          href="/"
          style={{ color: "var(--nd-100)", textDecoration: "none" }}
        >
          HKJ©&nbsp;&nbsp;<span style={{ color: "var(--nd-600)" }}>Design Engineer</span>
        </Link>
        <span style={{ justifySelf: "center", fontVariantNumeric: "tabular-nums" }}>
          {time}
        </span>
        <span style={{ justifySelf: "end" }}>
          Next Availability:&nbsp;&nbsp;<span style={{ color: "var(--nd-100)" }}>May 2026</span>
        </span>
      </nav>

      {/* ── Bottom-right section nav ── */}
      <div
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 50,
          display: "flex",
          gap: 16,
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {[
          { href: "/", label: "Index" },
          { href: "/about", label: "About" },
          { href: "/archive", label: "Archive" },
          { href: `mailto:hyeonjunjun07@gmail.com`, label: "Enquire", external: true },
        ].map((item) => {
          const active = !item.external && navActive(item.href);
          const content = (
            <span style={{
              color: active ? "var(--nd-1100)" : "var(--nd-700)",
              transition: "color 0.15s var(--ease)",
            }}>
              {active && <span style={{ marginRight: 6 }}>►</span>}
              {item.label}
            </span>
          );
          return item.external ? (
            <a key={item.label} href={item.href}>{content}</a>
          ) : (
            <Link key={item.label} href={item.href}>{content}</Link>
          );
        })}
      </div>

      {/* ── Bottom-left signature ── */}
      <div
        style={{
          position: "fixed",
          bottom: 16,
          left: 16,
          zIndex: 50,
          fontFamily: "var(--font-body)",
          fontSize: 20,
          fontStyle: "italic",
          fontWeight: 500,
          color: "var(--nd-1100)",
          letterSpacing: "-0.02em",
          lineHeight: 0.9,
          transform: "rotate(-4deg)",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        Hyeon<br />Jun
      </div>
    </>
  );
}
