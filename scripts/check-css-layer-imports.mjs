// Fails when a component (.ts/.tsx/.js/.jsx) imports a CSS file that opens an @layer block.
// Such a CSS must be imported from the app's root stylesheet after Tailwind (decision 421).
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, resolve, dirname } from "node:path";

const root = resolve(import.meta.dirname, "..", "motion");
const bad = [];
const walk = (d) => {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) { if (n !== "node_modules") walk(p); continue; }
    if (!/\.(tsx?|jsx?)$/.test(n)) continue;
    for (const m of readFileSync(p, "utf8").matchAll(/^\s*import\s+["']([^"']+\.css)["']/gm)) {
      const css = resolve(dirname(p), m[1]);
      if (existsSync(css) && /@layer\b/.test(readFileSync(css, "utf8"))) bad.push(`${p} imports ${m[1]} (contains @layer)`);
    }
  }
};
walk(root);
if (bad.length) { console.error(bad.join("\n")); process.exit(1); }
console.log("No component imports a CSS file that opens an @layer.");
