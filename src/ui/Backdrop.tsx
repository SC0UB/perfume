/**
 * Backdrop — the scene behind the bottles.
 *
 * Replaces VOLTÉ's black void with a bright daytime **Sidi Bou Saïd**
 * (Tunisian Mediterranean) scene: whitewashed walls, the iconic cobalt-blue
 * keyhole windows with white lattice grilles, cascading bougainvillea, a strip
 * of sea and a sun-bleached sky.
 *
 * Entirely procedural SVG — no external images, consistent with the repo's
 * "zero external assets" philosophy. A depth-of-field blur (config.backdrop)
 * mimics the out-of-focus hero background of the reference site and also keeps
 * the vector shapes soft and photographic.
 *
 * Lives at z-index 0, behind the WebGL canvas (which renders transparent when
 * a backdrop is active — see ThreeStage / config.bg.transparent).
 */

import { config } from '../config';

/** A cobalt keyhole (Moorish-arch) window with a white lattice grille. */
function MoorishWindow({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const cx = x + w / 2;
  const archR = w / 2;
  // Keyhole/horseshoe arch path: straight jambs, then a > semicircle top.
  const d = `
    M ${x} ${y + h}
    L ${x} ${y + archR * 0.55}
    Q ${x} ${y - archR * 0.15} ${cx} ${y - archR * 0.15}
    Q ${x + w} ${y - archR * 0.15} ${x + w} ${y + archR * 0.55}
    L ${x + w} ${y + h}
    Z`;
  const bars = 4;
  return (
    <g>
      {/* recessed white frame */}
      <path d={d} fill="#f3f1ea" transform={`translate(0 0) scale(1)`} />
      <path
        d={`M ${x - w * 0.08} ${y + h} L ${x - w * 0.08} ${y + archR * 0.5}
            Q ${x - w * 0.08} ${y - archR * 0.28} ${cx} ${y - archR * 0.28}
            Q ${x + w + w * 0.08} ${y - archR * 0.28} ${x + w + w * 0.08} ${y + archR * 0.5}
            L ${x + w + w * 0.08} ${y + h} Z`}
        fill="none"
        stroke="#e7e3d7"
        strokeWidth={w * 0.05}
      />
      {/* deep blue glass */}
      <clipPath id={`win-${x}-${y}`}>
        <path d={d} />
      </clipPath>
      <g clipPath={`url(#win-${x}-${y})`}>
        <rect x={x} y={y - archR} width={w} height={h + archR} fill="#0e63c0" />
        <rect x={x} y={y - archR} width={w} height={h + archR} fill="url(#glassShade)" />
        {/* white lattice grille */}
        {Array.from({ length: bars }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={x + ((i + 1) * w) / (bars + 1)}
            y1={y - archR}
            x2={x + ((i + 1) * w) / (bars + 1)}
            y2={y + h}
            stroke="#f6f4ee"
            strokeWidth={w * 0.035}
          />
        ))}
        {Array.from({ length: bars + 2 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1={x}
            y1={y - archR * 0.2 + (i * (h + archR)) / (bars + 2)}
            x2={x + w}
            y2={y - archR * 0.2 + (i * (h + archR)) / (bars + 2)}
            stroke="#f6f4ee"
            strokeWidth={w * 0.035}
          />
        ))}
      </g>
    </g>
  );
}

/** A cluster of bougainvillea blossoms cascading from a corner. */
function Bougainvillea({ x, y, flip }: { x: number; y: number; flip?: boolean }) {
  const pinks = ['#d6336c', '#e8579a', '#c2255c', '#f06595'];
  const blossoms = Array.from({ length: 46 }).map((_, i) => {
    const a = (i * 137.5 * Math.PI) / 180;
    const r = 14 + Math.sqrt(i) * 26;
    const bx = Math.cos(a) * r * (flip ? -1 : 1) * 0.85;
    const by = Math.sin(a) * r * 0.7 + Math.sqrt(i) * 10;
    return { bx, by, c: pinks[i % pinks.length], s: 7 + ((i * 7) % 9) };
  });
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* leaves */}
      {blossoms.map((b, i) =>
        i % 3 === 0 ? (
          <ellipse
            key={`l${i}`}
            cx={b.bx * 1.05}
            cy={b.by * 1.05 + 6}
            rx={b.s * 1.1}
            ry={b.s * 0.6}
            fill="#3f7d3a"
            opacity={0.9}
          />
        ) : null
      )}
      {blossoms.map((b, i) => (
        <g key={`b${i}`} transform={`translate(${b.bx} ${b.by})`}>
          <circle r={b.s} fill={b.c} />
          <circle r={b.s * 0.32} fill="#fff3c4" />
        </g>
      ))}
    </g>
  );
}

