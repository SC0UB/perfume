import { flavors } from '../data/flavors';
import { useStore } from '../state/store';

/** Segmented position indicator among the 8 flavours (detail view). */
export default function CarouselIndicator() {
  const view = useStore((s) => s.view);
  const activeIndex = useStore((s) => s.activeIndex);
  const goToFlavor = useStore((s) => s.goToFlavor);
  if (view !== 'detail') return null;
  return (
    <div className="carousel-indicator" role="tablist" aria-label="Saveurs">
      {flavors.map((f, i) => (
        <button
          key={f.id}
          type="button"
          role="tab"
          aria-selected={i === activeIndex}
          aria-label={f.name}
          className={`segment ${i === activeIndex ? 'is-active' : ''}`}
          onClick={() => goToFlavor(i)}
        >
          <span />
        </button>
      ))}
    </div>
  );
}
