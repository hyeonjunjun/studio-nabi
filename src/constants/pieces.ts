export type PieceType = "project" | "experiment";
export type WaveMode = "sine" | "noise";

export interface Piece {
  slug: string;
  title: string;
  type: PieceType;
  order: number;
  number: string;
  sector: string;
  description: string;
  accent: string;
  frequency: number;
  amplitude: number;
  waveMode: WaveMode;
  status: "shipped" | "wip";
  year: number;
  image?: string;
  coverArt?: string;
  video?: string;
  tags: string[];
}

export const PIECES: Piece[] = [
  {
    slug: "gyeol",
    title: "Gyeol: \uACB0",
    type: "project",
    order: 1,
    number: "01",
    sector: "Material Science",
    description: "Conceptual fragrance and e-commerce brand rooted in Korean craft traditions.",
    accent: "#8B7355",
    frequency: 0.004,
    amplitude: 6,
    waveMode: "sine",
    status: "shipped",
    year: 2026,
    image: "/images/gyeol-display-hanji.webp",
    coverArt: "/images/gyeol-spring.webp",
    video: "/assets/gyeol-broll-combined.mp4",
    tags: ["brand", "ecommerce", "3d"],
  },
  {
    slug: "sift",
    title: "Sift",
    type: "project",
    order: 2,
    number: "02",
    sector: "Mobile / AI",
    description: "AI-powered tool for finding what matters in your camera roll.",
    accent: "#CF957B",
    frequency: 0.006,
    amplitude: 3,
    waveMode: "sine",
    status: "shipped",
    year: 2025,
    image: "/images/sift-v2.webp",
    tags: ["mobile", "ai", "product"],
  },
  {
    slug: "promptineer",
    title: "Promptineer",
    type: "project",
    order: 3,
    number: "03",
    sector: "Design Systems",
    description: "A design system that orchestrates consistency across product surfaces.",
    accent: "",
    frequency: 0,
    amplitude: 4,
    waveMode: "noise",
    status: "wip",
    year: 2026,
    tags: ["design-system", "ui"],
  },
  {
    slug: "clouds-at-sea",
    title: "Clouds at Sea",
    type: "experiment",
    order: 4,
    number: "04",
    sector: "WebGL / Generative",
    description: "Somewhere between water and sky, the horizon dissolves.",
    accent: "#8BA4B8",
    frequency: 0.002,
    amplitude: 10,
    waveMode: "sine",
    status: "shipped",
    year: 2026,
    video: "/assets/cloudsatsea.mp4",
    tags: ["webgl", "generative"],
  },
];
