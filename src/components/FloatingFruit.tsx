import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { flavors } from '../data/flavors';
import { useStore } from '../state/store';
import { useParallaxLayer } from '../motion/parallax';
import { prefersReducedMotion } from '../motion/prefersReducedMotion';

/** Scatter positions around the centred bottle (offset from centre). */
const SLOTS = [
  { x: -27, y: -6, size: 17, blur: 1.5, depth: 34, dur: 6.5 },
  { x: 25, y: 9, size: 13, blur: 0, depth: 46, dur: 7.5 },
  { x: -19, y: 20, size: 10, blur: 3, depth: 22, dur: 5.5 },
  { x: 31, y: -15, size: 9, blur: 4.5, depth: 18, dur: 8 },
  { x: -34, y: 14, size: 12, blur: 0.5, depth: 30, dur: 7 },
] as const;

type Slot = (typeof SLOTS)[number];

function Fruit({ src, slot, idx }: { src: string; slot: Slot; idx: number }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLImageElement>(null);
  useParallaxLayer(outer, slot.depth, slot.depth * 0.6);

  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, scale: 0.7 },
        { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'back.out(1.6)', delay: idx * 0.05 },
      );
      if (!prefersReducedMotion()) {
        gsap.to(el, {
          y: '+=14',
          rotation: gsap.utils.random(-12, 12),
          duration: slot.dur,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: idx * 0.2,
        });
      }
    });
    return () => ctx.revert();
  }, [idx, slot.dur]);

  return (
    <div
      ref={outer}
      className="fruit"
      style={{
        left: `calc(50% + ${slot.x}vw)`,
        top: `calc(50% + ${slot.y}vh)`,
        width: `${slot.size}vh`,
        height: `${slot.size}vh`,
        marginLeft: `${-slot.size / 2}vh`,
        marginTop: `${-slot.size / 2}vh`,
      }}
    >
      <img
        ref={inner}
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        style={{ filter: slot.blur ? `blur(${slot.blur}px)` : undefined }}
        onError={(e) => {
          (e.currentTarget.style.display = 'none'); // degrade gracefully
        }}
      />
    </div>
  );
}

export default function FloatingFruit() {
  const view = useStore((s) => s.view);
  const activeIndex = useStore((s) => s.activeIndex);
  const flavor = flavors[activeIndex];
  const layerRef = useRef<HTMLDivElement>(null);

  // How many to show, scaled to how many distinct cutouts the flavour has.
  const count = flavor.fruitSrc.length >= 3 ? 5 : flavor.fruitSrc.length === 2 ? 4 : 3;

  useEffect(() => {
    gsap.to(layerRef.current, {
      autoAlpha: view === 'detail' ? 1 : 0,
      duration: view === 'detail' ? 0.8 : 0.4,
      ease: 'power2.out',
    });
  }, [view]);

  return (
    <div ref={layerRef} className="fruit-layer" aria-hidden="true">
      {SLOTS.slice(0, count).map((slot, i) => (
        <Fruit
          key={`${activeIndex}-${i}`}
          idx={i}
          slot={slot}
          src={flavor.fruitSrc[i % flavor.fruitSrc.length]}
        />
      ))}
    </div>
  );
}
