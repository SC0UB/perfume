import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { flavors } from '../data/flavors';
import { useStore } from '../state/store';
import { DUR, EASE } from '../motion/timing';
import { prefersReducedMotion } from '../motion/prefersReducedMotion';

/**
 * Eases the --flavor-bg / --flavor-accent / --flavor-text custom properties on
 * <html> toward the active flavour's colours, so the whole detail world morphs
 * in one move. Per-flavour colours come from flavors.ts (single source).
 */
export function useFlavorTheme() {
  const activeIndex = useStore((s) => s.activeIndex);
  const prev = useRef<number | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const to = flavors[activeIndex].color;
    const setVars = (c: { bg: string; accent: string; text: string }) => {
      root.style.setProperty('--flavor-bg', c.bg);
      root.style.setProperty('--flavor-accent', c.accent);
      root.style.setProperty('--flavor-text', c.text);
    };

    if (prev.current === null || prefersReducedMotion()) {
      setVars(to);
      prev.current = activeIndex;
      return;
    }

    const from = flavors[prev.current].color;
    prev.current = activeIndex;
    const proxy = { t: 0 };
    const tween = gsap.to(proxy, {
      t: 1,
      duration: DUR.flavorChange,
      ease: EASE.soft,
      onUpdate: () =>
        setVars({
          bg: gsap.utils.interpolate(from.bg, to.bg, proxy.t),
          accent: gsap.utils.interpolate(from.accent, to.accent, proxy.t),
          text: gsap.utils.interpolate(from.text, to.text, proxy.t),
        }),
    });
    return () => {
      tween.kill();
    };
  }, [activeIndex]);
}
