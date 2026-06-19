import { ArrowUpRight, CookingPot, Home, Leaf } from 'lucide-react';
import { useStore } from '../../state/store';
import { asset } from '../../asset';

/**
 * Bottom action bar. Centre "VOIR LA FABRICATION" pill is constant; the left
 * slot is an external-link stub in the lineup and a home button in detail; the
 * leaf "voir les ingrédients" toggle appears only in detail.
 */
export default function ActionBar() {
  const view = useStore((s) => s.view);
  const backToLineup = useStore((s) => s.backToLineup);
  const setIngredientsOpen = useStore((s) => s.setIngredientsOpen);
  const ingredientsOpen = useStore((s) => s.ingredientsOpen);
  const isDetail = view === 'detail';

  return (
    <div className="action-bar">
      <div className="action-left">
        {isDetail ? (
          <button type="button" className="icon-btn round" aria-label="Retour à la gamme" onClick={backToLineup}>
            <Home size={18} strokeWidth={1.7} />
          </button>
        ) : (
          <a
            className="icon-btn round"
            href={`${asset('fabrication')}`}
            aria-label="En savoir plus"
            title="Bientôt"
            onClick={(e) => e.preventDefault()}
          >
            <ArrowUpRight size={18} strokeWidth={1.7} />
          </a>
        )}
      </div>

      <a className="pill fabrication-pill" href="#fabrication" onClick={(e) => e.preventDefault()}>
        <CookingPot size={17} strokeWidth={1.7} />
        Voir la fabrication
      </a>

      {isDetail && (
        <div className="action-right">
          <button
            type="button"
            className={`icon-btn round ${ingredientsOpen ? 'is-on' : ''}`}
            aria-label="Voir les ingrédients"
            aria-pressed={ingredientsOpen}
            onClick={() => setIngredientsOpen(!ingredientsOpen)}
          >
            <Leaf size={18} strokeWidth={1.7} />
          </button>
        </div>
      )}
    </div>
  );
}
