export type PieceType = "project" | "experiment";

export type CatalogCover =
  | { kind: "video"; src: string; poster?: string }
  | { kind: "image"; src: string };

export interface Piece {
  slug: string;
  title: string;
  type: PieceType;
  order: number;
  number: string;
  sector: string;
  description: string;
  status: "shipped" | "wip";
  year: number;
  /** Hero asset for the /work/[slug] CaseStudy page. */
  image?: string;
  /** Home catalog frame media. Leave undefined for the typographic placeholder. */
  cover?: CatalogCover;
  /** "cover" fills the 16:9 frame; "center" lets portrait assets breathe on a paper field. */
  coverFit?: "cover" | "center";
  tags: string[];
}

export const PIECES: Piece[] = [
  {
    slug: "clouds-at-sea",
    title: "Clouds at Sea",
    type: "experiment",
    order: 1,
    number: "01",
    sector: "WebGL / Generative",
    description: "Somewhere between water and sky, the horizon dissolves.",
    status: "shipped",
    year: 2026,
    cover: { kind: "video", src: "/assets/cloudsatsea.mp4" },
    tags: ["webgl", "generative"],
  },
  {
    slug: "gyeol",
    title: "Gyeol: \uACB0",
    type: "project",
    order: 2,
    number: "02",
    sector: "Material Science",
    description: "Conceptual fragrance and e-commerce brand rooted in Korean craft traditions.",
    status: "shipped",
    year: 2026,
    image: "/images/gyeol-display-hanji.webp",
    cover: {
      kind: "video",
      src: "/assets/gyeol-broll-combined.mp4",
      poster: "/images/gyeol-spring.webp",
    },
    tags: ["brand", "ecommerce", "3d"],
  },
  {
    slug: "pane",
    title: "Pane",
    type: "project",
    order: 3,
    number: "03",
    sector: "Ambient Computing",
    description:
      "A Jarvis-like ambient dashboard — contextual telemetry, focused attention, quiet systems.",
    status: "wip",
    year: 2026,
    tags: ["dashboard", "ambient", "ai"],
  },
  {
    slug: "sift",
    title: "Sift",
    type: "project",
    order: 4,
    number: "04",
    sector: "Mobile / AI",
    description: "AI-powered tool for finding what matters in your camera roll.",
    status: "shipped",
    year: 2025,
    image: "/images/sift-v2.webp",
    cover: { kind: "image", src: "/images/sift-v2.webp" },
    coverFit: "center",
    tags: ["mobile", "ai", "product"],
  },
];
