import { notFound } from "next/navigation";
import Link from "next/link";
import { PIECES } from "@/constants/pieces";
import { CASE_STUDIES } from "@/constants/case-studies";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PIECES.filter((p) => p.type === "project").map((p) => ({
    slug: p.slug,
  }));
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const piece = PIECES.find((p) => p.slug === slug && p.type === "project");

  if (!piece) notFound();

  const cs = CASE_STUDIES[piece.slug];

  return (
    <div data-page-scrollable>
      {/* Back link */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          zIndex: 200,
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--ink-muted)",
            textDecoration: "none",
          }}
        >
          ← Back
        </Link>
      </div>

      {/* Hero */}
      <section
        data-flip-id={piece.slug}
        style={{
          backgroundColor: piece.cover.bg,
          color: piece.cover.text,
          padding: "72px 24px clamp(40px, 8vh, 72px)",
          minHeight: "40vh",
          display: "flex",
          alignItems: "flex-end",
          paddingTop: 120,
        }}
      >
        <div style={{ maxWidth: 680 }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 400,
              lineHeight: 1.1,
              margin: "0 0 16px",
              letterSpacing: "-0.01em",
            }}
          >
            {piece.title}
          </h1>
          <p
            style={{
              fontSize: "clamp(14px, 1.8vw, 16px)",
              lineHeight: 1.6,
              opacity: 0.8,
              margin: "0 0 20px",
              maxWidth: "52ch",
            }}
          >
            {piece.description}
          </p>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {piece.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  opacity: 0.55,
                }}
              >
                {tag}
              </span>
            ))}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                opacity: 0.55,
              }}
            >
              {piece.year}
            </span>
          </div>
        </div>
      </section>

      {/* Body */}
      <article
        style={{
          maxWidth: 680,
          margin: "0 auto",
          padding: "56px 24px 120px",
        }}
      >
        {cs ? (
          <>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(20px, 3vw, 28px)",
                fontWeight: 400,
                lineHeight: 1.2,
                color: "var(--ink-primary)",
                marginBottom: 24,
                letterSpacing: "-0.01em",
              }}
            >
              {cs.editorial.heading}
            </h2>
            <p
              style={{
                fontSize: "var(--text-body)",
                lineHeight: "var(--leading-body)",
                color: "var(--ink-secondary)",
                marginBottom: 32,
                maxWidth: "58ch",
              }}
            >
              {cs.editorial.copy}
            </p>

            {cs.process && (
              <>
                <div
                  style={{
                    height: 1,
                    backgroundColor: "rgba(var(--ink-rgb), 0.06)",
                    margin: "40px 0",
                  }}
                />
                <h3
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-meta)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--ink-muted)",
                    marginBottom: 16,
                  }}
                >
                  {cs.process.title}
                </h3>
                <p
                  style={{
                    fontSize: "var(--text-body)",
                    lineHeight: "var(--leading-body)",
                    color: "var(--ink-secondary)",
                    maxWidth: "58ch",
                  }}
                >
                  {cs.process.copy}
                </p>
              </>
            )}

            {cs.engineering && (
              <>
                <div
                  style={{
                    height: 1,
                    backgroundColor: "rgba(var(--ink-rgb), 0.06)",
                    margin: "40px 0",
                  }}
                />
                <h3
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-meta)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--ink-muted)",
                    marginBottom: 16,
                  }}
                >
                  {cs.engineering.title}
                </h3>
                <p
                  style={{
                    fontSize: "var(--text-body)",
                    lineHeight: "var(--leading-body)",
                    color: "var(--ink-secondary)",
                    maxWidth: "58ch",
                    marginBottom: 16,
                  }}
                >
                  {cs.engineering.copy}
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {cs.engineering.signals.map((signal) => (
                    <span
                      key={signal}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "var(--ink-muted)",
                        border: "1px solid rgba(var(--ink-rgb), 0.12)",
                        borderRadius: 3,
                        padding: "3px 8px",
                      }}
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <p
            style={{
              fontSize: "var(--text-body)",
              lineHeight: "var(--leading-body)",
              color: "var(--ink-secondary)",
              maxWidth: "58ch",
            }}
          >
            {piece.description}
          </p>
        )}
      </article>
    </div>
  );
}
