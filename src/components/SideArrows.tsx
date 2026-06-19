import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../state/store';

/** Previous / next flavour, far-left & far-right at mid-height (detail view). */
export default function SideArrows() {
  const view = useStore((s) => s.view);
  const prevFlavor = useStore((s) => s.prevFlavor);
  const nextFlavor = useStore((s) => s.nextFlavor);
  if (view !== 'detail') return null;
  return (
    <>
      <button type="button" className="side-arrow left" aria-label="Saveur précédente" onClick={prevFlavor}>
        <ChevronLeft size={30} strokeWidth={1.5} />
      </button>
      <button type="button" className="side-arrow right" aria-label="Saveur suivante" onClick={nextFlavor}>
        <ChevronRight size={30} strokeWidth={1.5} />
      </button>
    </>
  );
}
