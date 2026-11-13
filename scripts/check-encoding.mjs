// Guard against characters lost in an encoding round-trip (DS-QA, v2.1.1). In v2.1.0 a batch of docs was written
// through a non-UTF-8 path and every em dash, en dash, multiplication sign, middle dot and curly quote became "?":
// "SW-412 ? Orange", "64?352 ms", "base ? .75", "?unmodified copies?". This scans every tracked prose file
// (Markdown, MDX, HTML, Astro, text) outside code and fails on a "?" that cannot be a question mark:
//   " ? " between words (not a ternary followed by a quote), "a?b" between letters/digits, and "?word" after a space.
// It also fails on the UTF-8-read-as-Latin-1 forms ("â€”", "Ã©"). Run: node scripts/check-encoding.mjs
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
const ROOT = resolve(import.meta.dirname, '..');
const files = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { cwd: ROOT, encoding: 'utf8' })
  .split('\0').filter(f => /\.(md|mdx|html|astro|txt)$/.test(f) && !/(^|\/)(node_modules|dist)\//.test(f));
const bad = [];
for (const file of files) {
  let fence = false, script = false, front = false;
  readFileSync(join(ROOT, file), 'utf8').split('\n').forEach((line, i) => {
    // Frontmatter: skipped in .astro (it is code); scanned in Markdown (titles and descriptions are prose).
    if (i === 0 && line.trim() === '---') { front = true; if (file.endsWith('.astro')) return; }
    else if (front && line.trim() === '---') { front = false; return; }
    if (front && file.endsWith('.astro')) return;
    if (/^\s*(```|~~~)/.test(line)) { fence = !fence; return; }
    if (/<(script|style)\b/.test(line)) script = true;
    if (script) { if (/<\/(script|style)>/.test(line)) script = false; return; }
    if (fence) return;
    const text = line.replace(/`[^`]*`/g, '').replace(/https?:\/\/\S+/g, '').replace(/\{[^}]*\}/g, 'X').replace(/&#123;.*?&#125;/g, 'X');
    const hit = text.match(/[^\s(]\s\?\s(?!['"])|[A-Za-z0-9]\?[A-Za-z0-9]|(^|\s)\?[A-Za-z]|â€|Ã[\x80-\xBF©¨]/);
    if (hit) bad.push(`${file}:${i + 1}: ${text.slice(Math.max(0, hit.index - 30), hit.index + 40).trim()}`);
  });
}
console.log(`check-encoding: ${files.length} prose files, ${bad.length} lost characters`);
bad.slice(0, 40).forEach(b => console.log('  ' + b));
process.exit(bad.length ? 1 : 0);
