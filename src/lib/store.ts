import { create } from "zustand";

interface StudioStore {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  // Preloader
  loaded: boolean;
  setLoaded: () => void;
  // Page transition
  transitioning: boolean;
  setTransitioning: (v: boolean) => void;
}

export const useStudioStore = create<StudioStore>((set) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  loaded: false,
  setLoaded: () => set({ loaded: true }),
  transitioning: false,
  setTransitioning: (v) => set({ transitioning: v }),
}));
