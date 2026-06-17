/**
 * Loader — full-black boot screen: the [BRAND] wordmark + a 0→100% counter.
 *
 * Progress reflects real readiness: drei useProgress (any R3F-managed loads),
 * document.fonts.ready, and a minimum display time — with a max-time safety so
 * it can never hang. On completion it fades out, flips mode -> 'gallery' and
 * kicks the reveal (cans drop/fade in, spotlight ramps).
 */

import { useEffect, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { useStore } from '../store';
import { BRAND } from '../data/flavors';
import { config } from '../config';
import { startReveal } from '../controllers/reveal';

export function Loader() {
  const { progress, active } = useProgress();
  const setLoaded = useStore((s) => s.setLoaded);

  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<'load' | 'reveal' | 'done'>('load');

  const valRef = useRef(0);
  const fontsReady = useRef(false);
  const startedAt = useRef(performance.now());
  const completed = useRef(false);

  useEffect(() => {
    // Resolves on success OR failure, so a blocked font CDN can't hang us.
    (document as Document).fonts?.ready.then(() => {
      fontsReady.current = true;
    });
  }, []);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - startedAt.current;
      const ready =
        (fontsReady.current && !active && elapsed > config.reveal.minLoadMs) ||
        elapsed > config.reveal.maxLoadMs;

      // While loading, climb toward ~92 (blend real progress + time); when
      // ready, target 100.
      const target = ready
        ? 100
        : Math.min(92, progress * 0.6 + Math.min(70, elapsed / 18));

      valRef.current += (target - valRef.current) * 0.08;
      if (ready && valRef.current > 99) valRef.current = 100;
      setPct((p) => (Math.round(valRef.current) !== p ? Math.round(valRef.current) : p));

      if (valRef.current >= 100 && !completed.current) {
        completed.current = true;
        setPhase('reveal');
        setLoaded(); // mode -> gallery
        startReveal(); // cans drop/fade in, spot ramps
        window.setTimeout(() => setPhase('done'), config.reveal.loaderFadeMs + 80);
        return; // stop the loop
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress, active, setLoaded]);

  if (phase === 'done') return null;

  return (
    <div className={`loader ${phase === 'reveal' ? 'fade-out' : ''}`}>
      <div
        className="loader-wordmark"
        style={{ transform: `skewX(${config.type.wordmarkSkewDeg}deg)` }}
      >
        {BRAND}
      </div>
      <div className="loader-pct">{pct}%</div>
    </div>
  );
}
