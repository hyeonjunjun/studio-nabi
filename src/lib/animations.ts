/**
 * Shared animation presets for the reveal system.
 * Used with GSAP: gsap.fromTo(elements, preset.from, { ...preset.to, ...overrides })
 */

export const REVEAL_HERO = {
  from: { opacity: 0, y: 24, filter: "blur(4px)" },
  to: { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.0, ease: "power3.out", stagger: 0.10 },
};

export const REVEAL_NAV = {
  from: { opacity: 0, y: 10, filter: "blur(2px)" },
  to: { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power3.out", stagger: 0.06 },
};

export const REVEAL_CARD = {
  from: { autoAlpha: 0, y: 20, scale: 0.98, filter: "blur(3px)" },
  to: { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out", stagger: 0.12 },
};

export const REVEAL_CONTENT = {
  from: { opacity: 0, y: 16, filter: "blur(3px)" },
  to: { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out", stagger: 0.08 },
};

export const REVEAL_META = {
  from: { opacity: 0, y: 8, filter: "blur(2px)" },
  to: { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power3.out", stagger: 0.05 },
};
