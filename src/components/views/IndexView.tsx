"use client";

import { SHEET_ITEMS } from "@/constants/sheet-items";
import { GridItem } from "@/components/GridItem";
import { BlueDot } from "@/components/BlueDot";

const GROUP_LABEL_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--ink-muted)",
  marginBottom: 24,
  display: "block",
};

export function IndexView() {
  const work = SHEET_ITEMS.filter((i) => i.type === "WORK");
  const brands = SHEET_ITEMS.filter((i) => i.type === "BRAND");
  const explore = SHEET_ITEMS.filter((i) => i.type === "EXPLORE");

  return (
    <div
      style={{
        overflowY: "auto",
        height: "calc(100vh - 88px)",
        padding: "80px 24px 48px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      {/* WORK */}
      <section style={{ marginBottom: 56 }}>
        <span style={GROUP_LABEL_STYLE}>Work</span>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {work.map((item, index) => (
            <div
              key={item.id}
              data-flip-id={item.id}
              style={{ position: index === 0 ? "relative" : undefined }}
            >
              {index === 0 && <BlueDot />}
              <GridItem item={item} style={{ aspectRatio: "16/10" }} />
            </div>
          ))}
        </div>
      </section>

      {/* BRANDS */}
      <section style={{ marginBottom: 56 }}>
        <span style={GROUP_LABEL_STYLE}>Brands</span>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 16,
          }}
        >
          {brands.map((item) => (
            <div key={item.id} data-flip-id={item.id}>
              <GridItem item={item} style={{ aspectRatio: "16/10" }} />
            </div>
          ))}
        </div>
      </section>

      {/* EXPLORATION */}
      <section style={{ marginBottom: 56 }}>
        <span style={GROUP_LABEL_STYLE}>Exploration</span>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
          }}
        >
          {explore.map((item) => (
            <div key={item.id} data-flip-id={item.id}>
              <GridItem item={item} style={{ aspectRatio: "1" }} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default IndexView;
