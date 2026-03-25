"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { usePageTransition, TransitionOverlay } from "@/components/PageTransition";

export default function TransitionManager() {
  const router = useRouter();
  const pathname = usePathname();
  const { overlayRef, triggerExit, triggerEnter } = usePageTransition();

  // Listen for page-transition custom events from TransitionLink
  useEffect(() => {
    const handleTransition = async (e: Event) => {
      const { href } = (e as CustomEvent).detail;
      await triggerExit();
      router.push(href);
    };

    window.addEventListener("page-transition", handleTransition);
    return () => window.removeEventListener("page-transition", handleTransition);
  }, [triggerExit, router]);

  // Trigger enter animation when pathname changes
  useEffect(() => {
    triggerEnter();
  }, [pathname, triggerEnter]);

  return <TransitionOverlay overlayRef={overlayRef} />;
}
