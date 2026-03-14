import type { OverlayType } from "@/lib/store";

export interface NavLink {
  label: string;
  href?: string;
  overlay?: OverlayType;
}

export const NAV_LINKS: NavLink[] = [
  { label: "works", href: "/" },
  { label: "about", overlay: "about" },
  { label: "contact", overlay: "contact" },
];

export const MENU_LINKS: NavLink[] = [
  { label: "works", href: "/" },
  { label: "about", overlay: "about" },
  { label: "contact", overlay: "contact" },
  { label: "lab", href: "/lab" },
];
