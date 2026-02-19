import { create } from "zustand";

interface DesignStore {
    activeMood: string | null;
    isFocussed: boolean;
    setActiveMood: (mood: string | null) => void;
    setIsFocussed: (focussed: boolean) => void;
}

export const useDesignStore = create<DesignStore>((set) => ({
    activeMood: null,
    isFocussed: false,
    setActiveMood: (mood) => set({ activeMood: mood }),
    setIsFocussed: (focussed) => set({ isFocussed: focussed }),
}));
