export interface Exploration {
  id: string;
  title: string;
  medium: string;
  date: string;
  description: string;
  /** Hero media — image or video */
  hero: string;
  heroType: "image" | "video";
  /** Optional thumbnail override for gallery (defaults to hero) */
  thumbnail?: string;
  /** Dominant palette color for mood background */
  mood: string;
  /** Optional longer process note */
  process?: string;
}

export const EXPLORATIONS: Exploration[] = [
  {
    id: "clouds-at-sea",
    title: "Clouds at Sea",
    medium: "video",
    date: "2026-03",
    description: "Somewhere between water and sky, the horizon dissolves.",
    hero: "/assets/cloudsatsea.mp4",
    heroType: "video",
    mood: "#8BA4B8",
  },
  {
    id: "gyeol-spring",
    title: "Spring Grain",
    medium: "texture study",
    date: "2026-02",
    description: "Cherry blossom season captured in surface tension.",
    hero: "/images/gyeol-spring.png",
    heroType: "image",
    mood: "#C4B5A0",
  },
  {
    id: "gyeol-rain",
    title: "Rain on Stone",
    medium: "texture study",
    date: "2026-02",
    description: "Wet granite. The way water reveals what was always there.",
    hero: "/images/gyeol-rain.png",
    heroType: "image",
    mood: "#7A8B8C",
  },
  {
    id: "gyeol-hanji",
    title: "Hanji Display",
    medium: "material study",
    date: "2026-01",
    description: "Korean mulberry paper — light passes through, never pierces.",
    hero: "/images/gyeol display hanji.png",
    heroType: "image",
    mood: "#D4C8B8",
  },
  {
    id: "gyeol-green-tea",
    title: "Green Tea",
    medium: "color study",
    date: "2026-01",
    description: "Matcha as material. The green that calms before you taste it.",
    hero: "/images/gyeol-green tea.png",
    heroType: "image",
    mood: "#8B9E6B",
  },
  {
    id: "cushion-gyeol",
    title: "Cushion",
    medium: "form study",
    date: "2025-12",
    description: "Softness rendered. Where does the surface end and the light begin?",
    hero: "/images/cushion gyeol.png",
    heroType: "image",
    mood: "#B8A89C",
  },
];
