/**
 * FocusPanel — fades in when mode === 'focus'.
 *
 * Left: the flavour title (large bold italic) + the 1–2 sentence description.
 * Right: a vertical stack of circular outlined benefit icons with hover
 * tooltips. Title/description are re-keyed on the active flavour so they
 * cross-transition when the side arrows swap flavours WITHOUT leaving focus.
 *
 * The benefits are brand-level (constant across flavours) — placeholder glyphs.
 */

import { CircleMinus, Flower2, Sprout, Leaf } from 'lucide-react';
import { useStore, useActiveFlavor } from '../store';
import { config } from '../config';

const BENEFITS = [
  { Icon: CircleMinus, label: 'Sucres réduits' },
  { Icon: Flower2, label: 'Arômes naturels' },
  { Icon: Sprout, label: 'Caféine végétale' },
  { Icon: Leaf, label: 'Stévia' },
];

export function FocusPanel() {
  const mode = useStore((s) => s.mode);
  const flavor = useActiveFlavor();
  const open = mode === 'focus';

  return (
    <div className={`focus-panel ${open ? 'visible' : ''}`} aria-hidden={!open}>
      <div className="focus-copy">
        <h2
          key={`${flavor.id}-t`}
          className="focus-title"
          style={{ transform: `skewX(${config.type.titleSkewDeg}deg)` }}
        >
          {flavor.title}
        </h2>
        <p key={`${flavor.id}-d`} className="focus-desc">
          {flavor.description}
        </p>
      </div>

      <ul className="focus-benefits">
        {BENEFITS.map(({ Icon, label }) => (
          <li className="benefit" key={label} tabIndex={open ? 0 : -1} data-interactive>
            <span className="benefit-ring">
              <Icon size={20} strokeWidth={1.5} />
            </span>
            <span className="benefit-tip">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
