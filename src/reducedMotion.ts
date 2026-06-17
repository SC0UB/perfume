/**
 * REDUCED_MOTION — evaluated once at load. When true we cut the idle float/spin,
 * the reveal drop and other large motion (the experience stays navigable).
 */
export const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  !!window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
