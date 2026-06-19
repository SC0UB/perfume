/**
 * Shared motion timing. Every layer animates itself toward the current store
 * state with these matched durations/eases, so the separate tweens read as one
 * coordinated, interruptible transition (GSAP overwrite handles interruption;
 * reversing the store state reverses the motion). Tune the feel here.
 */
export const DUR = {
  loaderReveal: 1.15,
  toDetail: 0.95,
  toLineup: 0.85,
  flavorChange: 0.7,
  hover: 0.42,
  fade: 0.5,
} as const;

export const EASE = {
  expo: 'expo.inOut',
  expoOut: 'expo.out',
  ui: 'power3.out',
  hover: 'power2.out',
  soft: 'power1.inOut',
} as const;

/** Idle float (whole scene breathes) + bottle bob in detail. */
export const FLOAT = {
  sceneY: 10, // px
  scenePeriod: 7, // s
  bobY: 14,
  bobPeriod: 4,
  bobRot: 2.5, // deg
} as const;
