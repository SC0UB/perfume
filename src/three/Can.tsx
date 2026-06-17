/**
 * Can — a single real-time 3D drink can.
 *
 * A tapered aluminium cylinder: labelled body + necked top/bottom tapers, a
 * brushed lid and a drinking rim. The wraparound label is a procedural
 * CanvasTexture (swap `flavor.labelTexture` for real art later).
 *
 * `brightnessRef` (0..1) dims the whole can every frame — used by the ring to
 * make neighbours fall into darkness regardless of the lighting (the
 * "only-middle-is-lit" guarantee). It scales both the base colour and
 * envMapIntensity. Driving it via a ref (not a prop) keeps the smooth
 * brighten-as-you-approach transition off the React render path.
 */

import { useEffect, useMemo, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, MeshStandardMaterial, type Texture } from 'three';
import { config } from '../config';
import { makeLabelTexture } from './makeLabelTexture';
import type { Flavor } from '../data/flavors';

type CanProps = {
  flavor: Flavor;
  brightnessRef?: MutableRefObject<number>;
};

const { can } = config;

export function Can({ flavor, brightnessRef }: CanProps) {
  // Procedural label (regenerated per flavour). Disposed on change/unmount.
  const label = useMemo<Texture>(() => makeLabelTexture(flavor), [flavor]);
  useEffect(() => () => label.dispose(), [label]);

  // Two shared materials: labelled body + brushed metal (rims/lid/torus).
  const bodyMat = useMemo(
    () =>
      new MeshStandardMaterial({
        map: label,
        metalness: can.material.metalness,
        roughness: can.material.roughness,
        envMapIntensity: can.material.envMapIntensity,
      }),
    [label],
  );
  const metalMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color(can.rimMaterial.color),
        metalness: can.rimMaterial.metalness,
        roughness: can.rimMaterial.roughness,
        envMapIntensity: can.material.envMapIntensity,
      }),
    [],
  );
  useEffect(
    () => () => {
      bodyMat.dispose();
      metalMat.dispose();
    },
    [bodyMat, metalMat],
  );

  const rimBase = useMemo(() => new Color(can.rimMaterial.color), []);

  const geo = useMemo(() => {
    const rTop = can.radius * can.rimTaper;
    const bodyH = can.height - can.rimHeight * 2;
    return { rTop, bodyH, topY: bodyH / 2 + can.rimHeight / 2, lidY: bodyH / 2 + can.rimHeight };
  }, []);

  // Apply brightness every frame (cheap; 2 materials per can).
  useFrame(() => {
    const b = brightnessRef ? brightnessRef.current : 1;
    bodyMat.color.setScalar(b);
    bodyMat.envMapIntensity = can.material.envMapIntensity * b;
    metalMat.color.copy(rimBase).multiplyScalar(b);
    metalMat.envMapIntensity = can.material.envMapIntensity * b;
  });

  return (
    <group>
      {/* Body (labelled) */}
      <mesh castShadow receiveShadow material={bodyMat}>
        <cylinderGeometry args={[can.radius, can.radius, geo.bodyH, can.radialSegments, 1, false]} />
      </mesh>

      {/* Top taper (necked aluminium) */}
      <mesh position={[0, geo.topY, 0]} castShadow material={metalMat}>
        <cylinderGeometry args={[geo.rTop, can.radius, can.rimHeight, can.radialSegments]} />
      </mesh>

      {/* Bottom taper */}
      <mesh position={[0, -geo.topY, 0]} castShadow material={metalMat}>
        <cylinderGeometry args={[can.radius, geo.rTop, can.rimHeight, can.radialSegments]} />
      </mesh>

      {/* Brushed lid */}
      <mesh position={[0, geo.lidY, 0]} castShadow material={metalMat}>
        <cylinderGeometry args={[geo.rTop * 0.97, geo.rTop, 0.05, can.radialSegments]} />
      </mesh>

      {/* Drinking rim (lip torus) */}
      <mesh position={[0, geo.lidY + 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow material={metalMat}>
        <torusGeometry args={[geo.rTop, 0.022, 10, can.radialSegments]} />
      </mesh>
    </group>
  );
}
