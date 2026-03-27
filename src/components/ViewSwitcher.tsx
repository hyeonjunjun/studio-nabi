"use client";

import { useStudioStore, type ViewMode } from "@/lib/store";
import { flipTransition } from "@/lib/flip";

const VIEWS: { label: string; value: ViewMode }[] = [
  { label: "Index", value: "index" },
  { label: "Drift", value: "drift" },
  { label: "Archive", value: "archive" },
];

interface ViewSwitcherProps {
  containerRef?: React.RefObject<HTMLElement | null>;
}

export function ViewSwitcher({ containerRef }: ViewSwitcherProps) {
  const activeView = useStudioStore((s) => s.activeView);
  const setActiveView = useStudioStore((s) => s.setActiveView);

  function handleClick(view: ViewMode) {
    if (view === activeView) return;

    if (containerRef?.current) {
      flipTransition(containerRef.current, () => setActiveView(view));
    } else {
      setActiveView(view);
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      {VIEWS.map(({ label, value }) => {
        const isActive = activeView === value;
        return (
          <button
            key={value}
            onClick={() => handleClick(value)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: isActive ? "var(--ink-full)" : "var(--ink-muted)",
              borderBottom: isActive ? "1px solid var(--ink-full)" : "1px solid transparent",
              background: "none",
              border: "none",
              borderBottom: isActive ? "1px solid var(--ink-full)" : "1px solid transparent",
              cursor: "pointer",
              padding: "2px 0",
              transition: "color 150ms ease",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--ink-secondary)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--ink-muted)";
              }
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default ViewSwitcher;
