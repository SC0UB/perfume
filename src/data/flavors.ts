import { asset } from '../asset';

/**
 * The 8 Ciao Kombucha flavours, in display order (Citron … Menthe).
 *
 * NOTE ON CONTENT: `name`, `label`, `description` and the bottle art are
 * TEMPORARY placeholders captured from the live site so the experience can be
 * calibrated against the real thing. They are the single source of truth and
 * are slated for wholesale replacement at the rebrand (see README "Asset
 * provenance"). `description` is the French body copy lifted verbatim from each
 * live detail view — do not hand-write marketing prose here.
 *
 * Colours seed the per-flavour theme (background morph, accents, kinetic text);
 * tune against the bottle art. They are mirrored into CSS custom properties at
 * runtime by the theming layer.
 */
export type FlavorColor = {
  /** Stage background when this flavour is active. */
  bg: string;
  /** Kinetic text / highlight tint. */
  accent: string;
  /** Readable foreground over `bg`. */
  text: string;
};

export type Flavor = {
  id: string;
  /** Display name, mixed case. */
  name: string;
  /** Uppercase label shown above the bottle and as the kinetic word. */
  label: string;
  slug: string;
  color: FlavorColor;
  /** Transparent bottle render. */
  bottleSrc: string;
  /** Decorative fruit cutouts that drift around the bottle on the detail view. */
  fruitSrc: string[];
  /** French placeholder body copy (verbatim from the live detail view). */
  description: string;
};

const bottle = (slug: string) => asset(`assets/bottles/${slug}.avif`);
const fruit = (slug: string) => asset(`assets/fruit/${slug}.svg`);

export const flavors: Flavor[] = [
  {
    id: 'citron',
    name: 'Citron',
    label: 'CITRON',
    slug: 'citron',
    color: { bg: '#6FB4E0', accent: '#F4C20D', text: '#0E2A3A' },
    bottleSrc: bottle('citron'),
    fruitSrc: [fruit('lemon')],
    description:
      'Le Ciao Kombucha saveur citron réveille les papilles avec une acidité subtile et une pointe de fraîcheur tonique. Faible en sucre, mais riche en caractère, il est le compagnon idéal des amateurs de saveurs acidulées.',
  },
  {
    id: 'peche',
    name: 'Pêche',
    label: 'PÊCHE',
    slug: 'peche',
    color: { bg: '#EE8B3C', accent: '#FFD9B0', text: '#3A1E08' },
    bottleSrc: bottle('peche'),
    fruitSrc: [fruit('peach')],
    description:
      'Un moment de douceur pour vos papilles ! Le Ciao Kombucha saveur pêche offre une rondeur fruitée et délicate. Il représente une délicieuse alternative aux amateurs de thés glacés. Le sucre présent dans la pêche, presque entièrement consommé pendant la fermentation, donne vie à une boisson légère et peu calorique.',
  },
  {
    id: 'dragon',
    name: 'Dragon',
    label: 'DRAGON',
    slug: 'dragon',
    color: { bg: '#C8479A', accent: '#F1A6D4', text: '#37102A' },
    bottleSrc: bottle('dragon'),
    fruitSrc: [fruit('dragonfruit')],
    description:
      'Le Ciao Kombucha saveur Dragon allie la douceur exotique du fruit du dragon à la fraîcheur légère du thé fermenté. Une boisson peu sucrée, naturellement pétillante, pour une pause tropicale extrêmement rafraîchissante.',
  },
  {
    id: 'pasteque',
    name: 'Pastèque',
    label: 'PASTÈQUE',
    slug: 'pasteque',
    color: { bg: '#2E8B57', accent: '#9FE0B0', text: '#0C2E1B' },
    bottleSrc: bottle('pasteque'),
    fruitSrc: [fruit('watermelon')],
    description:
      'Un instant d’exotisme ! Le Ciao Kombucha saveur pastèque offre une sensation désaltérante et subtilement sucrée. C’est une recette qu’affectionneront les vrais amateurs de kombuchas ! Le sucre présent dans la pastèque, presque entièrement consommé pendant la fermentation, donne vie à une boisson légère et peu calorique.',
  },
  {
    id: 'mangue-passion',
    name: 'Mangue Passion',
    label: 'MANGUE PASSION',
    slug: 'mangue-passion',
    color: { bg: '#6E55B0', accent: '#C9B8EC', text: '#1C1240' },
    bottleSrc: bottle('mangue-passion'),
    fruitSrc: [fruit('mango'), fruit('passion-fruit')],
    description:
      'La fraicheur, version naturelle. Le Ciao Kombucha saveur mangue passion offre une alliance exotique et ensoleillée, à la fois douce, mais intensément parfumée. Il représente une délicieuse alternative aux amateurs de sodas fruités. Le sucre présent dans la mangue, presque entièrement consommé pendant la fermentation, donne vie à une boisson légère et peu calorique.',
  },
  {
    id: 'fruits-rouges',
    name: 'Fruits rouges',
    label: 'FRUITS ROUGES',
    slug: 'fruits-rouges',
    color: { bg: '#9E2A63', accent: '#E07FA8', text: '#330F22' },
    bottleSrc: bottle('fruits-rouges'),
    fruitSrc: [fruit('raspberry'), fruit('blueberry'), fruit('hibiscus')],
    description:
      'Véritable invitation à la fraîcheur, cette recette marie un kombucha non pasteurisé à la douceur naturelle de la framboise et de la myrtille, rehaussée par une infusion d’hibiscus. Le sucre présent dans les fruits, presque entièrement consommé pendant la fermentation, donne vie à une boisson légère et peu calorique.',
  },
  {
    id: 'gingembre',
    name: 'Gingembre Hibiscus',
    label: 'GINGEMBRE HIBISCUS',
    slug: 'gingembre',
    color: { bg: '#C0392B', accent: '#F2A98F', text: '#3A0E08' },
    bottleSrc: bottle('gingembre'),
    fruitSrc: [fruit('ginger'), fruit('hibiscus')],
    description:
      'Notre Ciao saveur Gingembre Hibiscus offre une rencontre explosive entre l’éclat floral de l’hibiscus et l’énergie acidulée du gingembre. Un kombucha au tempérament affirmé, pensé pour ceux qui apprécient la complexité et la vraie richesse d’un kombucha traditionnel.',
  },
  {
    id: 'menthe',
    name: 'Menthe',
    label: 'MENTHE',
    slug: 'menthe',
    color: { bg: '#3FA66A', accent: '#A8E8C2', text: '#0C2E1B' },
    bottleSrc: bottle('menthe'),
    fruitSrc: [fruit('mint')],
    description:
      'Le Ciao le plus frais de la gamme ! Une infusion vivifiante qui rafraîchit dès la première gorgée. Notre Kombucha saveur menthe est léger et naturellement pétillant. Il rappelle les mélanges de saveurs sucrées et acidulées du mojito.',
  },
];

/**
 * Which bottle sits forward in the lineup (a "new flavour" pose). Pastèque on
 * the live site. Configurable — set to -1 to disable.
 */
export const FEATURED_INDEX = 3;

export const flavorCount = flavors.length;
