"use client";

import { useStudioStore } from "@/lib/store";
import { applyTheme } from "@/lib/theme";

export function ThemeToggle() {
  const theme = useStudioStore((s) => s.theme);
  const toggleTheme = useStudioStore((s) => s.toggleTheme);

  function handleToggle() {
    toggleTheme();
    const nextTheme = theme === "light" ? "dark" : "light";
    applyTheme(nextTheme);
  }

  return (
    <button
      onClick={handleToggle}
      aria-label="Toggle dark mode"
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        fontSize: 12,
        color: "var(--ink-muted)",
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
      }}
    >
      {theme === "light" ? "☽" : "☀"}
    </button>
  );
}

export default ThemeToggle;
