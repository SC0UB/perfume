/**
 * Menu — a minimal full-screen overlay opened from the top-nav MENU button.
 * Placeholder anchor links. Closes on link click, the X, or Escape (handled in
 * useNavigation).
 */

import { X } from 'lucide-react';
import { useStore } from '../store';

const LINKS = [
  { label: 'Gamme', href: '#gamme' },
  { label: 'Bénéfices', href: '#benefices' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Newsletter', href: '#newsletter' },
];

export function Menu() {
  const open = useStore((s) => s.menuOpen);
  const setMenuOpen = useStore((s) => s.setMenuOpen);

  return (
    <div className={`menu-overlay ${open ? 'open' : ''}`} aria-hidden={!open}>
      <button
        className="menu-close"
        onClick={() => setMenuOpen(false)}
        aria-label="Close menu"
        data-interactive
      >
        <X size={22} strokeWidth={1.5} />
      </button>

      <nav className="menu-links">
        {LINKS.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setMenuOpen(false)}
            style={{ transitionDelay: `${0.08 * i + 0.1}s` }}
            data-interactive
          >
            {l.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
