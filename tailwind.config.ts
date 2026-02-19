import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#ffffff",
        ink: "#0a0a0a",
        "ink-muted": "#555555",
        "ink-faint": "#999999",
        border: "#e0e0e0",
        accent: "#8B9E6B",
        "accent-muted": "#A3B585",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        pixel: ["var(--font-pixel)", "monospace"],
        dot: ["var(--font-dot)", "sans-serif"],
      },
      /* ─── 12-Column Grid System ─── */
      gridTemplateColumns: {
        layout: "repeat(12, 1fr)",
      },
      gap: {
        gutter: "1rem",   /* 16px gutter */
      },
      maxWidth: {
        grid: "1440px",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.5rem",
          lg: "2rem",
          xl: "2rem",
        },
        screens: {
          "2xl": "1440px",
        },
      },
      borderRadius: {
        lg: "0.625rem",
        md: "0.425rem",
        sm: "0.225rem",
      },
    },
  },
  plugins: [],
};

export default config;

