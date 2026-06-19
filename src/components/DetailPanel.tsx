import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { flavors } from '../data/flavors';
import { useStore } from '../state/store';
import { DUR, EASE } from '../motion/timing';

/**
 * Left-column copy on the detail view: an eyebrow, the flavour name, and the
 * French placeholder description. Fades/clips in with the transition and
 * re-animates on each flavour change.
 */
export default function DetailPanel() {
  const view = useStore((s) => s.view);
  const activeIndex = useStore((s) => s.activeIndex);
  const flavor = flavors[activeIndex];
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.to(ref.current, {
      autoAlpha: view === 'detail' ? 1 : 0,
      duration: view === 'detail' ? DUR.toDetail : DUR.fade,
      ease: EASE.ui,
    });
  }, [view]);

  return (
    <div ref={ref} className="detail-panel">
      <div className="detail-panel-inner" key={activeIndex}>
        <p className="detail-eyebrow">Ciao Kombucha</p>
        <h2 className="detail-name">{flavor.name}</h2>
        <p className="detail-desc">{flavor.description}</p>
      </div>
    </div>
  );
}
