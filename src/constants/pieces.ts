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
  /** Home catalog frame media. Leave undefined for the typographic fallback. */
  cover?: CatalogCover;
  /** "cover" fills the frame; "center" lets portrait assets breathe on a paper field. */
  coverFit?: "cover" | "center";
  /** Aspect ratio string for the home strip frame (e.g. "16 / 9", "4 / 5", "1 / 1"). */
  coverAspect?: string;
  /** Width as a percentage of the strip column (0–100). Defaults to 100. */
  coverWidth?: number;
  tags: string[];
  /**
   * Optional alternate cover frame; revealed on hover. Same shape as
   * `cover` (video or image discriminated union) so the renderer can
   * reuse the existing branch. Diverges intentionally from spec §6's
   * `coverAlt?: string` for symmetry with `cover`.
   */
  coverAlt?: CatalogCover;
  /**
   * Optional caption microtype: EXIF, coordinate, location, source.
   * Renders as the 5th caption line per spec §9 (`Geist Sans 11px,
   * 0.08em tracking, var(--ink-4)`). The 4 mandatory fields above
   * (slug → number, title, year, sector → role, description) are
   * always present.
   */
  meta?: string;
  /**
   * When true, the plate renders as a static reserved cell (no link,
   * no cover, paper-2 fill). Used for "Untitled" placeholders that
   * hold the grid's rhythm before content lands.
   */
  placeholder?: boolean;
}

export const PIECES: Piece[] = [
  {
    slug: "untitled-01",
    title: "Untitled",
    type: "project",
    order: 1,
    number: "01",
    sector: "In development",
    description: "Coming 2026.",
    status: "wip",
    year: 2026,
    tags: [],
    placeholder: true,
  },
  {
    slug: "gyeol",
    title: "Gyeol: 결",
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
    coverAspect: "3 / 4",
    coverWidth: 68,
    tags: ["brand", "ecommerce", "3d"],
  },
  {
    slug: "untitled-03",
    title: "Untitled",
    type: "project",
    order: 3,
    number: "03",
    sector: "In development",
    description: "Coming 2026.",
    status: "wip",
    year: 2026,
    tags: [],
    placeholder: true,
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
    coverAspect: "9 / 16",
    coverWidth: 54,
    tags: ["mobile", "ai", "product"],
  },
  {
    slug: "untitled-05",
    title: "Untitled",
    type: "project",
    order: 5,
    number: "05",
    sector: "In development",
    description: "Coming 2026.",
    status: "wip",
    year: 2026,
    tags: [],
    placeholder: true,
  },
  {
    slug: "untitled-06",
    title: "Untitled",
    type: "project",
    order: 6,
    number: "06",
    sector: "In development",
    description: "Coming 2026.",
    status: "wip",
    year: 2026,
    tags: [],
    placeholder: true,
  },
  {
    slug: "untitled-07",
    title: "Untitled",
    type: "project",
    order: 7,
    number: "07",
    sector: "In development",
    description: "Coming 2026.",
    status: "wip",
    year: 2026,
    tags: [],
    placeholder: true,
  },
];
