export type ShelfKind = "MIXTAPE" | "BOOK" | "ZINE" | "RECORD" | "ESSAY" | "OBJECT";

export interface ShelfItem {
  id: string;
  kind: ShelfKind;
  title: string;
  subtitle: string;
  year: string;
  body: string;
  tags: string[];
}

export const SHELF: ShelfItem[] = [
  {
    id: "01",
    kind: "MIXTAPE",
    title: "Walks Between Meetings",
    subtitle: "Vol. 01 · Field Recordings",
    year: "2026",
    body: "Six ambient tracks cut between Brooklyn and the East River. For the moment before a hard problem.",
    tags: ["ambient", "nyc", "focus"],
  },
  {
    id: "02",
    kind: "BOOK",
    title: "The Nature of Order",
    subtitle: "Christopher Alexander",
    year: "2003",
    body: "Still the clearest argument I know for why some interfaces feel alive and others don't.",
    tags: ["craft", "systems", "slow"],
  },
  {
    id: "03",
    kind: "ZINE",
    title: "Notes on a Quiet Tool",
    subtitle: "Field Note · Spring 2026",
    year: "2026",
    body: "A short zine about designing Pane — what ambient software should feel like when it's actually quiet.",
    tags: ["practice", "draft"],
  },
  {
    id: "04",
    kind: "RECORD",
    title: "Twilight Index",
    subtitle: "A collection of sky colors",
    year: "Ongoing",
    body: "I photograph the sky every day at the Hanada hour. The index is slowly becoming a book.",
    tags: ["sky", "photography"],
  },
];
