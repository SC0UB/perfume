/**
 * TopNav — left: "ON" + audio toggle · centre: [BRAND] wordmark · right: MENU +
 * CONTACT pill. The audio toggle and menu only flip state in Phase 1; their
 * behaviour is wired up in later phases.
 */

import { AudioLines } from 'lucide-react';
import { useStore } from '../store';
import { BRAND } from '../data/flavors';
import { config } from '../config';

export function TopNav() {
  const audioOn = useStore((s) => s.audioOn);
  const toggleAudio = useStore((s) => s.toggleAudio);
  const setMenuOpen = useStore((s) => s.setMenuOpen);

  return (
    <nav className="top-nav" aria-label="Primary">
      {/* Left: ON + audio toggle */}
      <div className="nav-cluster left">
        <button
          className="audio-toggle"
          onClick={toggleAudio}
          aria-pressed={audioOn}
          aria-label={audioOn ? 'Mute ambient audio' : 'Enable ambient audio'}
        >
          <span className="nav-label">{audioOn ? 'ON' : 'OFF'}</span>
          <AudioLines
            size={16}
            strokeWidth={1.5}
            style={{ opacity: audioOn ? 1 : 0.5 }}
          />
        </button>
      </div>

      {/* Centre: wordmark. TODO: replace with a bespoke SVG logo. */}
      <div
        className="wordmark"
        style={{ transform: `skewX(${config.type.wordmarkSkewDeg}deg)` }}
      >
        {BRAND}
      </div>

      {/* Right: MENU + CONTACT */}
      <div className="nav-cluster right">
        <button className="menu-btn" onClick={() => setMenuOpen(true)}>
          Menu
        </button>
        <a className="contact-pill" href="mailto:hello@example.com">
          Contact
        </a>
      </div>
    </nav>
  );
}
