"use client";

export function BottomBar() {
  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 32,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--ink-muted)",
          letterSpacing: "0.06em",
        }}
      >
        design engineer · brands · software
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--ink-muted)",
          letterSpacing: "0.06em",
        }}
      >
        NYC
      </span>
    </footer>
  );
}

export default BottomBar;
