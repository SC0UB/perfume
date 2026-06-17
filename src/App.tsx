/**
 * App — composition root.
 *
 * Layering (back to front):
 *   z0  .stage-canvas   the stage (ThreeStage by default; see ./stage.ts)
 *   z1  .vignette       radial edge darkening
 *   z1  .ambient-glow   the flavour-coloured glow at the bottom (--theme)
 *   z10 .hud            DOM overlay: nav, scrubber, focus panel, menu …
 *   z100 .loader        boot screen (until reveal)
 */

import { Stage } from './stage';
import { Hud } from './ui/Hud';
import { Loader } from './ui/Loader';
import { useThemeLerp, ThemeCssVar } from './ui/themeColor';
import { useNavigation } from './controllers/useNavigation';
import { useFocusTransition } from './controllers/focus';
import { useAudio } from './audio/useAudio';

export default function App() {
  // Ease the theme colour toward the active flavour on every change.
  useThemeLerp();
  // Wire wheel / drag / keyboard navigation (lateral + depth).
  useNavigation();
  // Tween the gallery <-> focus dolly on mode change.
  useFocusTransition();
  // Lazy procedural ambient audio + transition whooshes.
  useAudio();

  return (
    <>
      <Stage />

      {/* DOM overlays */}
      <div className="vignette" aria-hidden />
      <div className="ambient-glow" aria-hidden />
      <ThemeCssVar />
      <Hud />
      <Loader />
    </>
  );
}
