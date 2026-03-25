/**
 * "The Evening" animation presets.
 * All reveals use blur as the primary primitive — content comes into focus,
 * not slides into place. Based on Devouring Details vocabulary.
 *
 * Easing: ease-swift = cubic-bezier(.23, .88, .26, .92)
 * GSAP equivalent: "power3.out" is closest but we use CustomEase where possible.
 */

export const EASE_SWIFT = "power3.out";

export const REVEAL_HERO = {
  from: { opacity: 0, y: 40, filter: "blur(4px)" },
  to: { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: EASE_SWIFT, stagger: 0.08 },
};

export const REVEAL_NAV = {
  from: { opacity: 0, y: 10, filter: "blur(2px)" },
  to: { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, ease: EASE_SWIFT, stagger: 0.06 },
};

export const REVEAL_CARD = {
  from: { autoAlpha: 0, y: 40, scale: 0.97, filter: "blur(4px)" },
  to: { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.6, ease: EASE_SWIFT, stagger: 0.10 },
};

export const REVEAL_CONTENT = {
  from: { opacity: 0, y: 32, filter: "blur(3px)" },
  to: { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, ease: EASE_SWIFT, stagger: 0.06 },
};

export const REVEAL_META = {
  from: { opacity: 0, y: 8, filter: "blur(1px)" },
  to: { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, ease: EASE_SWIFT, stagger: 0.04 },
};

/* ── Mask reveals — text slides up from behind overflow:hidden parent ── */
/* Used for headlines. Parent needs: overflow:hidden, display:block/inline-block */
export const MASK_TEXT = {
  from: { yPercent: 100, opacity: 0 },
  to: { yPercent: 0, opacity: 1, duration: 0.75, ease: "expo.out", stagger: 0.075 },
};

export const MASK_TEXT_EXIT = {
  yPercent: -100,
  opacity: 0,
  duration: 0.5,
  ease: "power2.in",
  stagger: 0.04,
};

/* Exit presets — asymmetric (exit travels further, 66% of entrance duration) */
export const EXIT_CONTENT = {
  opacity: 0,
  y: -40,
  filter: "blur(4px)",
  duration: 0.4,
  ease: "power2.in",
};

/* ── Timing reference (from awwwards research) ── */
export const TIMING = {
  microInteraction: 0.15,  // 150ms — hovers, tooltips, buttons
  transition: 0.3,          // 300ms — page transitions, dropdowns
  reveal: 0.5,              // 500ms — scroll reveals, content entrance
  heroReveal: 0.75,         // 750ms — headline mask reveals
  dramatic: 1.0,            // 1000ms — hero text, FLIP transitions
  stagger: {
    characters: 0.015,      // 15ms per character
    words: 0.05,            // 50ms per word
    lines: 0.075,           // 75ms per line
    items: 0.04,            // 40ms per list item
    cards: 0.1,             // 100ms per card
  },
} as const;
