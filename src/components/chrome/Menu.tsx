import { useEffect } from 'react';
import { X, Instagram } from 'lucide-react';
import TikTokIcon from './TikTokIcon';
import { useStore } from '../../state/store';

/** Full-screen menu overlay. Accueil returns home; the rest are stubs for now. */
const LINKS: { label: string; href: string; stub: boolean }[] = [
  { label: 'Accueil', href: '#', stub: false },
  { label: 'Fabrication', href: '#fabrication', stub: true },
  { label: 'Distributeurs', href: '#distributeurs', stub: true },
  { label: 'FAQ', href: '#faq', stub: true },
  { label: 'Contact', href: 'mailto:contact@ciaokombucha.com', stub: false },
];

export default function Menu() {
  const open = useStore((s) => s.menuOpen);
  const setMenuOpen = useStore((s) => s.setMenuOpen);
  const backToLineup = useStore((s) => s.backToLineup);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setMenuOpen]);

  return (
    <div className={`menu-overlay ${open ? 'open' : ''}`} aria-hidden={!open}>
      <button type="button" className="icon-btn round menu-close" aria-label="Fermer le menu" onClick={() => setMenuOpen(false)}>
        <X size={20} />
      </button>

      <nav className="menu-links" aria-label="Navigation principale">
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            onClick={(e) => {
              if (l.label === 'Accueil') {
                e.preventDefault();
                backToLineup();
                setMenuOpen(false);
              } else if (l.stub) {
                e.preventDefault();
                setMenuOpen(false);
              } else {
                setMenuOpen(false);
              }
            }}
          >
            {l.label}
          </a>
        ))}
      </nav>

      <div className="menu-socials">
        <a href="https://www.instagram.com/ciaokombucha" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <Instagram size={20} />
        </a>
        <a href="https://www.tiktok.com/@ciaokombucha" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
          <TikTokIcon size={20} />
        </a>
      </div>
    </div>
  );
}
