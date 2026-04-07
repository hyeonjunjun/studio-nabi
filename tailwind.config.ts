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
        bg: "var(--bg)",
        "bg-elevated": "var(--bg-elevated)",
        fg: "var(--fg)",
        "fg-2": "var(--fg-2)",
        "fg-3": "var(--fg-3)",
        "fg-4": "var(--fg-4)",
        "accent-warm-1": "var(--accent-warm-1)",
        "accent-warm-2": "var(--accent-warm-2)",
        "accent-warm-3": "var(--accent-warm-3)",
        "accent-cool-1": "var(--accent-cool-1)",
        "accent-cool-2": "var(--accent-cool-2)",
        "accent-cool-3": "var(--accent-cool-3)",
      },
      fontFamily: {
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
        display: ["var(--font-display)"],
      },
      transitionTimingFunction: {
        ease: "var(--ease)",
      },
      screens: {
        mobile: { max: "768px" },
      },
    },
  },
  plugins: [],
};

export default config;
