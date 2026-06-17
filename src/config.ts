/**
 * config.ts — SINGLE SOURCE OF TRUTH for look-and-feel.
 *
 * Every magic number that affects visuals, motion, layout or timing lives here
 * so the whole experience can be tuned without hunting through components.
 *
 * Sections roughly follow the build phases:
 *   - palette / background / vignette        (Phase 1)
 *   - typography                              (Phase 1)
 *   - camera framings                         (Phase 2 + 5)
 *   - can geometry + material + label         (Phase 2)
 *   - ring layout + float                     (Phase 2/3)
 *   - lighting (only-middle-is-lit)           (Phase 2/3)
 *   - navigation / virtual scroll             (Phase 4)
 *   - focus mode                              (Phase 5)
 *   - hud                                     (Phase 1/4)
 *   - audio                                   (Phase 7)
 *   - transitions / easings                   (cross-cutting)
 */

import type { Vector3Tuple } from 'three';

export const config = {
  // ── Background & vignette ────────────────────────────────────────────────
  bg: {
    color: '#050505', // near-pure black
    // Radial vignette is a DOM overlay; these drive its CSS.
    vignetteStrength: 0.85, // 0..1 opacity of the darkened edges
    vignetteInner: 38, // % radius where darkening starts
    vignetteOuter: 100, // % radius where darkening reaches full
  },

  // ── Typography ─────────────────────────────────────────────────────────────
  // Font families are loaded in index.html. Keep names here so swapping is easy.
  type: {
    display: "'Anton', 'Archivo Black', system-ui, sans-serif", // wordmark + titles
    body: "'Inter', system-ui, sans-serif", // UI + body copy
    wordmarkSkewDeg: -8, // italic skew applied via CSS transform
    titleSkewDeg: -6,
    smallTracking: '0.28em', // letter-spacing on tiny technical labels
  },

  // ── Camera ───────────────────────────────────────────────────────────────
  camera: {
    fov: 35,
    near: 0.1,
    far: 100,
    // Gallery framing: the full row, centre can dominant.
    gallery: {
      position: [0, 0.35, 9.5] as Vector3Tuple,
      lookAt: [0, 0, 0] as Vector3Tuple,
    },
    // Focus framing: tight dolly-in on the centre can, hero angle.
    focus: {
      position: [0.6, 0.5, 4.4] as Vector3Tuple,
      lookAt: [0, 0.1, 0] as Vector3Tuple,
    },
    moveDurationMs: 1100, // gallery <-> focus dolly duration
  },

  // ── Can geometry & material ───────────────────────────────────────────────
  can: {
    radius: 0.42,
    height: 1.62,
    radialSegments: 64,
    heightSegments: 1,
    // Tapered rims (top/bottom necking) — fraction of radius the rim pulls in.
    rimTaper: 0.82,
    rimHeight: 0.12,
    material: {
      metalness: 0.9,
      roughness: 0.25,
      envMapIntensity: 1.1,
    },
    rimMaterial: {
      color: '#d8dade',
      metalness: 1.0,
      roughness: 0.18,
    },
  },

  // ── Ring layout ────────────────────────────────────────────────────────────
  ring: {
    radius: 7.2, // radius of the wide arc the cans sit on
    // Angular gap between adjacent cans, in radians. Small => cans sit closer
    // together (tighter lateral spacing) and the arc is shallower.
    angleStep: 0.24,
    // Vertical baseline of the cans.
    baseY: 0,
    // How far back (z, in world units) the centre sits relative to ring origin
    // is derived from radius; this nudges the whole ring toward camera.
    zNudge: 0.0,
  },

  // ── Float (idle bob + rotation) ────────────────────────────────────────────
  float: {
    speed: 1.4,
    rotationIntensity: 0.35,
    floatIntensity: 0.8,
    floatRange: [-0.06, 0.06] as [number, number],
    idleSpinSpeed: 0.12, // rad/s slow Y spin of the centre can
  },

  // ── Lighting (the "only the middle is lit" system) ─────────────────────────
  lighting: {
    ambient: 0.06, // very low base fill
    spot: {
      color: '#ffffff',
      intensity: 90,
      position: [0, 5.2, 3.2] as Vector3Tuple,
      angle: 0.32, // tight cone (radians)
      penumbra: 0.7,
      distance: 18,
      decay: 1.4,
      castShadow: true,
    },
    rim: {
      color: '#aab4ff',
      intensity: 14,
      position: [0, 1.6, -3.2] as Vector3Tuple, // behind centre
    },
    // Coloured low/central point light tinted with the active themeColor so the
    // in-scene glow agrees with the DOM bottom gradient.
    themeGlow: {
      intensity: 6,
      position: [0, -1.3, 1.6] as Vector3Tuple,
      distance: 9,
    },
    // Per-can brightness falloff by angular distance from centre.
    // index distance 0 => full; the curve drives envMapIntensity + a tint mult.
    falloff: {
      // brightness = max(min, base * pow(perStep, distance))
      perStep: 0.32,
      min: 0.02,
    },
  },

  // ── Navigation / virtual scroll ──────────────────────────────────────────
  nav: {
    lateralEase: 0.12, // lerp factor per frame toward targetLateral
    snapThreshold: 0.004, // velocity/dist below which we snap to nearest
    wheelLateralScale: 0.0016, // wheel deltaX -> lateral units
    dragLateralScale: 0.0065, // pointer drag px -> lateral units
    keyStep: 1, // A/D / arrows move one flavour
    // Depth (gallery <-> focus) intent.
    wheelDepthThreshold: 42, // accumulated deltaY to trigger focus
    touchDepthThreshold: 56, // px vertical swipe to trigger depth change
  },

  // ── Focus mode ───────────────────────────────────────────────────────────
  focus: {
    canScale: 1.34, // centre can scales up in focus
    canTiltDeg: -12, // hero tilt (x rotation)
    canYawDeg: 18, // hero yaw (y rotation)
    neighborFade: 0.0, // neighbours fade to this opacity-equivalent brightness
    panelFadeMs: 520,
    crossSwapMs: 460, // can/copy cross-transition when arrows used in focus
  },

  // ── HUD ─────────────────────────────────────────────────────────────────
  hud: {
    cornerMark: {
      size: 26, // px length of each L arm
      thickness: 1, // px
      inset: 24, // px from viewport edge
      opacity: 0.45,
    },
    chevron: {
      size: 8,
      opacity: 0.3,
    },
    flavorName: {
      crossfadeMs: 500,
    },
  },

  // ── Scrubber ──────────────────────────────────────────────────────────────
  scrubber: {
    width: 0.46, // fraction of viewport width
    trackHeight: 2, // px
    handleSize: 12, // px diameter
    label: 'SCROLLER POUR DÉCOUVRIR',
  },

  // ── Ambient bottom colour (the "colour follows the bottle" feature) ────────
  theme: {
    lerpMs: 600, // how long --theme eases to the active flavour colour
  },

  // ── Loading / reveal ───────────────────────────────────────────────────────
  reveal: {
    minLoadMs: 900, // minimum time the loader is shown
    maxLoadMs: 4500, // safety: force-complete after this even if assets stall
    dropHeight: 3.6, // world units the cans fall from on reveal
    durationMs: 1500, // reveal tween (cans drop/fade, spot ramps)
    loaderFadeMs: 650,
  },

  // ── Audio ──────────────────────────────────────────────────────────────────
  audio: {
    ambientVolume: 0.22,
    whooshVolume: 0.35,
    fadeMs: 800,
  },

  // ── Environment / renderer ─────────────────────────────────────────────────
  env: {
    preset: 'studio' as const, // drei <Environment> preset
    dprMin: 1,
    dprMax: 2,
  },

  // ── Easings (GSAP) ─────────────────────────────────────────────────────────
  ease: {
    camera: 'power3.inOut',
    panel: 'power2.out',
    reveal: 'power3.out',
    swap: 'power2.inOut',
  },
} as const;

export type Config = typeof config;
