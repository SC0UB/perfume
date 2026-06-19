import { Star, Menu as MenuIcon } from 'lucide-react';
import Wordmark from '../Wordmark';
import { useStore } from '../../state/store';

/** Top bar: wordmark (→ home), contact pill, favourite stub, menu toggle. */
export default function Header() {
  const backToLineup = useStore((s) => s.backToLineup);
  const toggleMenu = useStore((s) => s.toggleMenu);

  return (
    <header className="site-header">
      <button type="button" className="brand" onClick={backToLineup} aria-label="Ciao Kombucha — accueil">
        <Wordmark />
      </button>

      <div className="header-actions">
        <a className="pill contact-pill" href="mailto:contact@ciaokombucha.com">
          Contactez nous
        </a>
        <button type="button" className="icon-btn round" aria-label="Favoris" title="Favoris (bientôt)">
          <Star size={18} strokeWidth={1.6} />
        </button>
        <button type="button" className="icon-btn round" aria-label="Ouvrir le menu" onClick={toggleMenu}>
          <MenuIcon size={18} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
}
