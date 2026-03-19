import { create } from "zustand";

interface StudioState {
  /** Whether the initial preloader has played */
  isLoaded: boolean;
  setIsLoaded: (v: boolean) => void;

  /** Whether the mobile menu is open */
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;

  /** Homepage view mode */
  viewMode: "list" | "slider";
  setViewMode: (v: "list" | "slider") => void;

  /** Active project index in slider mode */
  activeProjectIndex: number;
  setActiveProjectIndex: (v: number) => void;

  /** Page transition state */
  isTransitioning: boolean;
  pendingRoute: string | null;
  startTransition: (route: string) => void;
  endTransition: () => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  isLoaded: false,
  setIsLoaded: (v) => set({ isLoaded: v }),

  mobileMenuOpen: false,
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),

  viewMode: "list",
  setViewMode: (v) => set({ viewMode: v }),

  activeProjectIndex: 0,
  setActiveProjectIndex: (v) => set({ activeProjectIndex: v }),

  isTransitioning: false,
  pendingRoute: null,
  startTransition: (route) =>
    set({ isTransitioning: true, pendingRoute: route }),
  endTransition: () =>
    set({ isTransitioning: false, pendingRoute: null }),
}));
