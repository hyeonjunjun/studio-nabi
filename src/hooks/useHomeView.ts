"use client";

import { useCallback, useSyncExternalStore } from "react";

export type HomeView = "gallery" | "list";

const STORAGE_KEY = "hkj.home.view";
const DOM_KEY = "homeView"; // -> data-home-view

function getSnapshot(): HomeView {
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "list" ? "list" : "gallery";
}

function getServerSnapshot(): HomeView {
  return "gallery";
}

// localStorage doesn't dispatch storage events for same-document writes.
// Keep a tiny in-module pubsub so setView() notifies subscribers in the
// same tab, and listen for cross-tab `storage` events for free.
const listeners = new Set<() => void>();

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * Reads + writes the home view preference. Persists to localStorage
 * under "hkj.home.view" and mirrors the choice to
 * document.documentElement.dataset.homeView so CSS can govern visibility
 * of the two compositions without re-rendering. Pairs with HomeViewInit
 * which runs the same read in a blocking <head> script before paint.
 *
 * Implemented via useSyncExternalStore — the React primitive for
 * subscribing to a non-React store. The in-module pubsub keeps multiple
 * ViewToggle instances in the same tab in sync; cross-tab sync comes
 * from the native `storage` event.
 */
export function useHomeView(): {
  view: HomeView;
  setView: (next: HomeView) => void;
  toggle: () => void;
} {
  const view = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setView = useCallback((next: HomeView) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.dataset[DOM_KEY] = next;
    listeners.forEach((cb) => cb());
  }, []);

  const toggle = useCallback(() => {
    setView(getSnapshot() === "gallery" ? "list" : "gallery");
  }, [setView]);

  return { view, setView, toggle };
}
