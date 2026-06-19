import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { flavors } from '../data/flavors';
import { useStore } from '../state/store';
import { prefersReducedMotion } from '../motion/prefersReducedMotion';

/**
 * Kinetic typography behind the bottle: the flavour name set huge and looping
 * across mid-height (two rows scrolling opposite ways), tinted with the accent
 * colour. The centred bottle masks the middle. Static under reduced motion.
 */
const REPEAT = 6;

export default function KineticText() {
  const view = useStore((s) => s.view);
  const activeIndex = useStore((s) => s.activeIndex);
  const label = flavors[activeIndex].label;

  const layerRef = useRef<HTMLDivElement>(null);
  const rowARef = useRef<HTMLDivElement>(null);
  const rowBRef = useRef<HTMLDivElement>(null);

  // Continuous marquee (seamless: content is duplicated, travel one half).
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.to(rowARef.current, { xPercent: -50, duration: 26, ease: 'none', repeat: -1 });
      gsap.fromTo(
        rowBRef.current,
        { xPercent: -50 },
        { xPercent: 0, duration: 32, ease: 'none', repeat: -1 },
      );
    });
    return () => ctx.revert();
  }, []);

  // Build in / out with the detail transition.
  useEffect(() => {
    gsap.to(layerRef.current, {
      autoAlpha: view === 'detail' ? 1 : 0,
      duration: view === 'detail' ? 0.9 : 0.5,
      ease: 'power2.out',
    });
  }, [view]);

  const word = (
    <>
      {Array.from({ length: REPEAT * 2 }).map((_, i) => (
        <span key={i} className="kinetic-word">
          {label}
          <em className="kinetic-dot" aria-hidden="true">
            ●
          </em>
        </span>
      ))}
    </>
  );

  return (
    <div ref={layerRef} className="kinetic" aria-hidden="true">
      <div className="kinetic-row kinetic-row-a">
        <div className="kinetic-track" ref={rowARef}>
          {word}
        </div>
      </div>
      <div className="kinetic-row kinetic-row-b">
        <div className="kinetic-track" ref={rowBRef}>
          {word}
        </div>
      </div>
    </div>
  );
}
