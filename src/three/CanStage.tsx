/**
 * CanStage — the 3D scene root (the default "ThreeStage").
 *
 * A procedural studio Environment (built from Lightformers so the metal gets
 * believable reflections with ZERO external HDRI / network), the lighting rig,
 * and the six-can ring.
 *
 * This component is the seam the optional <VideoStage> (Phase 8) plugs into
 * behind the same interface.
 */

import { Environment, Lightformer } from '@react-three/drei';
import { Lighting } from './Lighting';
import { CanRing } from './CanRing';
import { CameraRig } from './CameraRig';

function StudioEnvironment() {
  return (
    <Environment resolution={256} frames={1} background={false}>
      {/* Key — broad soft panel, upper front */}
      <Lightformer
        form="rect"
        intensity={1.6}
        color="#ffffff"
        position={[0, 3.5, 3]}
        rotation={[-Math.PI / 3, 0, 0]}
        scale={[8, 4, 1]}
      />
      {/* Cool back rim */}
      <Lightformer
        form="rect"
        intensity={1.1}
        color="#9fb0ff"
        position={[0, 1.5, -5]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[8, 6, 1]}
      />
      {/* Vertical specular streaks (left / right) */}
      <Lightformer
        form="rect"
        intensity={2.2}
        color="#ffffff"
        position={[-3.5, 1, 2]}
        rotation={[0, Math.PI / 3, 0]}
        scale={[0.6, 5, 1]}
      />
      <Lightformer
        form="rect"
        intensity={2.2}
        color="#ffffff"
        position={[3.5, 1, 2]}
        rotation={[0, -Math.PI / 3, 0]}
        scale={[0.6, 5, 1]}
      />
      {/* Dim floor bounce */}
      <Lightformer
        form="rect"
        intensity={0.4}
        color="#ffffff"
        position={[0, -3, 1]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[8, 8, 1]}
      />
    </Environment>
  );
}

export function CanStage() {
  return (
    <>
      <CameraRig />
      <StudioEnvironment />
      <Lighting />
      <CanRing />
    </>
  );
}
