/**
 * Hud — the DOM overlay drawn on top of the 3D stage.
 *
 * Corner registration marks + top/bottom chevron ticks + scattered perimeter
 * letters + the top nav + interactive side arrows + the bottom flavour name,
 * gradient scrubber and label.
 */

import { ChevronUp } from 'lucide-react';
import { TopNav } from './TopNav';
import { SideArrows } from './SideArrows';
import { Scrubber } from './Scrubber';
import { FlavorName } from './FlavorName';
import { ScatterLetters } from './ScatterLetters';
import { FocusPanel } from './FocusPanel';
import { Menu } from './Menu';
import { useStore } from '../store';
import { config } from '../config';

function Chevron({ where }: { where: 'top' | 'bottom' }) {
  return (
    <div className={`chevron-tick ${where}`} aria-hidden>
      <ChevronUp size={config.hud.chevron.size * 2} strokeWidth={1.25} />
    </div>
  );
}

export function Hud() {
  const mode = useStore((s) => s.mode);

  return (
    <div
      className={`hud ${mode === 'focus' ? 'mode-focus' : ''} ${
        mode !== 'loading' ? 'revealed' : ''
      }`}
    >
      {/* Faint scattered flavour letters (behind everything else in the HUD) */}
      <ScatterLetters />

      {/* Top navigation */}
      <TopNav />

      {/* Corner registration / crop marks */}
      <div className="corner-mark tl" aria-hidden />
      <div className="corner-mark tr" aria-hidden />
      <div className="corner-mark bl" aria-hidden />
      <div className="corner-mark br" aria-hidden />

      {/* Mid-edge chevron ticks (decorative; left/right are the side arrows) */}
      <Chevron where="top" />
      <Chevron where="bottom" />

      {/* Interactive lateral navigation (persists in focus mode) */}
      <SideArrows />

      {/* Focus-mode overlay: title + description + benefit icons */}
      <FocusPanel />

      {/* Bottom: flavour name + gradient scrubber + label */}
      <FlavorName />
      <div className="bottom-bar">
        <Scrubber />
        <div className="scrubber-label">{config.scrubber.label}</div>
      </div>

      {/* Full-screen menu overlay */}
      <Menu />
    </div>
  );
}
