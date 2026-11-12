// Copies the design kit from the repository root into the site before every dev or build run,
// so the site always shows the real masters and never a hand-maintained copy of them.
//
//   logo/ icons/ fonts/ tokens/ mascot/ brand/  ->  public/kit/...  (served for preview and download)
//   screenshots/ references/yuyu/       ->  public/kit/...      (UX screenshots and reference boards)
//   logo/*.svg                          ->  src/assets/kit/     (header logo and hero art)
//   docs/*.md, motion/*/README.md       ->  src/content/docs/...  (rendered pages; see sync-extra.mjs and sync-split.mjs)
//
// Every destination is generated and git-ignored. Edit the sources at the repository root.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncExtra } from './sync-extra.mjs';

const site = join(dirname(fileURLToPath(import.meta.url)), '..');
const root = join(site, '..');
const kit = join(site, 'public', 'kit');
const assets = join(site, 'src', 'assets', 'kit');
const specs = join(site, 'src', 'content', 'docs', 'specs');

for (const dir of [kit, assets, specs]) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}

for (const folder of ['logo', 'icons', 'fonts', 'tokens', 'mascot', 'screenshots']) {
  cpSync(join(root, folder), join(kit, folder), { recursive: true });
}
cpSync(join(root, 'brand', 'space-works-brand-guidelines-v1.pdf'), join(kit, 'brand', 'space-works-brand-guidelines-v1.pdf'));
cpSync(join(root, 'brand', 'guidelines', 'png'), join(kit, 'brand', 'guidelines'), { recursive: true });
// Brand guidelines v2 (the design system v2.0 book): the PDF and its page renders, when they have been built.
for (const [from, to] of [
  [join(root, 'brand', 'space-works-brand-guidelines-v2.pdf'), join(kit, 'brand', 'space-works-brand-guidelines-v2.pdf')],
  [join(root, 'brand', 'guidelines-v2', 'png'), join(kit, 'brand', 'guidelines-v2')],
]) if (existsSync(from)) cpSync(from, to, { recursive: true });
// Reference boards get URL-safe names ("Sign in, invites & account.png" -> "sign-in-invites-account.png").
mkdirSync(join(kit, 'references', 'yuyu'), { recursive: true });
for (const file of readdirSync(join(root, 'references', 'yuyu')).filter((f) => f.endsWith('.png'))) {
  const slug = file.replace(/\.png$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  cpSync(join(root, 'references', 'yuyu', file), join(kit, 'references', 'yuyu', `${slug}.png`));
}

for (const file of readdirSync(join(root, 'logo')).filter((f) => f.endsWith('.svg'))) {
  cpSync(join(root, 'logo', file), join(assets, file));
}
cpSync(join(root, 'tokens', 'tokens.json'), join(assets, 'tokens.json'));

syncExtra({ root, site, kit, assets });

console.log('sync-kit: copied logo, icons, fonts, tokens, mascot, screenshots, brand pages and reference boards; rendered the docs');
