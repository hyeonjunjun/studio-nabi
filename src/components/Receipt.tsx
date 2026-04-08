"use client";

import type { Piece } from "@/constants/pieces";

interface ReceiptProps {
  piece: Piece;
  onView: () => void;
}

export default function Receipt({ piece, onView }: ReceiptProps) {
  const year = piece.status === "wip" ? "----" : String(piece.year);
  const status = piece.status === "wip" ? "IN PROGRESS" : "SHIPPED";
  const num = String(piece.order).padStart(2, "0");

  return (
    <div
      className="font-mono"
      style={{
        width: 240,
        padding: "16px 20px",
        background: "#faf8f5",
        boxShadow: "0 1px 4px rgba(42,37,32,0.06)",
        fontSize: 9,
        letterSpacing: "0.04em",
        color: "rgba(42, 37, 32, 0.7)",
        lineHeight: 1.8,
        userSelect: "text",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 10, letterSpacing: "0.08em", color: "rgba(42,37,32,0.9)" }}>
          HKJ STUDIO
        </span>
      </div>

      {/* Dashed divider */}
      <div style={{ borderTop: "1px dashed rgba(42,37,32,0.2)", margin: "6px 0" }} />

      {/* Item details */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>N.</span>
        <span>{num}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>ITEM</span>
        <span style={{ color: "rgba(42,37,32,0.9)" }}>{piece.title.toUpperCase()}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>YEAR</span>
        <span>{year}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>TYPE</span>
        <span>{piece.tags[0]?.toUpperCase() ?? "—"}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>STATUS</span>
        <span>{status}</span>
      </div>

      {/* Dashed divider */}
      <div style={{ borderTop: "1px dashed rgba(42,37,32,0.2)", margin: "6px 0" }} />

      {/* Description */}
      <p
        style={{
          fontSize: 8,
          lineHeight: 1.6,
          letterSpacing: "0.02em",
          color: "rgba(42,37,32,0.5)",
          margin: "4px 0",
        }}
      >
        {piece.description}
      </p>

      {/* Dashed divider */}
      <div style={{ borderTop: "1px dashed rgba(42,37,32,0.2)", margin: "6px 0" }} />

      {/* Footer */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={onView}
          data-cursor-label="View"
          style={{
            fontSize: 8,
            letterSpacing: "0.08em",
            color: "rgba(42,37,32,0.4)",
            transition: "color 0.3s ease",
            cursor: "pointer",
            background: "none",
            border: "none",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(42,37,32,0.9)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(42,37,32,0.4)")}
        >
          VIEW PROJECT
        </button>
      </div>
    </div>
  );
}
