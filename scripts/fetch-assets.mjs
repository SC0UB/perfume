/**
 * fetch-assets.mjs — pulls the TEMPORARY placeholder brand assets used by the
 * Ciao Kombucha home recreation into /public/assets.
 *
 * These are stand-ins fetched from the live site so the experience can be
 * calibrated against the real thing; they are slated for replacement at the
 * rebrand (see README "Asset provenance"). The environment art (sky + grass)
 * is intentionally NOT fetched here — you supply your own in /public/assets/env.
 *
 * Usage:
 *   node scripts/fetch-assets.mjs           # fetch anything missing
 *   node scripts/fetch-assets.mjs --force   # re-download everything
 *
 * Node 18+ (uses global fetch). No dependencies.
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUB = resolve(ROOT, 'public/assets');
const FORCE = process.argv.includes('--force');

const CDN = 'https://cdn.prod.website-files.com/696df8a538023aca809d5128';

/** slug -> transparent bottle .avif on the brand CDN. */
const BOTTLES = {
  citron: `${CDN}/696df8a538023aca809d5272_ciao_citron.avif`,
  peche: `${CDN}/696df8a538023aca809d524a_ciao_peche.avif`,
  dragon: `${CDN}/696df8a538023aca809d5202_ciao_dragon.avif`,
  pasteque: `${CDN}/69ab120675ad0e2770f46c65_Ciao_pasteque.avif`,
  'mangue-passion': `${CDN}/69ab120e6b3debf8c2e2e659_Ciao_mangue.avif`,
  'fruits-rouges': `${CDN}/696df8a538023aca809d5222_ciao_fruits-rouges.avif`,
  gingembre: `${CDN}/696df8a538023aca809d5271_ciao_gingembre.avif`,
  menthe: `${CDN}/696df8a538023aca809d5270_ciao_menthe.avif`,
};

const GOBO =
  'https://s3.amazonaws.com/webflow-prod-assets/696df8a538023aca809d511e/696df8a538023aca809d51c7_ciao_gobo.mp4';

const HOME = 'https://www.ciaokombucha.com/';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function save(url, outPath, { text = false } = {}) {
  const rel = outPath.replace(ROOT + '/', '');
  if (!FORCE && (await exists(outPath))) {
    console.log(`  skip   ${rel} (exists)`);
    return;
  }
  process.stdout.write(`  fetch  ${rel} … `);
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  await mkdir(dirname(outPath), { recursive: true });
  if (text) {
    await writeFile(outPath, await res.text(), 'utf8');
  } else {
    await writeFile(outPath, Buffer.from(await res.arrayBuffer()));
  }
  console.log('done');
}

/** Pull the two inline wordmark <svg>s out of the live homepage markup. */
async function extractLogos() {
  const loaderOut = resolve(PUB, 'logo/ciao-loader.svg');
  const navOut = resolve(PUB, 'logo/ciao-wordmark.svg');
  if (!FORCE && (await exists(loaderOut)) && (await exists(navOut))) {
    console.log('  skip   logo/*.svg (exist)');
    return;
  }
  process.stdout.write('  fetch  logo/*.svg (from homepage) … ');
  const html = await (await fetch(HOME, { headers: { 'user-agent': UA } })).text();
  const svgs = html.match(/<svg[\s\S]*?<\/svg>/g) || [];
  const aspect = (s) => {
    const m = s.match(/viewBox="([^"]+)"/);
    if (!m) return 0;
    const [, , w, h] = m[1].split(/\s+/).map(Number);
    return h ? w / h : 0;
  };
  const loader = svgs.find((s) => s.includes('loader-logo'));
  // The detailed navbar wordmark: wide aspect, many letter paths, not the loader one.
  const nav = svgs
    .filter((s) => !s.includes('loader-logo') && aspect(s) > 2 && (s.match(/<path/g) || []).length >= 5)
    .sort((a, b) => b.length - a.length)[0];
  await mkdir(dirname(loaderOut), { recursive: true });
  if (loader) await writeFile(loaderOut, loader, 'utf8');
  if (nav) await writeFile(navOut, nav, 'utf8');
  console.log(loader && nav ? 'done' : 'partial (check markup)');
}

async function main() {
  console.log(`Fetching placeholder assets into ${PUB}${FORCE ? ' (--force)' : ''}`);

  console.log('Bottles:');
  for (const [slug, url] of Object.entries(BOTTLES)) {
    await save(url, resolve(PUB, `bottles/${slug}.avif`), { text: false });
  }

  console.log('Gobo light overlay:');
  await save(GOBO, resolve(PUB, 'video/gobo.mp4'));

  console.log('Wordmark logos:');
  await extractLogos();

  console.log('\nDone. Note: /public/assets/env (sky + grass) is yours to supply.');
}

main().catch((err) => {
  console.error('\nfetch-assets failed:', err.message);
  process.exit(1);
});
