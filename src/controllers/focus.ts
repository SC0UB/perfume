/**
 * focus — a single 0..1 progress value driving the gallery <-> focus transition.
 *
 * Kept outside React (like virtualScroll) so the camera dolly, the hero can's
 * scale/tilt, the neighbour fade and the panel can all read it per-frame
 * without re-rendering. `useFocusTransition` tweens it whenever mode changes.
 */

import { useEffect } from 'react';
import gsap from 'gsap';
import { useStore } from '../store';
import { config } from '../config';

export const focusState = { progress: 0 };

export function useFocusTransition() {
  const mode = useStore((s) => s.mode);

  useEffect(() => {
    const tween = gsap.to(focusState, {
      progress: mode === 'focus' ? 1 : 0,
      duration: config.camera.moveDurationMs / 1000,
      ease: config.ease.camera,
    });
    return () => {
      tween.kill();
    };
  }, [mode]);
}
