/**
 * The six placeholder flavours.
 *
 * Descriptions are original placeholder sensory lines — NOT lifted from any
 * real brand. `labelTexture` is left empty so the procedural CanvasTexture
 * generator (three/makeLabelTexture.ts) is used; drop in a real image path to
 * swap in finished art.
 */

export type Flavor = {
  id: string;
  name: string; // "Double Litchi"
  title: string; // "DOUBLE LITCHI"
  description: string; // 1-2 sentence sensory line (placeholder)
  themeColor: string; // hex — ambient glow, scrubber, accents
  labelTexture: string; // path to wraparound label image ('' => procedural)
};

export const flavors: Flavor[] = [
  {
    id: 'double-litchi',
    name: 'Double Litchi',
    title: 'DOUBLE LITCHI',
    description:
      'A double hit of ripe litchi, floral on the nose and juicy on the finish, chilled to a clean snap.',
    themeColor: '#6C5CE0',
    labelTexture: '',
  },
  {
    id: 'coco-citron-vert',
    name: 'Coco Citron Vert',
    title: 'COCO CITRON VERT',
    description:
      'Creamy young coconut cut with a sharp twist of lime — sweet, tart and unmistakably tropical.',
    themeColor: '#A8D85B',
    labelTexture: '',
  },
  {
    id: 'kiwi-concombre',
    name: 'Kiwi Concombre',
    title: 'KIWI CONCOMBRE',
    description:
      'Garden-fresh cucumber meets tangy green kiwi for a crisp, almost herbal kind of cool.',
    themeColor: '#4FB477',
    labelTexture: '',
  },
  {
    id: 'peche-blanche',
    name: 'Pêche Blanche',
    title: 'PÊCHE BLANCHE',
    description:
      'Delicate white peach, soft and nectar-sweet, with a sun-warmed orchard aroma.',
    themeColor: '#C0432E',
    labelTexture: '',
  },
  {
    id: 'pomme-rhubarbe',
    name: 'Pomme Rhubarbe',
    title: 'POMME RHUBARBE',
    description:
      'Bright green apple braided with tart rhubarb — punchy, mouth-watering and a little wild.',
    themeColor: '#D85B7A',
    labelTexture: '',
  },
  {
    id: 'abricot-framboise',
    name: 'Abricot Framboise',
    title: 'ABRICOT FRAMBOISE',
    description:
      'Velvety apricot folded into bold raspberry, ripe and rounded with a tangy berry edge.',
    themeColor: '#E08A4F',
    labelTexture: '',
  },
];

/** The placeholder brand wordmark. TODO: replace with a bespoke SVG logo. */
export const BRAND = 'VOLTÉ';
