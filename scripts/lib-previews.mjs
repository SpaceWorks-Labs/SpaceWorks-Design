// Shared helpers for make-previews.mjs / check-previews.mjs.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MOTION_KIT_OUTPUTS, MOTION_KIT_SOURCES } from './motion-scenes.mjs';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const LOCK = join(ROOT, 'scripts', 'previews.lock.json');
export const SOURCES = {
  'tokens/tokens.json': 'palette',
  'motion/box-open/box-open.css': 'motion',
  'motion/box-open/box-open-markup.html': 'motion',
  'motion/theme-reveal/theme-reveal.css': 'theme-reveal',
  'motion/theme-reveal/theme-reveal.js': 'theme-reveal',
  'motion/theme-reveal/demo.html': 'theme-reveal',
  // Motion kit: every family's CSS (and demo page) behind the animated previews in motion/*/previews/.
  ...Object.fromEntries(MOTION_KIT_SOURCES.map((s) => [s, 'motion-kit'])),
};
export const OUTPUTS = [
  'tokens/previews/palette-light.png', 'tokens/previews/palette-light.svg',
  'tokens/previews/palette-dark.png', 'tokens/previews/palette-dark.svg',
  'tokens/previews/palette-light-vs-dark.png', 'tokens/previews/palette-light-vs-dark.svg',
  ...['loader-light', 'loader-dark', 'inline-row-light', 'inline-row-dark', 'button-saving-light',
    'button-saving-dark', 'logo-hover-light', 'logo-hover-dark'].flatMap((n) =>
    [`motion/box-open/previews/${n}.webp`, `motion/box-open/previews/${n}.gif`]),
  'motion/box-open/previews/logo-open-light.png', 'motion/box-open/previews/logo-open-dark.png',
  'motion/theme-reveal/previews/theme-reveal.webp', 'motion/theme-reveal/previews/theme-reveal.gif',
  ...MOTION_KIT_OUTPUTS,
];

export function hashSources() {
  const out = {};
  for (const rel of Object.keys(SOURCES)) {
    // Normalise CRLF so the hash is identical on Windows checkouts and Linux CI.
    const text = readFileSync(join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
    out[rel] = createHash('sha256').update(text).digest('hex');
  }
  return out;
}
