# Ciao Kombucha — interactive home recreation

A high-fidelity recreation of the **home experience** of
[ciaokombucha.com](https://www.ciaokombucha.com/): the loader, the lineup of
flavours on a grassy arc under a drifting sky, cursor parallax, hover-to-lift,
click-to-detail with a colour morph, kinetic typography, floating fruit, and
left/right flavour navigation.

It matches the *interaction model*, not a pixel clone. Built with **React + Vite
+ GSAP** as a 2-D layered stage (no Three.js / WebGL — the original uses
pre-rendered 2-D art, and so does this).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static export → dist/
npm run preview  # serve the build
```

Node 18+ (developed on Node 22). `lang="fr"`.

---

## The one thing to know first: "bottles" are fruit

The build spec calls the lineup items **bottles**. The live site's home does
**not** ship any bottle renders — the eight flavour images it lines up in the
grass are **fruit** cut-outs (`ciao_citron.avif` … = lemon, peach, dragon
fruit, watermelon, mango, raspberry cluster, ginger, mint). There are no bottle
product images anywhere in the home markup or CSS.

So a faithful recreation of the **home** is a **fruit lineup**, and that's what
this is. The code keeps the spec's `bottle*` vocabulary (so it cross-references
the spec cleanly), but the rendered hero items are the real fruit art. At the
rebrand, dropping actual bottle renders into `public/assets/bottles/` with the
same slugs is a zero-code swap.

---

## Swapping the environment art (the planned divergence)

The sky and the grass are the only pieces meant to be replaced (with your
Tunisian "Sidi Bou Said" cobalt-and-white art). They are driven entirely by two
CSS variables in **`src/styles/tokens.css`**:

```css
--env-bg:    url('/assets/env/bg.svg');     /* sky / background  */
--env-grass: url('/assets/env/grass.svg');  /* grass foreground  */
```

To reskin the world, either:

1. **Overwrite the two placeholder files** `public/assets/env/bg.svg` and
   `public/assets/env/grass.svg` with your own (keep the names), **or**
2. Drop `bg.jpg` / `grass.png` (any format) into `public/assets/env/` and point
   the two vars above at them.

Nothing else changes. The grass is a transparent band along the bottom that the
fruit bases sink into; `--env-grass-height` and `--env-bottle-sink` tune the
planting.

---

## Theming / reskin hooks

All themeable values live in **`src/styles/tokens.css`**: the env images, the
loader aurora gradient stops, the chrome colours, and the type stacks. The
**per-flavour** colours (`bg` / `accent` / `text`) live with each flavour in
**`src/data/flavors.ts`** (single source of truth); the theming layer eases them
into the `--flavor-*` CSS variables as the active flavour changes.

Reskinning to the cobalt/white world = edit `tokens.css` + `flavors.ts` colours
+ drop in the two env images. No component edits.

---

## Asset provenance (everything here is a temporary placeholder)

`npm run fetch-assets` (re-)downloads the brand assets used to calibrate against
the real site. They are **placeholders, slated for replacement at the rebrand** —
the script and this note are the record of that.

| Asset | Location | Source | Notes |
|---|---|---|---|
| 8 fruit renders | `public/assets/bottles/*.avif` | brand CDN | the real hero items (see above) |
| Gobo light video | `public/assets/video/gobo.mp4` | brand S3 | subtle screen-blend overlay; degrades gracefully if absent |
| Wordmark logos | `public/assets/logo/*.svg` | inlined from the live page | drawn with `currentColor`; used in loader + header |
| Fruit cut-outs | `public/assets/fruit/*.svg` | **generated** by `scripts/generate-fruit.mjs` | decorative floating fruit on the detail view |
| Sky + grass | `public/assets/env/*.svg` | **generated placeholders** | yours to replace |

French flavour copy in `flavors.ts` is the live site's body copy, stored as
placeholder text per the spec (single source of truth, replaced at rebrand).

The real site's type is Blauer Nue / Salmond / Elgraine (commercial). To avoid
bundling commercial fonts this build uses free near-matches loaded via
`@fontsource`: **Space Grotesk** (display / kinetic / labels) and **Hanken
Grotesk** (body). Swap at the rebrand.

> Re-fetch anytime: `npm run fetch-assets` (add `--force` to overwrite).
> Regenerate fruit: `node scripts/generate-fruit.mjs`.

---

## How it works (architecture)

Fixed, full-viewport, **no-scroll** stage. Motion is GSAP; state is Zustand.

- **`src/state/store.ts`** — `view` (`loader | lineup | detail`),
  `activeIndex`, `menuOpen`, `ingredientsOpen`, and the navigation actions
  (with wrap-around). `window.__store` is exposed in dev.
- **Layered stage** (`src/components/Stage.tsx`), back → front: sky → flavour
  colour wash → kinetic text → floating fruit → fruit lineup → grass → gobo
  light → chrome. Z-order and the whole layout live in `src/styles/global.css`.
- **`BottleStage.tsx`** keeps all 8 items mounted and tweens each toward a
  computed pose for the current view (desktop arc / mobile coverflow / detail
  fly-to-centre). Because every transition is "tween toward the new state," they
  are inherently reversible and interruptible (GSAP overwrite). Shared timings
  live in `src/motion/timing.ts` so the separate per-layer tweens read as one
  coordinated move.
- **Parallax** (`src/motion/parallax.ts`) — one pointer listener, damped via
  GSAP `quickTo`; layers register depth factors (sky least, grass most).
- **Theming** (`src/hooks/useFlavorTheme.ts`) eases the `--flavor-*` vars on
  flavour change. **Loader** (`src/components/Loader.tsx`) gates the reveal on
  the 8 images decoding **and** a ~2 s minimum, then scales the card to full
  bleed.
- **`prefers-reduced-motion`** is honoured throughout (no parallax, marquee,
  float, or fly-ins; quick fades instead).

### Interaction map

- **Lineup:** hover a fruit → it lifts, scales, tilts toward the cursor, gains a
  shadow; siblings dim. Click / Enter / Space → detail. Desktop = full arc;
  mobile = swipeable coverflow.
- **Detail:** colour morph + kinetic name marquee + floating fruit + left copy.
  ← / → or the side arrows change flavour (wraps); the segmented indicator jumps;
  swipe on touch. Home button or **Esc** returns to the lineup. Leaf button
  opens the ingredients panel.

---

## What's stubbed (out of scope for now)

Wired up so nothing is broken, but intentionally not built out:

- **Fabrication**, **Distributeurs**, **FAQ** routes (menu + the "Voir la
  fabrication" pill) — no-op / hash anchors.
- **Favourite / star** button — no-op.
- **Ingredients panel** — a minimal generic list, not real per-flavour data.
- **External-link arrow** (lineup, bottom-left) — no-op.
- Contact links use `mailto:contact@ciaokombucha.com`; Instagram / TikTok point
  at the real brand profiles.

---

## Accessibility

Alt text on imagery, `aria-label`s on every icon button, visible focus rings,
full keyboard path (Tab to a fruit → Enter to open → ← / → between flavours →
Esc to return), reduced-motion honoured, contrast scrims behind the chrome.
