import { create } from "zustand";

export type OverlayType = "about" | "contact" | null;
export type ViewMode = "list" | "grid";

interface StudioState {
    /** True once critical resources are loaded */
    isLoaded: boolean;
    setLoaded: (v: boolean) => void;

    /** Currently visible section for nav tracking */
    activeSection: string;
    setActiveSection: (s: string) => void;

    /** Project slug being transitioned to (for page transition) */
    transitionProject: string | null;
    setTransitionProject: (id: string | null) => void;

    /** Active full-screen overlay (about / contact) */
    activeOverlay: OverlayType;
    setActiveOverlay: (overlay: OverlayType) => void;

    /** Homepage gallery view mode */
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;

    /** True when hero-to-grid scroll animation has completed */
    gridRevealed: boolean;
    setGridRevealed: (v: boolean) => void;
}

export const useStudioStore = create<StudioState>((set) => ({
    isLoaded: false,
    setLoaded: (v) => set({ isLoaded: v }),

    activeSection: "hero",
    setActiveSection: (s) => set({ activeSection: s }),

    transitionProject: null,
    setTransitionProject: (id) => set({ transitionProject: id }),

    activeOverlay: null,
    setActiveOverlay: (overlay) => set({ activeOverlay: overlay }),

    viewMode: "grid",
    setViewMode: (mode) => set({ viewMode: mode }),

    gridRevealed: false,
    setGridRevealed: (v) => set({ gridRevealed: v }),
}));
