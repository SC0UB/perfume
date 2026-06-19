import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Wordmark from './Wordmark';
import { useStore } from '../state/store';
import { usePreloadBottles } from '../hooks/usePreloadBottles';
import { DUR, EASE } from '../motion/timing';
import { prefersReducedMotion } from '../motion/prefersReducedMotion';

const MIN_DISPLAY_MS = 2000;

export default function Loader() {
  const enterLineup = useStore((s) => s.enterLineup);
  const { progress, ready } = usePreloadBottles();

  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const revealing = useRef(false);

  const [minElapsed, setMinElapsed] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setMinElapsed(true), MIN_DISPLAY_MS);
    return () => window.clearTimeout(id);
  }, []);

  // Drifting aurora (skipped under reduced motion).
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.aurora-blob').forEach((blob, i) => {
        gsap.to(blob, {
          xPercent: gsap.utils.random(-22, 22),
          yPercent: gsap.utils.random(-22, 22),
          scale: gsap.utils.random(1.05, 1.45),
          duration: gsap.utils.random(6, 9),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.3,
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // Gate: reveal once assets are decoded AND the minimum display has elapsed.
  useEffect(() => {
    if (revealing.current || !ready || !minElapsed) return;
    revealing.current = true;

    if (prefersReducedMotion()) {
      gsap.to(rootRef.current, {
        autoAlpha: 0,
        duration: 0.4,
        onComplete: enterLineup,
      });
      return;
    }

    const card = cardRef.current!;
    const rect = card.getBoundingClientRect();
    const scale =
      Math.max(window.innerWidth / rect.width, window.innerHeight / rect.height) * 1.08;

    gsap
      .timeline({ onComplete: enterLineup })
      .to(contentRef.current, { autoAlpha: 0, y: -12, duration: 0.35, ease: 'power2.in' })
      .to(card, { scale, borderRadius: 0, duration: DUR.loaderReveal, ease: EASE.expo }, 0.1)
      .to(rootRef.current, { autoAlpha: 0, duration: 0.55, ease: 'power2.inOut' }, '>-0.45');
  }, [ready, minElapsed, enterLineup]);

  const pct = Math.round(progress * 100);

  return (
    <div className="loader" ref={rootRef}>
      <div className="loader-card" ref={cardRef}>
        <div className="loader-aurora" aria-hidden="true">
          <span className="aurora-blob b1" />
          <span className="aurora-blob b2" />
          <span className="aurora-blob b3" />
          <span className="aurora-blob b4" />
        </div>
        <div className="loader-content" ref={contentRef}>
          <Wordmark className="loader-logo" />
          <div className="loader-progress" role="progressbar" aria-label="Chargement" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="loader-bar">
              <i style={{ transform: `scaleX(${progress})` }} />
            </div>
            <span className="loader-pct">{pct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
