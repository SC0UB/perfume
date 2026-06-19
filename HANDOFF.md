# HANDOFF — Ciao Kombucha home recreation

Context doc for continuing in a fresh session. Read this + `README.md`, then
`npm install && npm run dev`.

## What this is

An interactive recreation of the **home** experience of ciaokombucha.com — React
+ Vite + GSAP, a 2-D layered stage (no Three.js). Loader → fruit lineup → hover →
click → flavour detail (colour morph, kinetic type, floating fruit, parallax) →
arrow-navigate (wraps) → home. See `README.md` for full architecture, asset
provenance, and the env-image swap.

This **replaced** the previous "VOLTÉ" 3-D showcase that used to live here; that
code and its deps (three / fiber / drei) are gone.

## Status: complete and verified ✅

- Build is clean (`npm run build`, ~85 kB gzip JS).
- Whole flow verified headlessly (desktop 1440, mobile 390) with zero console
  errors, plus the reduced-motion path.

## The one caveat to carry forward

The spec says "bottles"; the live home actually lines up **fruit** images
(`ciao_*.avif`). There are no bottle renders on the site. This builds the real
thing (a fruit lineup) but keeps `bottle*` names in code. Real bottle art can be
dropped into `public/assets/bottles/<slug>.avif` later with no code change.
Details in `README.md` → "bottles are fruit".

## Where things live

- `src/data/flavors.ts` — the 8 flavours (colours, fruit, French copy). Single
  source of truth.
- `src/styles/tokens.css` — every reskin knob (env images, loader gradient,
  chrome colours, fonts). `global.css` — layout / z-order / components.
- `src/components/BottleStage.tsx` — the lineup ↔ detail layout engine (the hard
  part). `Stage.tsx` composes all layers + chrome + input.
- `src/motion/*` — parallax, shared timings, reduced-motion. `src/state/store.ts`
  — Zustand (`window.__store` in dev).
- `scripts/fetch-assets.mjs` — re-pull placeholder brand assets.
  `scripts/generate-fruit.mjs` — regenerate the decorative fruit SVGs.

## Suggested next steps

1. Drop in the Sidi Bou Said sky + grass (`public/assets/env/`) and recolour
   `tokens.css` — the planned rebrand.
2. Replace fonts / wordmark / fruit art with final brand assets.
3. Build out the stubbed routes (Fabrication, Distributeurs, FAQ) — add Lenis
   only when those scrollable pages arrive (per spec).
4. Deploy: `npm run build` → static `dist/`.
