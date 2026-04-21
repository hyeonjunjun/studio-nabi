"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string; key: string };

const ITEMS: NavItem[] = [
  { href: "/work",  label: "Work",  key: "01" },
  { href: "/about", label: "About", key: "02" },
  { href: "/shelf", label: "Shelf", key: "03" },
];

export default function NavCoordinates() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="nav">
      <Link href="/" className="nav__mark" aria-label="Hyeonjoon Jun — home">
        Hyeonjoon Jun
      </Link>

      <ol className="nav__list">
        {ITEMS.map((item) => {
          const active = pathname?.startsWith(item.href) ?? false;
          return (
            <li key={item.href} className="nav__item">
              <Link
                href={item.href}
                className={`nav__link${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <span className="nav__key">{item.key}</span>
                <span className="nav__label">{item.label}</span>
              </Link>
            </li>
          );
        })}
        <li className="nav__item">
          <a className="nav__link" href="mailto:hyeonjunjun07@gmail.com">
            <span className="nav__key">04</span>
            <span className="nav__label">Contact</span>
          </a>
        </li>
      </ol>

      <style>{`
        .nav {
          position: fixed;
          top: 20px;
          left: 24px;
          right: 24px;
          z-index: 50;
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          pointer-events: none;
        }

        .nav__mark {
          pointer-events: auto;
          font-family: var(--font-stack-serif);
          font-weight: 400;
          font-size: 14px;
          letter-spacing: 0.005em;
          color: var(--ink);
          transition: opacity 180ms var(--ease);
        }
        .nav__mark:hover { opacity: 0.55; }

        .nav__list {
          pointer-events: auto;
          list-style: none;
          display: flex;
          gap: 22px;
          align-items: baseline;
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .nav__link {
          display: inline-flex;
          gap: 6px;
          align-items: baseline;
          color: var(--ink-3);
          transition: color 180ms var(--ease);
        }
        .nav__link:hover { color: var(--ink); }
        .nav__link.is-active { color: var(--ink); }
        .nav__key { color: var(--ink-4); font-variant-numeric: tabular-nums; }

        @media (max-width: 640px) {
          .nav { top: 14px; left: 16px; right: 16px; }
          .nav__mark { font-size: 12px; }
          .nav__list { gap: 14px; font-size: 9px; }
          .nav__key { display: none; }
        }
      `}</style>
    </nav>
  );
}
