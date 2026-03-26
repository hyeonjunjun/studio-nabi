/**
 * Unified grid items for the homepage masonry layout.
 * Combines projects, brands, and explorations into one curated arrangement.
 */

export type GridItemType = "work" | "brand" | "exploration";
export type GridSize = "large" | "medium" | "small" | "tall";

export interface GridItem {
  id: string;
  title: string;
  type: GridItemType;
  size: GridSize;
  year: string;
  image?: string;
  imageBlur?: string;
  video?: string;
  href: string;
  bg?: string;
  text?: string;
  status?: "shipped" | "wip";
}

/**
 * The curated homepage grid.
 * Order and size are intentional — this is the layout.
 */
export const GRID_ITEMS: GridItem[] = [
  // Row 1: Hero project (large) + exploration (small)
  {
    id: "gyeol",
    title: "GYEOL: 결",
    type: "work",
    size: "large",
    year: "2026",
    image: "/images/gyeol-display-hanji.webp",
    imageBlur: "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACwAQCdASoIAAgABUB8JYgCdACkHCGAAPvK+2OSZrljwuJp7MSZzsNF6n+VQAAA",
    href: "/work/gyeol",
  },
  {
    id: "spring-grain",
    title: "Spring Grain",
    type: "exploration",
    size: "small",
    year: "2026",
    image: "/images/gyeol-spring.webp",
    href: "/exploration",
  },

  // Row 2: Two medium projects
  {
    id: "sift",
    title: "Sift",
    type: "work",
    size: "medium",
    year: "2025",
    image: "/images/sift-v2.webp",
    imageBlur: "data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADQAQCdASoIAAgABUB8JbAC7ADdSgBAQAD2n1jIQGi7bxrzIrGXy4r6PIMvhFNjFhOc0IAA",
    href: "/work/sift",
  },
  {
    id: "conductor",
    title: "Conductor",
    type: "work",
    size: "medium",
    year: "2026",
    bg: "#3d3830",
    text: "rgba(255, 252, 245, 0.80)",
    href: "/work/conductor",
    status: "wip",
  },

  // Row 3: Exploration (tall) + brand placeholder
  {
    id: "clouds-at-sea",
    title: "Clouds at Sea",
    type: "exploration",
    size: "tall",
    year: "2026",
    video: "/assets/cloudsatsea.mp4",
    href: "/exploration",
  },
  {
    id: "rain-on-stone",
    title: "Rain on Stone",
    type: "exploration",
    size: "small",
    year: "2026",
    image: "/images/gyeol-rain.webp",
    href: "/exploration",
  },
];
