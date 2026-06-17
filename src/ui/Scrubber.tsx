/**
 * Scrubber — a thin horizontal bar whose fill blends all six flavour colours in
 * order. A circular handle sits at the active flavour and is draggable: pointer
 * position maps to a flavour and jumps there via the controller.
 */

import { useRef, type PointerEvent as RPointerEvent } from 'react';
import { useStore } from '../store';

export function Scrubber() {
  const flavors = useStore((s) => s.flavors);
  const activeIndex = useStore((s) => s.activeIndex);
  const goTo = useStore((s) => s.goTo);
  const trackRef = useRef<HTMLDivElement>(null);
  const n = flavors.length;

  const gradient = `linear-gradient(90deg, ${flavors
    .map((f, i) => `${f.themeColor} ${(i / (n - 1)) * 100}%`)
    .join(', ')})`;

  const handlePct = (activeIndex / (n - 1)) * 100;

  const scrub = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    goTo(Math.round(frac * (n - 1)));
  };

  const onPointerDown = (e: RPointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    scrub(e.clientX);
  };
  const onPointerMove = (e: RPointerEvent) => {
    if (e.buttons === 1) scrub(e.clientX);
  };

  return (
    <div
      className="scrubber-track"
      ref={trackRef}
      style={{ background: gradient }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      role="slider"
      aria-label="Flavour"
      aria-valuemin={0}
      aria-valuemax={n - 1}
      aria-valuenow={activeIndex}
      aria-valuetext={flavors[activeIndex].name}
      tabIndex={0}
      data-interactive
    >
      <div className="scrubber-handle" style={{ left: `${handlePct}%` }} />
    </div>
  );
}
