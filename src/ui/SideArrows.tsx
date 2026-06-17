/**
 * SideArrows — interactive left/right chevrons at the mid-edges. Active in both
 * gallery and (Phase 5) focus mode. They drive the controller directly.
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../store';

export function SideArrows() {
  const prev = useStore((s) => s.prev);
  const next = useStore((s) => s.next);

  return (
    <>
      <button
        className="side-arrow left"
        onClick={prev}
        aria-label="Previous flavour"
        data-interactive
      >
        <ChevronLeft size={28} strokeWidth={1.25} />
      </button>
      <button
        className="side-arrow right"
        onClick={next}
        aria-label="Next flavour"
        data-interactive
      >
        <ChevronRight size={28} strokeWidth={1.25} />
      </button>
    </>
  );
}
