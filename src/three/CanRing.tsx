/**
 * CanRing — lays the six cans on a shallow horizontal arc and centres the
 * active flavour at front (z≈0, where the spotlight aims).
 *
 * Driven imperatively by virtualScroll (lateral) + focusState (depth). A single
 * useFrame eases the controller, repositions/dims/spins every can from the
 * continuous `lateral`, applies the focus pose (the centred can scales up and
 * tilts to a hero angle while neighbours fade back), and mirrors the snapped
 * index into the store. Nothing here re-renders during motion.
 */

import { createRef, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { Group, MathUtils } from 'three';
import { Can } from './Can';
import { config } from '../config';
import { useStore } from '../store';
import { virtualScroll } from '../controllers/virtualScroll';
import { focusState } from '../controllers/focus';
import { revealState } from '../controllers/reveal';
import { REDUCED_MOTION } from '../reducedMotion';

const SPIN = REDUCED_MOTION ? 0 : 1;

const { ring, float, lighting, focus } = config;
const DEG = Math.PI / 180;

function wrapOffset(i: number, lateral: number, n: number): number {
  let d = i - lateral;
  d = ((d % n) + n) % n;
  if (d > n / 2) d -= n;
  return d;
}

function brightnessFor(offset: number): number {
  const b = Math.pow(lighting.falloff.perStep, Math.abs(offset));
  return Math.max(lighting.falloff.min, b);
}

function posFor(offset: number) {
  const angle = offset * ring.angleStep;
  return {
    x: ring.radius * Math.sin(angle),
    z: -ring.radius + ring.radius * Math.cos(angle) + ring.zNudge,
    yaw: -angle * 0.5,
  };
}

export function CanRing() {
  const flavors = useStore((s) => s.flavors);
  const n = flavors.length;

  const slots = useMemo(
    () =>
      flavors.map(() => ({
        group: createRef<Group>(),
        pose: createRef<Group>(),
        brightness: { current: 1 } as { current: number },
      })),
    [flavors],
  );
  const idleAccum = useMemo(() => new Array(n).fill(0), [n]);
  const lastActive = useRef(-1);

  useFrame((_, dt) => {
    const lateral = virtualScroll.update(dt);
    const progress = focusState.progress;
    const reveal = revealState.progress;
    const drop = REDUCED_MOTION ? 0 : (1 - reveal) * config.reveal.dropHeight;

    for (let i = 0; i < n; i++) {
      const offset = wrapOffset(i, lateral, n);
      const { x, z, yaw } = posFor(offset);
      const g = slots[i].group.current;
      if (g) {
        g.position.set(x, ring.baseY + drop, z);
        g.rotation.y = yaw;
      }

      // How "centred" this can is (1 at centre, 0 by the first neighbour).
      const centered = Math.max(0, 1 - Math.abs(offset));
      const focusAmt = progress * centered;

      // Brightness: falloff, neighbours fade in focus, all fade in on reveal.
      const b = brightnessFor(offset) * (1 - progress * (1 - centered)) * reveal;
      slots[i].brightness.current = b;

      // Idle spin slows to a stop as the can enters focus.
      idleAccum[i] +=
        SPIN * float.idleSpinSpeed * dt * (b > 0.5 ? 1 : 0.15) * (1 - focusAmt);

      const pose = slots[i].pose.current;
      if (pose) {
        pose.rotation.y = MathUtils.lerp(idleAccum[i], focus.canYawDeg * DEG, focusAmt);
        pose.rotation.x = focus.canTiltDeg * DEG * focusAmt;
        pose.scale.setScalar(1 + (focus.canScale - 1) * focusAmt);
      }
    }

    const active = virtualScroll.activeIndex();
    if (active !== lastActive.current) {
      lastActive.current = active;
      useStore.getState().syncActiveIndex(active);
    }
  });

  return (
    <group>
      {flavors.map((f, i) => {
        const init = posFor(wrapOffset(i, 0, n));
        return (
          <group
            key={f.id}
            ref={slots[i].group}
            position={[init.x, ring.baseY, init.z]}
            rotation={[0, init.yaw, 0]}
          >
            <Float
              speed={REDUCED_MOTION ? 0 : float.speed}
              rotationIntensity={REDUCED_MOTION ? 0 : float.rotationIntensity}
              floatIntensity={REDUCED_MOTION ? 0 : float.floatIntensity}
              floatingRange={float.floatRange}
            >
              <group ref={slots[i].pose}>
                <Can flavor={f} brightnessRef={slots[i].brightness} />
              </group>
            </Float>
          </group>
        );
      })}
    </group>
  );
}
