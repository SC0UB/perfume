import { useRef } from 'react';
import { useParallaxLayer } from '../motion/parallax';

/**
 * Sky / background — the back-most layer. Drawn from the --env-bg CSS var so the
 * image is swappable with no code change. Travels least under the cursor.
 */
export default function EnvBackground() {
  const ref = useRef<HTMLDivElement>(null);
  useParallaxLayer(ref, 14, 9);
  return <div ref={ref} className="env-bg" aria-hidden="true" />;
}
