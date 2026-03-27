"use client";

import Link from "next/link";
import { useStudioStore } from "@/lib/store";
import { MobileMenu } from "@/components/MobileMenu";

const NAV_LINKS = [
  { label: "Work", href: "/work" },
  { label: "Lab", href: "/lab" },
  { label: "About", href: "/about" },
];

export function GlobalNav() {
  const setMobileMenuOpen = useStudioStore((s) => s.setMobileMenuOpen);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          background: "transparent",
        }}
      >
        {/* Left: HKJ wordmark */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--ink-muted)",
            textDecoration: "none",
          }}
        >
          HKJ
        </Link>

        {/* Right: nav links (desktop) / hamburger (mobile) */}
        <nav className="desktop-nav" aria-label="Main navigation">
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {NAV_LINKS.map(({ label, href }) => (
              <NavLink key={href} href={href} label={label} />
            ))}
          </div>
        </nav>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--ink-ghost)",
          }}
        >
          Menu
        </button>
      </header>

      <style>{`
        .desktop-nav { display: none; }
        .mobile-menu-btn { display: block; }

        @media (min-width: 768px) {
          .desktop-nav { display: block; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>

      <MobileMenu />
    </>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "var(--ink-ghost)",
        textDecoration: "none",
        transition: "color 250ms ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink-muted)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink-ghost)";
      }}
    >
      {label}
    </Link>
  );
}

export default GlobalNav;
