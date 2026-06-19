import { useRef } from 'react';
import { useParallaxLayer } from '../motion/parallax';

/**
 * Grass foreground — a transparent band along the bottom that the bottle bases
 * sink into, so they read as planted. Drawn from the --env-grass CSS var
 * (swappable). Travels most under the cursor (nearest the camera).
 */
export default function EnvGrass() {
  const ref = useRef<HTMLDivElement>(null);
  useParallaxLayer(ref, 40, 20);
  return <div ref={ref} className="env-grass" aria-hidden="true" />;
}
