import type { OverlayType, ActiveView } from "@/lib/store";

export interface NavLink {
  label: string;
  href?: string;
  overlay?: OverlayType;
  view?: ActiveView;
}

export const NAV_LINKS: NavLink[] = [
  { label: "index", view: "index" },
  { label: "selects", view: "selects" },
  { label: "info", view: "info" },
];

export const MENU_LINKS: NavLink[] = [
  { label: "index", view: "index" },
  { label: "selects", view: "selects" },
  { label: "info", view: "info" },
  { label: "lab", href: "/lab" },
];
