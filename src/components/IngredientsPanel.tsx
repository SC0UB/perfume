import { X } from 'lucide-react';
import { flavors } from '../data/flavors';
import { useStore } from '../state/store';

/**
 * Minimal ingredients panel (STUB). Opened by the leaf button in the action
 * bar. Real per-flavour ingredient content is out of scope for now — this is a
 * generic placeholder list.
 */
export default function IngredientsPanel() {
  const open = useStore((s) => s.ingredientsOpen);
  const setOpen = useStore((s) => s.setIngredientsOpen);
  const flavor = flavors[useStore((s) => s.activeIndex)];

  return (
    <aside className={`ingredients-panel ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="ingredients-head">
        <h3>Ingrédients</h3>
        <button type="button" className="icon-btn" aria-label="Fermer" onClick={() => setOpen(false)}>
          <X size={18} />
        </button>
      </div>
      <p className="ingredients-flavor">Ciao Kombucha — {flavor.name}</p>
      <ul>
        <li>Kombucha non pasteurisé (thé vert fermenté)</li>
        <li>Eau pétillante</li>
        <li>Arôme naturel {flavor.name.toLowerCase()}</li>
        <li>Culture vivante (SCOBY)</li>
      </ul>
      <p className="ingredients-note">Contenu indicatif — à compléter au rebrand.</p>
    </aside>
  );
}
