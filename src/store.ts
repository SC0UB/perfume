/**
 * Global state (zustand).
 *
 * Holds the high-level experience state: which mode we're in, which flavour is
 * active, and the current (lerped) theme colour. The *continuous* lateral float
 * used by the carousel lives in the separate virtual controller
 * (controllers/virtualScroll.ts) — this store only tracks the snapped index and
 * discrete mode, so re-renders stay cheap.
 *
 * Navigation flows ONE way: inputs -> virtualScroll -> (CanRing eases it) ->
 * syncActiveIndex mirrors the snapped index back here for the DOM/HUD. The
 * next/prev/goTo actions therefore delegate to the controller rather than
 * setting activeIndex directly.
 */

import { create } from 'zustand';
import { flavors as flavorData, type Flavor } from './data/flavors';
import { virtualScroll } from './controllers/virtualScroll';

export type Mode = 'loading' | 'gallery' | 'focus';

interface Store {
  mode: Mode;
  activeIndex: number; // 0..n-1, wraps
  flavors: Flavor[];
  themeColor: string; // current, lerped toward flavors[activeIndex].themeColor
  audioOn: boolean;
  isTransitioning: boolean;
  menuOpen: boolean;

  // ── actions ──
  setMode: (mode: Mode) => void;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  setLoaded: () => void;
  toggleAudio: () => void;
  setThemeColor: (hex: string) => void;
  setTransitioning: (v: boolean) => void;
  setMenuOpen: (v: boolean) => void;
  /** Mirror the controller's snapped index into the store (CanRing only). */
  syncActiveIndex: (index: number) => void;
}

export const useStore = create<Store>((set, get) => ({
  mode: 'loading', // Loader flips to 'gallery' when progress completes.
  activeIndex: 0,
  flavors: flavorData,
  themeColor: flavorData[0].themeColor,
  audioOn: false,
  isTransitioning: false,
  menuOpen: false,

  setMode: (mode) => set({ mode }),

  next: () => virtualScroll.step(1),
  prev: () => virtualScroll.step(-1),
  goTo: (index) => virtualScroll.goTo(index),

  setLoaded: () => {
    if (get().mode === 'loading') set({ mode: 'gallery' });
  },

  toggleAudio: () => set((s) => ({ audioOn: !s.audioOn })),

  setThemeColor: (hex) => set({ themeColor: hex }),

  setTransitioning: (v) => set({ isTransitioning: v }),

  setMenuOpen: (v) => set({ menuOpen: v }),

  syncActiveIndex: (index) => {
    if (index !== get().activeIndex) set({ activeIndex: index });
  },
}));

/** Convenience selector for the active flavour. */
export const useActiveFlavor = () => useStore((s) => s.flavors[s.activeIndex]);

// Dev convenience: poke state from the console (e.g. __store.getState().next()).
if (import.meta.env.DEV) {
  (window as unknown as { __store: typeof useStore }).__store = useStore;
}
