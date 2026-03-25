import { lazy, type ComponentType } from "react";

export interface ToyDef {
  name: string;
  color: string; // capsule color
  component: React.LazyExoticComponent<ComponentType<ToyProps>>;
}

export interface ToyProps {
  audio: {
    playNote: (freq: number) => void;
    playSqueak: () => void;
  };
  reducedMotion: boolean;
}

export const TOY_REGISTRY: Record<string, ToyDef> = {
  magic8ball: {
    name: "Magic 8-Ball",
    color: "#6b5b7b", // dusty purple
    component: lazy(() => import("./Magic8Ball")),
  },
  fortune: {
    name: "Fortune Cookie",
    color: "#c9a96e", // warm gold
    component: lazy(() => import("./FortuneCookie")),
  },
  snowglobe: {
    name: "Snow Globe",
    color: "#7ba3b8", // slate blue
    component: lazy(() => import("./SnowGlobe")),
  },
  piano: {
    name: "Tiny Piano",
    color: "#b87b7b", // dusty rose
    component: lazy(() => import("./TinyPiano")),
  },
  minitv: {
    name: "Mini TV",
    color: "#8b9b7b", // sage
    component: lazy(() => import("./MiniTV")),
  },
  etchasketch: {
    name: "Etch-a-Sketch",
    color: "#c47d5e", // terracotta
    component: lazy(() => import("./EtchASketch")),
  },
  duck: {
    name: "Rubber Duck",
    color: "#d4b84d", // yellow gold
    component: lazy(() => import("./RubberDuck")),
  },
  clock: {
    name: "Dual Clock",
    color: "#8b8b8b", // warm gray
    component: lazy(() => import("./DualClock")),
  },
  scratcher: {
    name: "Lotto Scratcher",
    color: "#9b8b6b", // khaki
    component: lazy(() => import("./LottoScratcher")),
  },
};

export const TOY_IDS = Object.keys(TOY_REGISTRY);
