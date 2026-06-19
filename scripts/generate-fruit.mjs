/**
 * generate-fruit.mjs — writes simple, stylised transparent fruit cutouts (SVG)
 * into /public/assets/fruit. These are DECORATIVE placeholders that drift around
 * the bottle on the detail view; the experience degrades gracefully if any are
 * missing. Swap them for richer art at the rebrand. Run: node scripts/generate-fruit.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../public/assets/fruit');

const wrap = (inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">${inner}</svg>`;

const leaf = (x, y, r, fill = '#3FA66A') =>
  `<path transform="translate(${x} ${y}) rotate(${r})" d="M0 0 C12 -8 26 -6 30 6 C18 4 6 6 0 0Z" fill="${fill}"/>`;
const shine = (cx, cy, rx, ry) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#ffffff" opacity="0.35"/>`;

/** slug -> svg markup */
const FRUIT = {
  lemon: wrap(
    `<ellipse cx="50" cy="54" rx="34" ry="27" fill="#F4C20D"/>` +
      `<ellipse cx="50" cy="54" rx="34" ry="27" fill="#FFE680" opacity="0.35"/>` +
      `<path d="M82 50 q10 2 12 -4 q-8 -2 -12 4Z" fill="#F4C20D"/>` +
      leaf(60, 26, -20) +
      shine(38, 44, 9, 5),
  ),
  peach: wrap(
    `<circle cx="50" cy="56" r="32" fill="#EE8B3C"/>` +
      `<path d="M50 24 q-4 18 0 64" stroke="#D9702A" stroke-width="3" opacity="0.5"/>` +
      `<circle cx="50" cy="56" r="32" fill="#FFB36B" opacity="0.3"/>` +
      leaf(52, 22, -8, '#5BBE7C') +
      shine(38, 44, 10, 6),
  ),
  dragonfruit: wrap(
    `<ellipse cx="50" cy="54" rx="30" ry="34" fill="#C8479A"/>` +
      `<path d="M30 38 l-10 -10 M70 38 l10 -10 M24 60 l-12 -2 M76 60 l12 -2 M40 84 l-6 10 M60 84 l6 10" stroke="#7CC36A" stroke-width="6" stroke-linecap="round"/>` +
      `<ellipse cx="50" cy="54" rx="20" ry="24" fill="#F1A6D4" opacity="0.45"/>` +
      shine(42, 40, 7, 11),
  ),
  watermelon: wrap(
    `<path d="M16 32 A40 40 0 0 0 84 32 Z" fill="#2E8B57"/>` +
      `<path d="M22 34 A33 33 0 0 0 78 34 Z" fill="#EAF7EE"/>` +
      `<path d="M27 36 A27 27 0 0 0 73 36 Z" fill="#E5466B"/>` +
      `<g fill="#2A0E14"><circle cx="42" cy="46" r="2.4"/><circle cx="54" cy="50" r="2.4"/><circle cx="62" cy="44" r="2.4"/><circle cx="48" cy="58" r="2.4"/></g>`,
  ),
  mango: wrap(
    `<path d="M30 30 C58 14 86 30 80 56 C74 82 40 88 26 68 C14 50 16 38 30 30Z" fill="#EF7D2E"/>` +
      `<path d="M34 34 C56 22 76 34 72 54 C56 44 44 46 34 60 C26 48 26 40 34 34Z" fill="#FFC24D" opacity="0.6"/>` +
      leaf(58, 22, -16, '#4FB477'),
  ),
  'passion-fruit': wrap(
    `<circle cx="50" cy="54" r="30" fill="#6E55B0"/>` +
      `<circle cx="50" cy="54" r="30" fill="#3A2A66" opacity="0.4"/>` +
      `<circle cx="50" cy="54" r="20" fill="#F2C94C"/>` +
      `<g fill="#5B3A1E"><circle cx="46" cy="50" r="2"/><circle cx="55" cy="52" r="2"/><circle cx="50" cy="60" r="2"/><circle cx="44" cy="58" r="2"/></g>`,
  ),
  raspberry: wrap(
    `<g fill="#9E2A63">` +
      [
        [44, 40],
        [56, 40],
        [38, 52],
        [50, 52],
        [62, 52],
        [44, 64],
        [56, 64],
        [50, 74],
      ]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8"/>`)
        .join('') +
      `</g>` +
      leaf(50, 28, -90, '#3FA66A'),
  ),
  blueberry: wrap(
    `<circle cx="50" cy="56" r="30" fill="#3A4FA0"/>` +
      `<circle cx="50" cy="56" r="30" fill="#6E84D8" opacity="0.3"/>` +
      `<path d="M50 36 l5 6 l-5 5 l-5 -5 Z" fill="#243168"/>` +
      `<path d="M44 38 l6 0 M50 32 l0 6 M56 38 l-6 0" stroke="#243168" stroke-width="2.5"/>` +
      shine(40, 46, 7, 4),
  ),
  hibiscus: wrap(
    `<g fill="#C0392B">` +
      [0, 72, 144, 216, 288]
        .map(
          (a) =>
            `<ellipse cx="50" cy="32" rx="13" ry="20" transform="rotate(${a} 50 54)"/>`,
        )
        .join('') +
      `</g>` +
      `<circle cx="50" cy="54" r="9" fill="#F2A98F"/>` +
      `<line x1="50" y1="54" x2="50" y2="30" stroke="#9E2A1F" stroke-width="2.5"/>`,
  ),
  ginger: wrap(
    `<path d="M28 56 C20 40 40 30 50 42 C58 30 80 36 76 54 C88 58 84 78 68 74 C66 88 44 86 44 72 C28 78 20 64 28 56Z" fill="#E6C79A"/>` +
      `<path d="M40 48 q8 6 4 16 M62 46 q6 8 0 18" stroke="#C9A06A" stroke-width="3" opacity="0.6"/>`,
  ),
  mint: wrap(
    `<path d="M50 84 C50 60 34 40 30 22 C50 26 64 44 56 70Z" fill="#3FA66A"/>` +
      `<path d="M50 84 C50 60 66 40 70 22 C50 26 36 44 44 70Z" fill="#57C285"/>` +
      `<path d="M50 84 L50 30 M50 50 L38 40 M50 50 L62 40 M50 64 L40 56 M50 64 L60 56" stroke="#2C7A4D" stroke-width="2"/>`,
  ),
};

async function main() {
  await mkdir(OUT, { recursive: true });
  for (const [slug, svg] of Object.entries(FRUIT)) {
    await writeFile(resolve(OUT, `${slug}.svg`), svg, 'utf8');
    console.log(`  wrote fruit/${slug}.svg`);
  }
  console.log(`\n${Object.keys(FRUIT).length} fruit cutouts written to ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
