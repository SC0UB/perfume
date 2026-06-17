/**
 * VideoStage — OPTIONAL photoreal upgrade path (Phase 8). Satisfies the same
 * "stage" seam as ThreeStage; swap it in via ../stage.ts.
 *
 * How the reference site achieves photoreal cans: per flavour, a pre-rendered
 * looping webm (one full gallery loop, rotated so that flavour is centred and
 * lit) plus a per-flavour close-up loop for focus mode. Navigation cross-fades
 * between the active flavour's video and the neighbour's; focus cross-fades to
 * the close-up. All HUD, controls, state and ambient-colour logic stay
 * identical — this component only swaps how the cans are rendered.
 *
 * Drop files in /public/videos named `<flavor.id>-gallery.webm` and
 * `<flavor.id>-focus.webm`, then switch the export in src/stage.ts. Until then
 * this renders nothing visible (a hint in dev).
 */

import { useStore } from '../store';

const base = import.meta.env.BASE_URL;
const gallerySrc = (id: string) => `${base}videos/${id}-gallery.webm`;
const focusSrc = (id: string) => `${base}videos/${id}-focus.webm`;

export function VideoStage() {
  const flavors = useStore((s) => s.flavors);
  const activeIndex = useStore((s) => s.activeIndex);
  const mode = useStore((s) => s.mode);
  const focused = mode === 'focus';

  return (
    <div className="stage-canvas video-stage" aria-hidden>
      {flavors.map((f, i) => {
        const active = i === activeIndex;
        return (
          <video
            key={f.id}
            className="video-layer"
            style={{ opacity: active ? 1 : 0 }}
            src={focused && active ? focusSrc(f.id) : gallerySrc(f.id)}
            autoPlay
            loop
            muted
            playsInline
            preload={Math.abs(i - activeIndex) <= 1 ? 'auto' : 'metadata'}
          />
        );
      })}
      {import.meta.env.DEV && (
        <div className="video-hint">
          VideoStage active — add /public/videos/&lt;id&gt;-gallery.webm
        </div>
      )}
    </div>
  );
}
