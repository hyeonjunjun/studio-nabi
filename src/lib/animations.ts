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

/* Exit presets — asymmetric (exit travels further) */
export const EXIT_CONTENT = {
  opacity: 0,
  y: -40,
  filter: "blur(4px)",
  duration: 0.4,
  ease: "power2.in",
};
