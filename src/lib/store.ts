import { create } from "zustand";

interface StudioState {
  /** True once critical resources are loaded */
  isLoaded: boolean;
  setLoaded: (v: boolean) => void;

  /** Whether the mobile menu is open */
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  isLoaded: false,
  setLoaded: (v) => set({ isLoaded: v }),

  mobileMenuOpen: false,
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),
}));
