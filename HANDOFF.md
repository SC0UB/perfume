# HANDOFF — VOLTÉ 3D showcase

Context doc for continuing this project in a fresh chat. Read this + `README.md`,
then `npm install && npm run dev`.

## What this is

A single-page, dark, cinematic WebGL showcase for a **fictional** energy-drink
brand (placeholder **VOLTÉ**). Real-time 3D cans (zero external renders) under a
DOM/CSS HUD. Interaction language inspired by award-style Webflow product sites;
**no real brand assets/logos/videos/copy are used.** Original 8-phase build spec
was followed exactly.

## Current status: COMPLETE through Phase 8 ✅

All acceptance criteria met and verified in a headless browser:
- Loading screen w/ live 0→100% counter → reveal (cans drop/fade, spot ramps, HUD staggers).
- Six cans on an arc; only the centre is lit; neighbours fall to near-black.
- Infinite lateral carousel: side arrows, drag, `A`/`D` + `←`/`→`, wheel ΔX, gradient scrubber.
- Ambient bottom colour + in-scene light lerp to the active flavour (~600 ms).
- Scattered perimeter letters spell the flavour (re-layout + crossfade); bottom flavour name crossfades.
- Scroll-down → focus dolly-in: hero scale/tilt, title + description + benefit icons; neighbours/bottom UI recede.
- **Side arrows still swap flavours while in focus** (copy + colour follow), scroll-up / `Esc` exits.
- Procedural audio toggle (off by default), full-screen menu, `prefers-reduced-motion`, mobile/touch + perf tuning.
- Phase 8 seam: one-line swap in `src/stage.ts` between `ThreeStage` and a scaffolded `VideoStage`.

## Stack

Vite + React + TypeScript · three / @react-three/fiber@8 / @react-three/drei@9 ·
gsap · zustand · lucide-react. Plain CSS HUD. Node 22, npm 10. `npm run build`
is clean (tsc + vite). Do not add heavy deps without asking.

## Architecture (the important bits)

- **`src/config.ts`** — SINGLE source of truth for every tunable (palette, type,
  camera framings, can geometry/material, ring layout, lighting + falloff,
  nav feel, focus pose, HUD, reveal, audio, easings). Tune here, not in
  components.
- **`src/store.ts`** (zustand) — `mode` (`loading`/`gallery`/`focus`),
  `activeIndex`, lerped `themeColor`, `audioOn`, `menuOpen`. `next/prev/goTo`
  delegate to the virtualScroll controller; `syncActiveIndex` is the one-way
  mirror back from the controller. In dev, `window.__store` is exposed.
- **Motion lives OUTSIDE React** (performance — no per-frame re-renders):
  - `controllers/virtualScroll.ts` — continuous, eased, infinitely-wrapping
    carousel position. Inputs write `target`; per-frame `update(dt)` eases +
    snaps; `activeIndex()` is the snapped, wrapped index.
  - `controllers/focus.ts` + `reveal.ts` — single 0..1 progress values.
  - `controllers/useNavigation.ts` — wheel/drag(axis-locked)/keys → controller;
    deltaY/vertical-swipe/`Esc` → focus depth.
  - `three/CanRing.tsx` — ONE `useFrame` reads all three controllers and updates
    each can's transform/brightness/spin imperatively; mirrors snapped index to
    the store. `three/CameraRig.tsx` lerps the camera by focus progress.
  - `three/Can.tsx` applies `brightnessRef` per frame (smooth neighbour fade).
- **Colour-follows-bottle**: `ui/themeColor.tsx` eases `store.themeColor`; it
  feeds the `--theme` CSS var (DOM glow) AND the in-scene tinted light.
- **Procedural everything**: labels = `three/makeLabelTexture.ts` (CanvasTexture);
  reflections = drei `Lightformer`s (no HDRI); audio = Web Audio API. Only the
  fonts are fetched at runtime.
- **Stage seam**: `src/stage.ts` exports the active stage; `three/ThreeStage.tsx`
  is the real-time canvas; `three/VideoStage.tsx` is the documented video
  scaffold (drop `public/videos/<id>-gallery.webm` + `-focus.webm`, flip the
  export).

## Gotchas / non-bugs

- **Fonts**: Anton + Inter load from Google Fonts. If a sandbox blocks that CDN,
  type falls back to system fonts (NOT a bug). With the CDN blocked, the loader
  also runs to its `maxLoadMs` (~4.5 s) because `document.fonts.ready` resolves
  late; in a normal browser it completes in ~1 s.
- **Verifying visually without a GUI**: install `playwright-core`, download
  chromium, and screenshot with software GL. Flags that worked:
  `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader
  --ignore-gpu-blocklist --no-sandbox`. WebGL renders fine under swiftshader.
  Drive state in-page via `window.__store.getState().goTo(n)` / `setMode('focus')`.
- **Bundle size**: ~1.1 MB (three+drei). Fine for a showcase; could code-split
  later if desired.

## Repo / git state

- Branch: **`claude/tender-hopper-mnmx6a`**. 7 commits: Phases 1–5 individually,
  then a combined Phases 6–8, plus this handoff. `git log` is intact in the tarball.
- In the previous session, pushing was blocked (read-only credentials on
  `SC0UB/perfume`; `SC0UB/portfolio` not in scope). If your new session has
  write access, just `git push -u origin <branch>` (or push to the portfolio
  repo). Otherwise extract the tarball and push from your machine.

## Suggested next steps (pick any)

1. Tune look-and-feel in `config.ts` (lighting intensity, ring spread/angleStep,
   camera framings, falloff curve, float).
2. Real label art: set `labelTexture` in `data/flavors.ts` + load with `useTexture`.
3. Build out `VideoStage` for the photoreal upgrade (needs user webms).
4. A bespoke SVG logo to replace the `VOLTÉ` text wordmark (TODOs in code).
5. Deploy (static host: `npm run build` → `dist/`).
