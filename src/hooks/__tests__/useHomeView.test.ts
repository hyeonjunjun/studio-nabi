import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useHomeView } from "../useHomeView";

describe("useHomeView", () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset.homeView;
  });

  it("defaults to gallery when storage is empty", async () => {
    const { result } = renderHook(() => useHomeView());
    await waitFor(() => expect(result.current.view).toBe("gallery"));
  });

  it("reads list from localStorage on mount", async () => {
    window.localStorage.setItem("hkj.home.view", "list");
    const { result } = renderHook(() => useHomeView());
    // The hook returns "gallery" synchronously on first render and
    // syncs to stored value inside a useEffect. waitFor flushes
    // effects deterministically across React versions.
    await waitFor(() => expect(result.current.view).toBe("list"));
  });

  it("setView writes to localStorage and the data attribute", () => {
    const { result } = renderHook(() => useHomeView());
    act(() => result.current.setView("list"));
    expect(window.localStorage.getItem("hkj.home.view")).toBe("list");
    expect(document.documentElement.dataset.homeView).toBe("list");
  });

  it("toggle flips between gallery and list", async () => {
    const { result } = renderHook(() => useHomeView());
    await waitFor(() => expect(result.current.view).toBe("gallery"));
    act(() => result.current.toggle());
    expect(result.current.view).toBe("list");
    expect(window.localStorage.getItem("hkj.home.view")).toBe("list");
    act(() => result.current.toggle());
    expect(result.current.view).toBe("gallery");
    expect(window.localStorage.getItem("hkj.home.view")).toBe("gallery");
  });

  it("ignores invalid storage values, defaults to gallery", async () => {
    window.localStorage.setItem("hkj.home.view", "garbage");
    const { result } = renderHook(() => useHomeView());
    await waitFor(() => expect(result.current.view).toBe("gallery"));
  });
});
