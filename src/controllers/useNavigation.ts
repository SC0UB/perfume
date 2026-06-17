/**
 * useNavigation — wires DOM inputs to the virtualScroll controller.
 *
 * Lateral: wheel deltaX, horizontal drag, A/D and Left/Right arrows.
 * (Side-arrow clicks and the scrubber call the controller directly.)
 *
 * Depth (wheel deltaY / vertical swipe -> focus, Escape -> exit) is stubbed here
 * and filled in Phase 5; the axis detection that routes it already lives below.
 */

import { useEffect } from 'react';
import { useStore } from '../store';
import { virtualScroll } from './virtualScroll';
import { config } from '../config';

function isInteractive(el: EventTarget | null): boolean {
  return !!(el as HTMLElement)?.closest?.('button, a, input, [data-interactive]');
}

export function useNavigation() {
  useEffect(() => {
    const nav = config.nav;
    const active = () => useStore.getState().mode !== 'loading';

    // Depth intent accumulator (gallery <-> focus).
    let depthAccum = 0;
    const enterDepth = (dir: number) => {
      const st = useStore.getState();
      if (st.mode === 'gallery' && dir > 0) {
        st.setMode('focus');
        depthAccum = 0;
      } else if (st.mode === 'focus' && dir < 0) {
        st.setMode('gallery');
        depthAccum = 0;
      }
    };

    // ── keyboard ──
    const onKey = (e: KeyboardEvent) => {
      if (!active()) return;
      switch (e.key) {
        case 'ArrowRight':
        case 'd':
        case 'D':
          virtualScroll.step(nav.keyStep);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          virtualScroll.step(-nav.keyStep);
          break;
        case 'Escape': {
          const st = useStore.getState();
          if (st.menuOpen) st.setMenuOpen(false);
          else if (st.mode === 'focus') st.setMode('gallery');
          break;
        }
        default:
          return;
      }
      e.preventDefault();
    };

    // ── wheel ──
    const onWheel = (e: WheelEvent) => {
      if (!active()) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        virtualScroll.nudge(e.deltaX * nav.wheelLateralScale);
        e.preventDefault();
      } else {
        // deltaY -> depth. Accumulate in the meaningful direction only.
        const dir = Math.sign(e.deltaY);
        if (Math.sign(depthAccum) !== dir) depthAccum = 0;
        depthAccum += e.deltaY;
        if (Math.abs(depthAccum) > nav.wheelDepthThreshold) enterDepth(dir);
        e.preventDefault();
      }
    };

    // ── pointer drag ──
    let dragging = false;
    let axis: 'none' | 'x' | 'y' = 'none';
    let startX = 0;
    let startY = 0;
    let lastX = 0;

    const onDown = (e: PointerEvent) => {
      if (!active() || isInteractive(e.target)) return;
      dragging = true;
      axis = 'none';
      startX = lastX = e.clientX;
      startY = e.clientY;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (axis === 'none' && Math.hypot(dx, dy) > 6) {
        axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        if (axis === 'x') virtualScroll.beginDrag();
      }
      if (axis === 'x') {
        const stepX = e.clientX - lastX;
        virtualScroll.dragBy(-stepX * nav.dragLateralScale);
        lastX = e.clientX;
      }
      // TODO(Phase 5): axis === 'y' -> depth intent.
    };
    const onUp = (e: PointerEvent) => {
      if (axis === 'x') {
        virtualScroll.endDrag();
      } else if (axis === 'y') {
        const dy = e.clientY - startY;
        // swipe up -> deeper (focus); swipe down -> exit focus
        if (Math.abs(dy) > nav.touchDepthThreshold) enterDepth(dy < 0 ? 1 : -1);
      }
      dragging = false;
      axis = 'none';
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, []);
}
