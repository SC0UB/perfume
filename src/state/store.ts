import { create } from 'zustand';
import { flavorCount } from '../data/flavors';

export type View = 'loader' | 'lineup' | 'detail';

type State = {
  view: View;
  /** Index into `flavors`; the active/centred flavour in lineup + detail. */
  activeIndex: number;
  /** Direction of the last flavour change (-1 prev, +1 next, 0 none) — drives transition direction. */
  navDir: number;
  menuOpen: boolean;
  ingredientsOpen: boolean;

  /** Loader finished + assets ready → reveal the lineup. */
  enterLineup: () => void;
  /** Open the detail view for a flavour (from the lineup). */
  openDetail: (index: number) => void;
  /** Reverse transition back to the lineup. */
  backToLineup: () => void;
  /** Move to the next/previous flavour (wraps). Works in detail view. */
  nextFlavor: () => void;
  prevFlavor: () => void;
  /** Jump straight to a flavour (carousel indicator). */
  goToFlavor: (index: number) => void;

  setMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;
  setIngredientsOpen: (open: boolean) => void;
};

const wrap = (i: number) => (i + flavorCount) % flavorCount;

export const useStore = create<State>((set) => ({
  view: 'loader',
  activeIndex: 0,
  navDir: 0,
  menuOpen: false,
  ingredientsOpen: false,

  enterLineup: () => set((s) => (s.view === 'loader' ? { view: 'lineup' } : {})),

  openDetail: (index) => set({ view: 'detail', activeIndex: wrap(index), navDir: 0 }),

  backToLineup: () => set({ view: 'lineup', ingredientsOpen: false }),

  nextFlavor: () =>
    set((s) => ({ activeIndex: wrap(s.activeIndex + 1), navDir: 1, ingredientsOpen: false })),

  prevFlavor: () =>
    set((s) => ({ activeIndex: wrap(s.activeIndex - 1), navDir: -1, ingredientsOpen: false })),

  goToFlavor: (index) =>
    set((s) => {
      const next = wrap(index);
      if (next === s.activeIndex) return {};
      return { activeIndex: next, navDir: next > s.activeIndex ? 1 : -1, ingredientsOpen: false };
    }),

  setMenuOpen: (open) => set({ menuOpen: open }),
  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),
  setIngredientsOpen: (open) => set({ ingredientsOpen: open }),
}));

// Dev affordance: drive state from the console / headless checks.
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as unknown as { __store: typeof useStore }).__store = useStore;
}
