import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useStore } from '../state/store';
import { DUR, EASE } from '../motion/timing';

/**
 * Full-bleed flavour-colour wash that covers the sky in the detail view (and
 * fades back out on return to the lineup). Its colour is --flavor-bg, which the
 * theming layer morphs as the flavour changes.
 */
export default function FlavorWash() {
  const view = useStore((s) => s.view);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.to(ref.current, {
      autoAlpha: view === 'detail' ? 1 : 0,
      duration: view === 'detail' ? DUR.toDetail : DUR.toLineup,
      ease: EASE.ui,
    });
  }, [view]);

  return <div ref={ref} className="flavor-wash" aria-hidden="true" />;
}
