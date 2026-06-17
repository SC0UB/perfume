# VOLTÉ — cinematic 3D energy-drink showcase

A single-page, dark, cinematic WebGL product showcase for a **fictional**
energy-drink brand (placeholder name **VOLTÉ**). Real-time 3D cans (no external
renders), a DOM/CSS HUD on top, infinite lateral navigation, and a scroll-to-
focus zoom. Interaction language inspired by award-style Webflow product sites;
**no real brand assets, logos, videos, or copy are used.**

## Stack

Vite + React + TypeScript · three / @react-three/fiber / @react-three/drei ·
gsap · zustand · lucide-react. Plain CSS for the HUD. No UI framework, no
backend, no analytics, no browser storage.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run preview  # preview the build
```

> Fonts (Anton, Inter) load from Google Fonts; if that CDN is blocked the type
> falls back to system fonts — everything else is self-contained.

## Controls

| Action | Input |
| --- | --- |
| Change flavour (lateral) | Side arrows · drag · `A`/`D` · `←`/`→` · wheel ΔX · scrubber |
| Zoom into a can (focus) | Scroll down · swipe up |
| Exit focus | Scroll up · swipe down · `Esc` |
| Swap flavour **while zoomed** | Side arrows / arrow keys (stays in focus) |
| Audio | Top-left toggle (off by default, never autoplays) |
| Menu | Top-right `MENU` (`Esc` closes) |

## How it works

- **`config.ts`** is the single source of truth for every tunable: palette,
  typography, camera framings, can geometry/material, ring layout, the
  only-middle-is-lit lighting + falloff, navigation feel, focus pose, HUD,
  reveal, audio and easings. Tune look-and-feel here without touching
  components.
- **State** (`store.ts`, zustand) tracks `mode` (`loading`/`gallery`/`focus`),
  `activeIndex`, the lerped `themeColor`, `audioOn`, `menuOpen`.
- **Motion lives outside React** for performance:
  - `controllers/virtualScroll.ts` — continuous, eased, infinitely-wrapping
    carousel position. Inputs write a target; a per-frame loop eases + snaps.
  - `controllers/focus.ts` / `reveal.ts` — single 0..1 progress values that
    drive the camera dolly, hero pose, neighbour fade and intro reveal.
  - `CanRing` reads these each frame and updates transforms/brightness
    imperatively; only the snapped flavour index is mirrored into the store.
- **Ambient colour follows the bottle**: `themeColor` eases toward the active
  flavour (~600 ms) and drives both the DOM bottom glow (`--theme`) and an
  in-scene tinted light.
- **Procedural everything**: can labels are generated with a `CanvasTexture`
  (`makeLabelTexture.ts`); the studio reflections come from drei `Lightformer`s
  (no HDRI); ambient audio is synthesised with the Web Audio API. Nothing is
  fetched at runtime except the fonts.

## Swapping in real label art

Give a flavour a `labelTexture` path in `data/flavors.ts` and load it with
`useTexture` instead of `makeLabelTexture` — that's the only change.

## Optional: photoreal video upgrade (Phase 8)

`src/stage.ts` is a one-line seam between the real-time `ThreeStage` and an
optional `VideoStage` (`three/VideoStage.tsx`) that plays per-flavour looping
webms behind the **same** HUD/controls/state. Drop files in
`public/videos/<flavor-id>-gallery.webm` (+ `-focus.webm`) and switch the export
in `stage.ts`.

## Accessibility & performance

Keyboard navigable (arrows, `Esc`, focus-visible states); `prefers-reduced-
motion` cuts the float/spin/drop and keeps it navigable; DPR is capped with
`AdaptiveDpr`; mobile drops shadows and lowers DPR; textures/materials are
disposed on unmount.

## File layout

```
src/
  config.ts                 all tuning constants
  store.ts                  zustand state
  stage.ts                  ThreeStage <-> VideoStage seam
  reducedMotion.ts
  data/flavors.ts           the six placeholder flavours
  controllers/              virtualScroll · useNavigation · focus · reveal
  three/                    ThreeStage · CanStage · CanRing · Can · Lighting ·
                            CameraRig · makeLabelTexture · VideoStage
  ui/                       Hud · TopNav · SideArrows · Scrubber · FlavorName ·
                            ScatterLetters · FocusPanel · Menu · Loader · themeColor
  audio/useAudio.ts
  App.tsx · index.css
```
