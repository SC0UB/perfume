/**
 * CameraRig — drives the single PerspectiveCamera between the gallery framing
 * and the tight focus framing by interpolating with focusState.progress.
 */

import { useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { config } from '../config';
import { focusState } from '../controllers/focus';

export function CameraRig() {
  const camera = useThree((s) => s.camera);

  const v = useMemo(
    () => ({
      gP: new Vector3(...config.camera.gallery.position),
      fP: new Vector3(...config.camera.focus.position),
      gL: new Vector3(...config.camera.gallery.lookAt),
      fL: new Vector3(...config.camera.focus.lookAt),
      p: new Vector3(),
      l: new Vector3(),
    }),
    [],
  );

  useFrame(() => {
    const t = focusState.progress;
    camera.position.copy(v.p.lerpVectors(v.gP, v.fP, t));
    camera.lookAt(v.l.lerpVectors(v.gL, v.fL, t));
  });

  return null;
}
