"use client";

import { useParams } from "next/navigation";
import CaseStudy from "@/components/CaseStudy";
import { PIECES } from "@/constants/pieces";

export default function WorkDetailPage() {
  const params = useParams<{ slug: string }>();
  const piece = PIECES.find((p) => p.slug === params?.slug);

  if (!piece) {
    return (
      <main
        id="main"
        style={{
          paddingTop: 120,
          paddingLeft: "8vw",
          paddingRight: "clamp(24px, 5vw, 64px)",
          maxWidth: 900,
        }}
      >
        <p
          className="font-mono uppercase"
          style={{
            fontSize: 11,
            letterSpacing: "0.06em",
            color: "var(--ink-muted)",
          }}
        >
          Project not found.
        </p>
      </main>
    );
  }

  return (
    <main id="main">
      <CaseStudy piece={piece} />
    </main>
  );
}
