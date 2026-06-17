/**
 * useAudio — lazy, procedural ambient audio (Web Audio API, no asset files).
 *
 * A low detuned drone loop while audio is ON, plus a soft filtered-noise whoosh
 * on every flavour/mode transition. The AudioContext is created lazily on the
 * first toggle (a user gesture) — never autoplays. If the user prefers reduced
 * motion we skip the transition whooshes but still allow the ambient pad.
 */

import { useEffect, useRef } from 'react';
import { useStore } from '../store';
import { config } from '../config';
import { REDUCED_MOTION } from '../reducedMotion';

type Ambient = { stop: () => void };

function startAmbient(ctx: AudioContext): Ambient {
  const master = ctx.createGain();
  master.gain.value = 0;
  master.gain.linearRampToValueAtTime(
    config.audio.ambientVolume,
    ctx.currentTime + config.audio.fadeMs / 1000,
  );

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 320;
  filter.Q.value = 0.7;
  filter.connect(master);
  master.connect(ctx.destination);

  // Two detuned sine drones an octave apart.
  const oscs = [55, 55.4, 110].map((f, i) => {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.value = i === 2 ? 0.25 : 1;
    o.connect(g);
    g.connect(filter);
    o.start();
    return o;
  });

  // Slow LFO opening/closing the filter for movement.
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.06;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 180;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  return {
    stop: () => {
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.linearRampToValueAtTime(0, t + config.audio.fadeMs / 1000);
      window.setTimeout(() => {
        oscs.forEach((o) => o.stop());
        lfo.stop();
      }, config.audio.fadeMs + 50);
    },
  };
}

function whoosh(ctx: AudioContext) {
  const dur = 0.5;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const src = ctx.createBufferSource();
  src.buffer = buffer;

  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.setValueAtTime(300, ctx.currentTime);
  band.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + dur);
  band.Q.value = 0.8;

  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(config.audio.whooshVolume, ctx.currentTime + 0.05);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);

  src.connect(band);
  band.connect(g);
  g.connect(ctx.destination);
  src.start();
  src.stop(ctx.currentTime + dur);
}

export function useAudio() {
  const audioOn = useStore((s) => s.audioOn);
  const activeIndex = useStore((s) => s.activeIndex);
  const mode = useStore((s) => s.mode);

  const ctxRef = useRef<AudioContext | null>(null);
  const ambientRef = useRef<Ambient | null>(null);
  const firstTransition = useRef(true);

  // Ambient pad lifecycle.
  useEffect(() => {
    if (!audioOn) {
      ambientRef.current?.stop();
      ambientRef.current = null;
      return;
    }
    try {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = (ctxRef.current ??= new Ctor());
      void ctx.resume();
      ambientRef.current = startAmbient(ctx);
    } catch {
      /* audio unavailable — fail silently */
    }
  }, [audioOn]);

  // Whoosh on transitions.
  useEffect(() => {
    if (firstTransition.current) {
      firstTransition.current = false;
      return;
    }
    if (REDUCED_MOTION) return;
    const ctx = ctxRef.current;
    if (useStore.getState().audioOn && ctx) {
      try {
        whoosh(ctx);
      } catch {
        /* ignore */
      }
    }
  }, [activeIndex, mode]);

  // Tear down on unmount.
  useEffect(() => () => ambientRef.current?.stop(), []);
}
