/**
 * Theme colour driver — the "colour follows the bottle" plumbing.
 *
 * `useThemeLerp` eases store.themeColor toward the active flavour's colour over
 * config.theme.lerpMs whenever the active flavour changes. That single lerped
 * value feeds BOTH:
 *   - the DOM ambient bottom glow, via the --theme CSS var (<ThemeCssVar/>)
 *   - the in-scene themeColor point light (Lighting reads store.themeColor)
 *
 * The per-frame updates only touch components subscribed to `themeColor`
 * (ThemeCssVar + Lighting), so the rest of the scene never reconciles mid-lerp.
 */

import { useEffect } from 'react';
import { Color } from 'three';
import gsap from 'gsap';
import { useStore } from '../store';
import { config } from '../config';

export function useThemeLerp() {
  const activeIndex = useStore((s) => s.activeIndex);
  const flavors = useStore((s) => s.flavors);

  useEffect(() => {
    const from = new Color(useStore.getState().themeColor);
    const target = new Color(flavors[activeIndex].themeColor);
    const tmp = new Color();
    const proxy = { t: 0 };

    const tween = gsap.to(proxy, {
      t: 1,
      duration: config.theme.lerpMs / 1000,
      ease: config.ease.swap,
      onUpdate: () => {
        tmp.copy(from).lerp(target, proxy.t);
        useStore.getState().setThemeColor('#' + tmp.getHexString());
      },
    });
    return () => {
      tween.kill();
    };
  }, [activeIndex, flavors]);
}

/** Leaf component: mirrors the lerped themeColor into the --theme CSS var. */
export function ThemeCssVar() {
  const themeColor = useStore((s) => s.themeColor);
  useEffect(() => {
    document.documentElement.style.setProperty('--theme', themeColor);
  }, [themeColor]);
  return null;
}
