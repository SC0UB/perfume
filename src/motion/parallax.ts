import { useEffect } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from './prefersReducedMotion';

/**
 * Damped pointer parallax. Layers register with depth factors (px of travel at
 * full pointer deflection); a single window pointer listener writes normalised
 * targets and GSAP `quickTo` trails the cursor smoothly (no per-frame React).
 *
 * Background gets the least travel, foreground (grass) the most, bottles in
 * between — pass depth accordingly.
 */
type Layer = {
  setX: (v: number) => void;
  setY: (v: number) => void;
  depthX: number;
  depthY: number;
};

class ParallaxController {
  private layers = new Set<Layer>();
  private nx = 0;
  private ny = 0;
  private enabled = true;
  private bound = false;

  private onMove = (e: PointerEvent) => {
    if (!this.enabled) return;
    this.nx = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
    this.ny = (e.clientY / window.innerHeight) * 2 - 1;
    this.apply();
  };

  private apply() {
    for (const l of this.layers) {
      l.setX(this.nx * l.depthX);
      l.setY(this.ny * l.depthY);
    }
  }

  private ensureBound() {
    if (this.bound || typeof window === 'undefined') return;
    window.addEventListener('pointermove', this.onMove, { passive: true });
    this.bound = true;
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    if (!on) {
      this.nx = 0;
      this.ny = 0;
      this.apply();
    }
  }

  register(el: HTMLElement, depthX: number, depthY: number): () => void {
    this.ensureBound();
    const setX = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3' });
    const setY = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3' });
    const layer: Layer = { setX, setY, depthX, depthY };
    this.layers.add(layer);
    return () => {
      this.layers.delete(layer);
      gsap.set(el, { x: 0, y: 0 });
    };
  }
}

export const parallax = new ParallaxController();

if (prefersReducedMotion()) parallax.setEnabled(false);

/** Register a ref'd element as a parallax depth layer for its lifetime. */
export function useParallaxLayer(
  ref: React.RefObject<HTMLElement | null>,
  depthX: number,
  depthY: number = depthX,
) {
  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    return parallax.register(ref.current, depthX, depthY);
  }, [ref, depthX, depthY]);
}
