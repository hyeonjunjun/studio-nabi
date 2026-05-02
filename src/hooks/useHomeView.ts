"use client";

import { useCallback, useEffect, useState } from "react";

export type HomeView = "gallery" | "list";

const STORAGE_KEY = "hkj.home.view";
const DOM_KEY = "homeView"; // -> data-home-view

function readStored(): HomeView {
  if (typeof window === "undefined") return "gallery";
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "list" ? "list" : "gallery";
}

/**
 * Reads + writes the home view preference. Persists to localStorage
 * under "hkj.home.view" and mirrors the choice to
 * document.documentElement.dataset.homeView so CSS can govern visibility
 * of the two compositions without re-rendering. Pairs with HomeViewInit
 * which runs the same read in a blocking <head> script before paint.
 */
export function useHomeView(): {
  view: HomeView;
  setView: (next: HomeView) => void;
  toggle: () => void;
} {
  const [view, setViewState] = useState<HomeView>("gallery");

  // After hydration, read the stored value (the head-script already
  // set the DOM attribute; this just syncs React state).
  useEffect(() => {
    setViewState(readStored());
  }, []);

  const setView = useCallback((next: HomeView) => {
    setViewState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.dataset[DOM_KEY] = next;
    }
  }, []);

  const toggle = useCallback(() => {
    setView(view === "gallery" ? "list" : "gallery");
  }, [view, setView]);

  return { view, setView, toggle };
}
