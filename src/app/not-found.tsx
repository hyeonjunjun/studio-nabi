import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        maxWidth: 900,
        marginLeft: "8vw",
        paddingTop: 96,
        paddingRight: "clamp(24px, 5vw, 64px)",
      }}
    >
      <p
        className="font-mono"
        style={{
          fontSize: "clamp(48px, 8vw, 80px)",
          lineHeight: 1,
          color: "var(--ink-ghost)",
          letterSpacing: "-0.02em",
        }}
      >
        404
      </p>

      <p
        className="font-body"
        style={{
          fontSize: 15,
          color: "var(--ink-secondary)",
          marginTop: 16,
        }}
      >
        This page doesn&apos;t exist.
      </p>

      <Link
        href="/"
        className="font-mono uppercase"
        style={{
          display: "inline-block",
          fontSize: 11,
          letterSpacing: "0.06em",
          color: "var(--ink-muted)",
          marginTop: 24,
        }}
      >
        Return home
      </Link>
    </div>
  );
}
