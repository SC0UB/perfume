/**
 * Lighting — the "only the middle is lit" rig.
 *
 *  - a very low ambient fill so nothing is pure void-black
 *  - one tight SpotLight from above/front aimed at the centre stage (shadows),
 *    ramping up with the reveal
 *  - a cool rim light behind centre for an edge highlight
 *  - a low central point light tinted with the active themeColor, so the
 *    in-scene glow agrees with the DOM ambient bottom gradient
 *
 * Neighbour cans physically sit outside the spot cone (darker); the ring also
 * dims their materials directly, so the effect holds from any angle.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { SpotLight } from 'three';
import { useStore } from '../store';
import { config } from '../config';
import { revealState } from '../controllers/reveal';

export function Lighting() {
  const themeColor = useStore((s) => s.themeColor);
  const { lighting } = config;
  const spot = useRef<SpotLight>(null);

  // Ramp the spotlight up as the scene reveals.
  useFrame(() => {
    if (spot.current) {
      spot.current.intensity = lighting.spot.intensity * revealState.progress;
    }
  });

  return (
    <>
      <ambientLight intensity={lighting.ambient} />

      <spotLight
        ref={spot}
        position={lighting.spot.position}
        angle={lighting.spot.angle}
        penumbra={lighting.spot.penumbra}
        intensity={0}
        distance={lighting.spot.distance}
        decay={lighting.spot.decay}
        color={lighting.spot.color}
        castShadow={lighting.spot.castShadow}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0004}
      />

      <pointLight
        position={lighting.rim.position}
        intensity={lighting.rim.intensity}
        color={lighting.rim.color}
      />

      {/* Theme-tinted glow (follows the active flavour colour) */}
      <pointLight
        position={lighting.themeGlow.position}
        intensity={lighting.themeGlow.intensity}
        distance={lighting.themeGlow.distance}
        color={themeColor}
      />
    </>
  );
}
