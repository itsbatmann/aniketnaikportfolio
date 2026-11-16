/**
 * Traces a picture into SVG strokes, so GSAP's DrawSVGPlugin can draw it on.
 * One <path> per ink contour, written nearest the centre first, so a plain
 * stagger draws it from the middle out; then all contours as one path, for
 * the ink to fill in behind the drawing. The result is inlined at build time
 * by components/InlineSvg.tsx.
 *
 * Used for the mandala, black ink on kraft — the dark is the drawing:
 *   node scripts/trace-mandala.mjs Assets/Mandala.jpeg public/interlude/mandala.svg
 *
 * It only works on a drawing. A photograph of a carpet was tried with every
 * crop, blur, threshold and inversion here and traced into blotches each
 * time — the footer's medallion is drawn by hand instead (Medallion.tsx).
 *
 * It is a one-off: run it again only if a picture changes.
 *   npm i --no-save potrace
 *
 * Pure JavaScript (potrace + jimp) on purpose — it needs no native build.
 */

import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const potrace = require("potrace");
const Jimp = require("jimp");

const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith("--"));
const flag = (name, fallback) => {
  const hit = args.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (!hit) return fallback;
  const [, value] = hit.split("=");
  return value === undefined ? true : value;
};

const [src, out] = positional;
if (!src || !out) {
  console.error("usage: trace-mandala.mjs <in> <out.svg> [--width=520] [--crop=x,y,w,h] [--invert] [--blur=0] [--threshold=104] [--turd=6]");
  process.exit(1);
}
const W = Number(flag("width", 520));
const crop = flag("crop", "");
const invert = Boolean(flag("invert", false));
const blur = Number(flag("blur", 0));
const threshold = Number(flag("threshold", 104));
const turdSize = Number(flag("turd", 6));

const img = await Jimp.read(src);
if (crop) {
  const [x, y, w, h] = crop.split(",").map(Number);
  img.crop(x, y, w, h);
}
img.resize(W, Jimp.AUTO).greyscale();
if (blur > 0) img.gaussian(Math.round(blur));
img.contrast(0.25);
if (invert) img.invert();
const H = img.bitmap.height;

const tracer = new potrace.Potrace({
  threshold,
  turdSize,
  alphaMax: 1,
  optTolerance: 0.8,
});
await new Promise((resolve, reject) =>
  tracer.loadImage(img, (err) => (err ? reject(err) : resolve())),
);

// potrace hands back every contour in one `d`; split it on the moves.
const d = tracer.getPathTag().match(/d="([^"]+)"/)[1];
const contours = d.match(/M[^M]+/g).map((s) => s.trim());

const first = (s) => {
  const m = s.match(/^M\s*([\d.-]+)[ ,]([\d.-]+)/);
  return { x: Number(m[1]), y: Number(m[2]) };
};
const pts = contours.map(first);
// The centre to draw out from: the middle of the ink, unless the picture is
// cut at its subject's centre on the right (the mandala), in which case the
// rightmost ink.
const xs = pts.map((p) => p.x);
const ys = pts.map((p) => p.y);
const cutRight = Boolean(flag("cut-right", !crop));
const cx = cutRight ? Math.max(...xs) : (Math.min(...xs) + Math.max(...xs)) / 2;
const cy = (Math.min(...ys) + Math.max(...ys)) / 2;

const ordered = contours
  .map((s, i) => ({ s, dist: Math.hypot(pts[i].x - cx, pts[i].y - cy) }))
  .sort((a, b) => a.dist - b.dist)
  // One decimal is plenty; the file is inlined into the page.
  .map(({ s }) => s.replace(/(\d+\.\d)\d+/g, "$1"));

// Two layers: every contour on its own, for DrawSVG to draw as an outline;
// then all of them as one path, for the ink to fill in behind the drawing.
// One path, not many, because the holes in the pattern are contours of
// their own and only read as holes when they are filled together (evenodd).
const svg = [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false">`,
  `<g class="lines" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-linecap="round">`,
  ...ordered.map((s) => `<path d="${s}"/>`),
  `</g>`,
  `<path class="ink" d="${ordered.join(" ")}"/>`,
  `</svg>`,
].join("\n");

writeFileSync(out, svg);
console.log(
  `${ordered.length} contours, ${(svg.length / 1024).toFixed(0)} KB, viewBox 0 0 ${W} ${H}`,
);
