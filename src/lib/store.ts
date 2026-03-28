import { create } from "zustand";

interface StudioStore {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

export const useStudioStore = create<StudioStore>((set) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  currentSection: "Hero",
  setCurrentSection: (section) => set({ currentSection: section }),
}));
