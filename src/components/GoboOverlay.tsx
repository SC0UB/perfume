import { useEffect, useRef, useState } from 'react';
import { asset } from '../asset';
import { prefersReducedMotion } from '../motion/prefersReducedMotion';

/**
 * Moving light / dust overlay (the "gobo" video), full-bleed and screen-blended
 * at low opacity. Pauses when the tab is hidden (perf), and degrades gracefully:
 * if the file is absent or fails to decode, it simply renders nothing.
 */
export default function GoboOverlay() {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (prefersReducedMotion()) return; // keep the first frame, but don't loop-play

    const onVisibility = () => {
      if (document.hidden) v.pause();
      else void v.play().catch(() => {});
    };
    void v.play().catch(() => {});
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  if (failed) return null;

  return (
    <video
      ref={ref}
      className="gobo-overlay"
      src={asset('assets/video/gobo.mp4')}
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      onError={() => setFailed(true)}
    />
  );
}
