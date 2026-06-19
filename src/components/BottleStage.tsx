import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { flavors, FEATURED_INDEX } from '../data/flavors';
import { useStore } from '../state/store';
import { useParallaxLayer } from '../motion/parallax';
import { useIsMobile } from '../hooks/useMediaQuery';
import { DUR, EASE, FLOAT } from '../motion/timing';
import { prefersReducedMotion } from '../motion/prefersReducedMotion';

const N = flavors.length;
const CENTER = (N - 1) / 2;

/** Tunables for the three layouts. */
const LINEUP = { spacingVw: 13.5, arcVh: 4.4, fanDeg: 1.1, featuredScale: 1.14, featuredRiseVh: 3 };
const MOBILE = { spacingVw: 56, peekScale: 0.8 };
const DETAIL = { scale: 2.0, riseVh: -2 };

type Pose = { x: number; y: number; scale: number; rot: number; alpha: number; z: number };

function pose(
  i: number,
  view: string,
  active: number,
  isMobile: boolean,
  vw: number,
  vh: number,
): Pose {
  if (view === 'detail') {
    if (i === active) {
      return { x: 0, y: (DETAIL.riseVh / 100) * vh, scale: DETAIL.scale, rot: 0, alpha: 1, z: 60 };
    }
    const side = i < active ? -1 : 1;
    const dist = Math.abs(i - active);
    return { x: side * (vw * 0.72 + dist * 40), y: 0, scale: 0.8, rot: side * 6, alpha: 0, z: 10 };
  }

  if (isMobile) {
    // Coverflow centred on the active flavour; neighbours peek, rest hidden.
    const rel = i - active;
    const off = Math.abs(rel);
    return {
      x: (rel * MOBILE.spacingVw * vw) / 100,
      y: off === 0 ? 0 : (2.5 / 100) * vh,
      scale: off === 0 ? 1 : MOBILE.peekScale,
      rot: 0,
      alpha: off > 1 ? 0 : off === 1 ? 0.85 : 1,
      z: 50 - off,
    };
  }

  // Desktop arc: bottles fan along a gentle curve, edges sink + tilt out.
  const d = i - CENTER;
  const dist = Math.abs(d) / CENTER;
  const featured = i === FEATURED_INDEX;
  return {
    x: (d * LINEUP.spacingVw * vw) / 100,
    y: (dist * dist * LINEUP.arcVh * vh) / 100 - (featured ? (LINEUP.featuredRiseVh * vh) / 100 : 0),
    scale: featured ? LINEUP.featuredScale : 1,
    rot: d * LINEUP.fanDeg,
    alpha: 1,
    z: featured ? 40 : Math.round(24 - dist * 6),
  };
}

export default function BottleStage() {
  const view = useStore((s) => s.view);
  const activeIndex = useStore((s) => s.activeIndex);
  const openDetail = useStore((s) => s.openDetail);
  const isMobile = useIsMobile();

  const layerRef = useRef<HTMLDivElement>(null);
  const slots = useRef<(HTMLDivElement | null)[]>([]);
  const inners = useRef<(HTMLButtonElement | null)[]>([]);
  const tilters = useRef<((v: number) => void)[]>([]);
  const first = useRef(true);
  const [hovered, setHovered] = useState<number | null>(null);
  const [tick, forceTick] = useState(0);

  useParallaxLayer(layerRef, 22, 11);

  // Hover state never carries out of the lineup.
  useEffect(() => {
    if (view !== 'lineup') setHovered(null);
  }, [view]);

  // Re-place on resize (poses are computed in px from vw/vh).
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => forceTick((t) => t + 1));
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Director: tween every slot toward its pose for the current view/active.
  useLayoutEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const reduce = prefersReducedMotion();
    const snap = first.current;
    first.current = false;
    slots.current.forEach((el, i) => {
      if (!el) return;
      if (snap) gsap.set(el, { xPercent: -50, yPercent: -50 }); // centre anchor (composes with x/y)
      const p = pose(i, view, activeIndex, isMobile, vw, vh);
      const dur =
        view === 'detail' ? (i === activeIndex ? DUR.toDetail : DUR.toDetail * 0.85) : DUR.toLineup;
      gsap.to(el, {
        x: p.x,
        y: p.y,
        scale: p.scale,
        rotation: p.rot,
        autoAlpha: p.alpha,
        zIndex: p.z,
        duration: reduce || snap ? 0 : dur,
        ease: view === 'detail' ? EASE.expoOut : EASE.ui,
        overwrite: 'auto',
        delay: reduce || snap ? 0 : view === 'detail' && i !== activeIndex ? Math.abs(i - activeIndex) * 0.03 : 0,
      });
    });
  }, [view, activeIndex, isMobile, tick]);

  // Gentle bob on the focused bottle while in detail.
  useEffect(() => {
    if (view !== 'detail' || prefersReducedMotion()) return;
    const el = inners.current[activeIndex];
    if (!el) return;
    gsap.set(el, { y: 0, rotation: 0, scale: 1 });
    const bob = gsap.to(el, {
      y: -FLOAT.bobY,
      rotation: FLOAT.bobRot,
      duration: FLOAT.bobPeriod,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    return () => {
      bob.kill();
      gsap.to(el, { y: 0, rotation: 0, duration: 0.4 });
    };
  }, [view, activeIndex]);

  // ── Hover (desktop lineup only) ──────────────────────────────────────────
  const canHover = view === 'lineup' && !isMobile;

  const onEnter = useCallback(
    (i: number) => {
      if (!canHover) return;
      setHovered(i);
      if (prefersReducedMotion()) return;
      gsap.to(inners.current[i], { y: -26, scale: 1.06, duration: DUR.hover, ease: EASE.hover });
    },
    [canHover],
  );

  const onLeave = useCallback(
    (i: number) => {
      setHovered((h) => (h === i ? null : h));
      if (prefersReducedMotion()) return;
      tilters.current[i]?.(0);
      gsap.to(inners.current[i], { y: 0, scale: 1, rotation: 0, duration: DUR.hover, ease: EASE.hover });
    },
    [],
  );

  const onMove = useCallback(
    (i: number, e: React.PointerEvent) => {
      if (!canHover || prefersReducedMotion()) return;
      const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2); // -1..1
      if (!tilters.current[i]) {
        tilters.current[i] = gsap.quickTo(inners.current[i], 'rotation', {
          duration: 0.5,
          ease: 'power2',
        });
      }
      tilters.current[i](gsap.utils.clamp(-9, 9, dx * 9));
    },
    [canHover],
  );

  return (
    <div ref={layerRef} className={`bottle-stage ${view === 'detail' ? 'is-detail' : ''}`}>
      {flavors.map((f, i) => (
        <div
          key={f.id}
          ref={(el) => {
            slots.current[i] = el;
          }}
          className="bottle-slot"
        >
          <button
            type="button"
            ref={(el) => {
              inners.current[i] = el;
            }}
            className={`bottle ${hovered != null && hovered !== i ? 'is-dim' : ''} ${
              hovered === i ? 'is-hover' : ''
            }`}
            aria-label={`${f.name} — voir la saveur`}
            onPointerEnter={() => onEnter(i)}
            onPointerLeave={() => onLeave(i)}
            onPointerMove={(e) => onMove(i, e)}
            onClick={() => openDetail(i)}
          >
            <span className="bottle-label" style={{ color: 'var(--chrome-fg)' }}>
              {f.label}
            </span>
            <img className="bottle-img" src={f.bottleSrc} alt={`Ciao Kombucha — ${f.name}`} draggable={false} />
          </button>
        </div>
      ))}
    </div>
  );
}
