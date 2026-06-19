import { useEffect, useState } from 'react';
import { flavors } from '../data/flavors';

/**
 * Decodes the 8 bottle images so the lineup paints instantly when the loader
 * lifts. Reports 0..1 progress (drives the loader counter) and a `ready` flag.
 * Resilient: a failed decode still counts so the gate can never hang.
 */
export function usePreloadBottles() {
  const [loaded, setLoaded] = useState(0);
  const total = flavors.length;

  useEffect(() => {
    let cancelled = false;
    let done = 0;
    const bump = () => {
      done += 1;
      if (!cancelled) setLoaded(done);
    };
    flavors.forEach((f) => {
      const img = new Image();
      img.src = f.bottleSrc;
      const finish = () => bump();
      if (img.decode) {
        img.decode().then(finish, finish);
      } else {
        img.onload = finish;
        img.onerror = finish;
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { progress: total ? loaded / total : 1, ready: loaded >= total, loaded, total };
}
