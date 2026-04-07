"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

interface TransitionContextValue {
  navigateTo: (href: string) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextValue>({
  navigateTo: () => {},
  isTransitioning: false,
});

export function useTransitionRouter() {
  return useContext(TransitionContext);
}

/**
 * Page transition wrapper.
 *
 * Flow: click → exit animation (300ms) → router.push → entrance animation
 *
 * Each page's content fades/slides out, the route changes, then the new page's
 * content fades/slides in. UI chrome (particles, cursor) stays persistent.
 */
export default function TransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [currentPath, setCurrentPath] = useState(pathname);
  const pendingHref = useRef<string | null>(null);

  // When children/pathname change (after route), update display
  if (pathname !== currentPath && !isTransitioning) {
    setCurrentPath(pathname);
    setDisplayChildren(children);
  }

  // Also update if children change while on same path (initial render, etc)
  if (pathname === currentPath && children !== displayChildren && !isTransitioning) {
    setDisplayChildren(children);
  }

  const navigateTo = useCallback(
    (href: string) => {
      if (href === pathname || isTransitioning) return;

      pendingHref.current = href;
      setIsTransitioning(true);

      // After exit animation completes, navigate
      setTimeout(() => {
        router.push(href);
        // Give Next.js a tick to update, then play entrance
        setTimeout(() => {
          setIsTransitioning(false);
          pendingHref.current = null;
        }, 50);
      }, 350); // Exit animation duration
    },
    [pathname, isTransitioning, router]
  );

  return (
    <TransitionContext.Provider value={{ navigateTo, isTransitioning }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPath}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="h-full"
        >
          {displayChildren}
        </motion.div>
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}
