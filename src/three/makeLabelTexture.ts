/**
 * makeLabelTexture — procedural placeholder can label.
 *
 * Generates a wraparound CanvasTexture for a flavour: solid flavour colour, the
 * [BRAND] wordmark, the flavour name set vertically, "ENERGY", and the volume
 * line. Swapping in real art later is trivial — give the flavour a
 * `labelTexture` path and load it with useTexture instead of calling this.
 *
 * The texture wraps 360° around the can; the composition is centred so it faces
 * the camera once the can's base rotation is applied (see Can.tsx).
 */

import {
  CanvasTexture,
  SRGBColorSpace,
  RepeatWrapping,
  type Texture,
} from 'three';
import { BRAND } from '../data/flavors';
import type { Flavor } from '../data/flavors';

const W = 1024;
const H = 540;

/** Slightly lighten/darken a hex colour by `amt` (-1..1) for simple shading. */
function shade(hex: string, amt: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const f = (c: number) =>
    Math.max(0, Math.min(255, Math.round(c + 255 * amt)));
  return `rgb(${f(r)}, ${f(g)}, ${f(b)})`;
}

export function makeLabelTexture(flavor: Flavor): Texture {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // ── Base flavour colour with a soft vertical sheen ──
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, shade(flavor.themeColor, 0.1));
  grad.addColorStop(0.5, flavor.themeColor);
  grad.addColorStop(1, shade(flavor.themeColor, -0.12));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // ── Thin technical frame ──
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 28, W - 80, H - 56);

  const cx = W / 2;

  // ── [BRAND] wordmark (top, bold italic-ish) ──
  ctx.save();
  ctx.translate(cx, 96);
  ctx.transform(1, 0, -0.16, 1, 0, 0); // fake italic skew
  ctx.fillStyle = '#ffffff';
  ctx.font = "700 84px 'Anton', 'Arial Narrow', Impact, sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(BRAND, 0, 0);
  ctx.restore();

  // ── "ENERGY" small caps under the wordmark ──
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = "600 26px 'Inter', Arial, sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.save();
  ctx.translate(cx, 150);
  drawTracked(ctx, 'ENERGY', 14);
  ctx.restore();

  // ── Flavour name set VERTICALLY, large, on the body ──
  ctx.save();
  ctx.translate(cx, H / 2 + 40);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#ffffff';
  ctx.font = "700 96px 'Anton', 'Arial Narrow', Impact, sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // Two lines if the name has two words, stacked along the can.
  const words = flavor.title.split(' ');
  if (words.length > 1) {
    const mid = Math.ceil(words.length / 2);
    const line1 = words.slice(0, mid).join(' ');
    const line2 = words.slice(mid).join(' ');
    ctx.fillText(line1, 0, -58);
    ctx.fillText(line2, 0, 58);
  } else {
    ctx.fillText(flavor.title, 0, 0);
  }
  ctx.restore();

  // ── Volume / claim line (bottom) ──
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = "500 24px 'Inter', Arial, sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.save();
  ctx.translate(cx, H - 70);
  drawTracked(ctx, '250ML  |  ZERO BULLSHIT', 4);
  ctx.restore();

  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  // The cylinder seam (geometry u=0) sits at +Z (toward camera). Shift the
  // texture by half so the centred composition faces front and the seam hides
  // at the back.
  tex.offset.x = 0.5;
  tex.needsUpdate = true;
  return tex;
}

/** Draw centred text with manual letter-spacing (canvas lacks letterSpacing). */
function drawTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  tracking: number,
) {
  const widths = [...text].map((ch) => ctx.measureText(ch).width + tracking);
  const total = widths.reduce((a, b) => a + b, 0) - tracking;
  let x = -total / 2;
  ctx.textAlign = 'left';
  for (let i = 0; i < text.length; i++) {
    ctx.fillText(text[i], x, 0);
    x += widths[i];
  }
}

export type { CanvasTexture };
