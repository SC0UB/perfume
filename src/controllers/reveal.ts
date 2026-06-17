/**
 * reveal — a 0..1 progress for the load -> gallery reveal (cans drop/fade in,
 * spotlight ramps up). Read per-frame by CanRing + Lighting; kicked once by the
 * Loader when loading completes.
 */

import gsap from 'gsap';
import { config } from '../config';

export const revealState = { progress: 0 };

export function startReveal() {
  gsap.to(revealState, {
    progress: 1,
    duration: config.reveal.durationMs / 1000,
    ease: config.ease.reveal,
  });
}
