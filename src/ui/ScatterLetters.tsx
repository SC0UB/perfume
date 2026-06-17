/**
 * ScatterLetters — large, very low-opacity letters scattered around the screen
 * perimeter spelling the active flavour. Re-lays out and cross-fades on change.
 *
 * Two-layer crossfade: when the flavour changes the old layer is marked
 * `leaving` (fades out) while the new layer fades in, then the old is dropped.
 */

import { useEffect, useRef, useState } from 'react';
import { useActiveFlavor } from '../store';
import { config } from '../config';

const { scatterLetters } = config.hud;

/** Deterministic pseudo-random in [0,1) from a seed. */
function rand(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

type Glyph = { ch: string; left: number; top: number; size: number; rot: number };

function layout(title: string): Glyph[] {
  const chars = [...title].filter((c) => c !== ' ');
  const t = chars.length;
  const seedBase = title.length * 7.3;
  return chars.map((ch, i) => {
    const a = (-Math.PI / 2) + (i / t) * Math.PI * 2; // start top, clockwise
    const jitterR = 0.86 + rand(seedBase + i) * 0.22;
    const left = 50 + Math.cos(a) * 44 * jitterR + (rand(seedBase + i * 2) - 0.5) * 8;
    const top = 50 + Math.sin(a) * 40 * jitterR + (rand(seedBase + i * 3) - 0.5) * 8;
    const size =
      scatterLetters.minSize +
      rand(seedBase + i * 5) * (scatterLetters.maxSize - scatterLetters.minSize);
    const rot = (rand(seedBase + i * 9) - 0.5) * 16;
    return { ch, left, top, size, rot };
  });
}

type Layer = { id: number; title: string; leaving: boolean };

export function ScatterLetters() {
  const flavor = useActiveFlavor();
  const [layers, setLayers] = useState<Layer[]>([
    { id: 0, title: flavor.title, leaving: false },
  ]);
  const idRef = useRef(0);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    idRef.current += 1;
    const id = idRef.current;
    setLayers((cur) => [
      ...cur.map((l) => ({ ...l, leaving: true })),
      { id, title: flavor.title, leaving: false },
    ]);
    const t = window.setTimeout(
      () => setLayers((cur) => cur.filter((l) => l.id === id)),
      scatterLetters.crossfadeMs,
    );
    return () => window.clearTimeout(t);
  }, [flavor.id, flavor.title]);

  return (
    <div className="scatter-letters" aria-hidden>
      {layers.map((layer) => (
        <div
          key={layer.id}
          className={`scatter-layer ${layer.leaving ? 'leaving' : 'entering'}`}
        >
          {layout(layer.title).map((g, i) => (
            <span
              key={i}
              className="scatter-glyph"
              style={{
                left: `${g.left}%`,
                top: `${g.top}%`,
                fontSize: `${g.size}px`,
                transform: `translate(-50%, -50%) rotate(${g.rot}deg)`,
              }}
            >
              {g.ch}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
