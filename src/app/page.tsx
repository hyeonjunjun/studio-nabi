"use client";

import { GRID_ITEMS } from "@/constants/grid-items";
import MasonryGrid from "@/components/MasonryGrid";

export default function Home() {
  return (
    <div className="page-container">
      <section
        style={{
          paddingTop: "var(--space-break)",
          maxWidth: 1100,
        }}
      >
        <MasonryGrid items={GRID_ITEMS} />
      </section>
    </div>
  );
}
