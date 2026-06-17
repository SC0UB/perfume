/**
 * FlavorName — the bold italic flavour title shown bottom-centre in gallery.
 * The inner span is re-keyed on flavour change so it rises/fades in; the skew
 * lives on the wrapper so the entrance animation doesn't clobber it.
 */

import { useActiveFlavor } from '../store';
import { config } from '../config';

export function FlavorName() {
  const flavor = useActiveFlavor();
  return (
    <div className="flavor-name" aria-hidden>
      <div
        className="flavor-name-skew"
        style={{ transform: `skewX(${config.type.titleSkewDeg}deg)` }}
      >
        <span key={flavor.id} className="flavor-name-text">
          {flavor.title}
        </span>
      </div>
    </div>
  );
}
