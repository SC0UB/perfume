/** Single source of truth for the reduced-motion preference. */
const mq =
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

export const prefersReducedMotion = (): boolean => !!mq?.matches;

/** Subscribe to changes; returns an unsubscribe. */
export const onReducedMotionChange = (cb: (reduce: boolean) => void): (() => void) => {
  if (!mq) return () => {};
  const handler = () => cb(mq.matches);
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
};
