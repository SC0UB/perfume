/**
 * virtualScroll — the continuous lateral controller for the infinite carousel.
 *
 * NOT a hook over DOM scroll. A plain singleton holding a continuous `lateral`
 * float and a `target`. Every input (wheel deltaX, drag, A/D + arrows,
 * side-arrow clicks, scrubber) writes to `target`; an rAF/useFrame loop (driven
 * by CanRing) eases `lateral` toward it and snaps to the nearest flavour. Both
 * values are unbounded — the ring wraps them with modulo, so motion is truly
 * infinite in both directions.
 *
 * Keeping this outside React means the per-frame position updates never trigger
 * re-renders; only the snapped activeIndex is mirrored into the store.
 */

import { config } from '../config';
import { flavors } from '../data/flavors';

const N = flavors.length;

/** Frame-rate-independent lerp factor for a given per-60fps-frame ease. */
function frac(ease: number, dt: number): number {
  return 1 - Math.pow(1 - ease, Math.min(dt, 0.1) * 60);
}

class VirtualScroll {
  lateral = 0; // continuous current position (flavour-index space)
  target = 0; // continuous target

  private dragging = false;
  private wheelActive = false;
  private lastInputAt = 0;

  get count() {
    return N;
  }

  // ── discrete inputs (keys / side arrows) ──
  step(dir: number) {
    this.target = Math.round(this.target) + dir;
    this.touch();
  }

  /** Jump to a flavour index, choosing its nearest wrapped equivalent. */
  goTo(index: number) {
    const base = Math.round(this.target);
    const baseMod = ((base % N) + N) % N;
    let diff = index - baseMod;
    if (diff > N / 2) diff -= N;
    if (diff < -N / 2) diff += N;
    this.target = base + diff;
    this.touch();
  }

  // ── continuous inputs (wheel) ──
  nudge(delta: number) {
    this.target += delta;
    this.wheelActive = true;
    this.touch();
  }

  // ── drag ──
  beginDrag() {
    this.dragging = true;
    this.touch();
  }
  dragBy(delta: number) {
    this.target += delta;
    this.touch();
  }
  endDrag() {
    this.dragging = false;
    this.touch();
  }

  private touch() {
    this.lastInputAt =
      typeof performance !== 'undefined' ? performance.now() : Date.now();
  }

  /** Advance one frame; returns the eased continuous lateral. */
  update(dt: number): number {
    const now =
      typeof performance !== 'undefined' ? performance.now() : Date.now();

    // Wheel "activity" expires shortly after the last tick so we re-snap.
    if (this.wheelActive && now - this.lastInputAt > 140) this.wheelActive = false;

    // Snap target toward the nearest integer when not actively interacting.
    if (!this.dragging && !this.wheelActive) {
      const k = frac(0.22, dt);
      const nearest = Math.round(this.target);
      this.target += (nearest - this.target) * k;
      if (Math.abs(nearest - this.target) < 1e-3) this.target = nearest;
    }

    // Ease lateral toward target.
    const k = frac(config.nav.lateralEase, dt);
    this.lateral += (this.target - this.lateral) * k;
    if (Math.abs(this.target - this.lateral) < 1e-4) this.lateral = this.target;

    return this.lateral;
  }

  /** Snapped, wrapped active flavour index. */
  activeIndex(): number {
    return ((Math.round(this.lateral) % N) + N) % N;
  }
}

export const virtualScroll = new VirtualScroll();