export function Backdrop() {
  if (config.backdrop.kind === 'studio') return null;
  const { blurPx, brightness, saturate } = config.backdrop;

  return (
    <div
      className="backdrop"
      aria-hidden
      style={{
        filter: `blur(${blurPx}px) brightness(${brightness}) saturate(${saturate})`,
      }}
    >
      <svg
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        width="100%"
        height="100%"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3aa8ef" />
            <stop offset="55%" stopColor="#8fd1f3" />
            <stop offset="100%" stopColor="#d8f0fb" />
          </linearGradient>
          <radialGradient id="sun" cx="78%" cy="14%" r="42%">
            <stop offset="0%" stopColor="#fff7da" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#fff7da" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fff7da" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1f8fc4" />
            <stop offset="100%" stopColor="#0e5f97" />
          </linearGradient>
          <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbfaf5" />
            <stop offset="100%" stopColor="#e6e2d6" />
          </linearGradient>
          <linearGradient id="glassShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1b7fd6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#093f7a" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* sky + sun */}
        <rect x="0" y="0" width="1600" height="640" fill="url(#sky)" />
        <rect x="0" y="0" width="1600" height="640" fill="url(#sun)" />

        {/* sea band */}
        <rect x="0" y="470" width="1600" height="170" fill="url(#sea)" />
        {/* sun sparkle on water */}
        <g opacity="0.5" fill="#dff3ff">
          {Array.from({ length: 70 }).map((_, i) => (
            <rect
              key={i}
              x={(i * 53) % 1600}
              y={485 + ((i * 37) % 145)}
              width={18 + ((i * 13) % 30)}
              height="3"
              rx="1.5"
            />
          ))}
        </g>

        {/* distant white village on the headland */}
        <g>
          {Array.from({ length: 16 }).map((_, i) => {
            const bx = 60 + i * 96;
            const bh = 30 + ((i * 53) % 40);
            return (
              <g key={i}>
                <rect x={bx} y={470 - bh} width="78" height={bh} fill="#f4f2ea" />
                <rect x={bx + 14} y={470 - bh - 14} width="50" height="16" rx="8" fill="#1b6cc9" />
              </g>
            );
          })}
        </g>

        {/* foreground whitewashed wall */}
        <rect x="0" y="600" width="1600" height="400" fill="url(#wall)" />
        {/* soft cast shadows along the wall to give it volume */}
        <rect x="0" y="600" width="1600" height="22" fill="#cfcabb" opacity="0.7" />
        <rect x="0" y="965" width="1600" height="35" fill="#d9d4c6" />

        {/* the iconic blue windows + a central doorway, set into the wall */}
        <MoorishWindow x={150} y={660} w={210} h={250} />
        <g>
          {/* central arched doorway (behind the hero bottle, kept subdued) */}
          <MoorishWindow x={660} y={690} w={280} h={310} />
        </g>
        <MoorishWindow x={1240} y={660} w={210} h={250} />

        {/* a few terracotta-potted accents on the wall ledge */}
        {[470, 1130].map((px) => (
          <g key={px} transform={`translate(${px} 905)`}>
            <path d="M0 0 h70 l-9 60 h-52 Z" fill="#c0653b" />
            <rect x="-4" y="-10" width="78" height="14" rx="4" fill="#a8512c" />
          </g>
        ))}

        {/* bougainvillea cascading from the top corners */}
        <Bougainvillea x={150} y={40} />
        <Bougainvillea x={1470} y={60} flip />
      </svg>
    </div>
  );
}
