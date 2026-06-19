/**
 * ThreeStage — the default, real-time 3D stage: the R3F <Canvas> hosting the
 * can ring, lighting, environment and camera rig. Runs with zero external
 * renders.
 *
 * This is one implementation of the "stage" seam (see ../stage.ts). The
 * optional VideoStage satisfies the same contract (render the cans; all HUD,
 * controls, state and ambient-colour logic stay identical).
 */

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import { config } from '../config';
import { CanStage } from './CanStage';

// Lower DPR + drop shadows on small screens for performance.
const isMobile =
  typeof window !== 'undefined' &&
  !!window.matchMedia &&
  window.matchMedia('(max-width: 768px)').matches;

export function ThreeStage() {
  // When a backdrop scene is active, render the canvas transparent so the DOM
  // backdrop shows through behind the bottles.
  const transparent =
    config.bg.transparent && config.backdrop.kind !== 'studio';

  return (
    <Canvas
      className="stage-canvas"
      dpr={isMobile ? [1, 1.5] : [config.env.dprMin, config.env.dprMax]}
      camera={{
        fov: config.camera.fov,
        near: config.camera.near,
        far: config.camera.far,
        position: config.camera.gallery.position,
      }}
      gl={{
        antialias: true,
        alpha: transparent,
        powerPreference: 'high-performance',
      }}
      shadows={!isMobile}
    >
      {!transparent && <color attach="background" args={[config.bg.color]} />}
      <Suspense fallback={null}>
        <CanStage />
      </Suspense>
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
