import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const svgPath = resolve(here, 'og-image.svg');
const outPath = resolve(here, '..', '..', 'public', 'og-image.png');

if (!existsSync(svgPath)) {
  console.error(`[og] missing SVG: ${svgPath}`);
  process.exit(1);
}

const svg = readFileSync(svgPath);
const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  background: '#0d0d12',
});
const pngData = resvg.render();
const png = pngData.asPng();
writeFileSync(outPath, png);

const dim = pngData.width + 'x' + pngData.height;
console.log(`[og] wrote ${outPath} (${dim}, ${(png.length / 1024).toFixed(1)} KB)`);
