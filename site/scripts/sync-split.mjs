// Long repo docs -> several site pages. The Markdown source stays ONE file (GitHub readers keep a single document);
// the site gets an overview page (the doc's intro + an "On this topic" list) and one page per part.
//
// A part is a contiguous run of the source that starts at a heading (matched by the start of its text) and ends
// where the next part starts, so every line of the source lands on exactly one page and nothing can be dropped:
// the build fails if a part's start heading is not found. Headings keep their text, so their anchors keep working;
// links to an anchor that moved to another page are rewritten (in the split doc and in every generated page).
import GithubSlugger from 'github-slugger';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { presentParts, SPLITS } from './split-docs.mjs';

const plain = (s) => s.replace(/`([^`]*)`/g, '$1').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\*/g, '').replace(/<[^>]+>/g, '').trim();
const yaml = (s) => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

// Headings outside fenced code, with their line index.
function headings(lines) {
  let fence = false;
  const out = [];
  lines.forEach((line, i) => {
    if (/^\s*(```|~~~)/.test(line)) fence = !fence;
    const m = !fence && line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (m) out.push({ i, level: m[1].length, text: m[2] });
  });
  return out;
}

const shiftHeadings = (lines, by) => {
  if (!by) return lines;
  let fence = false;
  return lines.map((line) => {
    if (/^\s*(```|~~~)/.test(line)) fence = !fence;
    return !fence && /^#{2,6}\s/.test(line) ? line.slice(by) : line;
  });
};

export function syncSplits({ root, docsDir, repo, prepare }) {
  const anchors = new Map(); // "/route/#slug" -> "/new-route/#new-slug" (or "/new-route/" for a heading that became the title)
  for (const doc of SPLITS) {
    const path = join(root, doc.file);
    const raw = existsSync(path) ? readFileSync(path, 'utf8').replace(/^﻿/, '') : null;
    if (!raw) continue; // a doc another lane has not written yet; its overview simply does not exist this build
    const lines = raw.split(/\r?\n/);
    const all = headings(lines);
    const h1 = all.find((h) => h.level === 1);
    const docTitle = h1 ? plain(h1.text) : doc.title;
    const bodyStart = h1 ? h1.i + 1 : 0;

    // Locate each part's start heading, in order, after the previous one.
    // presentParts drops an optional part whose heading is not written yet, and throws for a missing required one.
    const parts = presentParts(doc, root);
    let from = bodyStart;
    const starts = parts.map((part) => {
      const h = all.find((x) => x.i >= from && x.level > 1 && plain(x.text).startsWith(part.start));
      if (!h) throw new Error(`sync-split: "${part.start}" not found in ${doc.file} (after line ${from + 1})`);
      from = h.i + 1;
      return h;
    });
    const chunks = [
      { route: `/${doc.route}/`, lines: lines.slice(bodyStart, starts[0]?.i ?? lines.length), overview: true },
      ...parts.map((part, n) => ({
        part,
        route: `/${doc.route}/${part.slug}/`,
        head: starts[n],
        lines: lines.slice(starts[n].i, starts[n + 1]?.i ?? lines.length),
      })),
    ];

    // Old anchors (one slugger over the whole doc, as the single page had) -> new page + anchor.
    const oldSlugs = new GithubSlugger();
    const oldOf = new Map(all.filter((h) => h.level > 1).map((h) => [h.i, oldSlugs.slug(plain(h.text))]));
    for (const c of chunks) {
      c.title = c.overview ? doc.title ?? docTitle : c.part.title ?? plain(c.head.text);
      c.dropFirst = !c.overview && plain(c.head.text) === c.title; // the start heading becomes the page title
      const slugs = new GithubSlugger();
      const hs = headings(c.lines);
      hs.forEach((h, k) => {
        const old = oldOf.get(h.i + (c.overview ? bodyStart : c.head.i));
        if (!old) return;
        const target = k === 0 && c.dropFirst ? c.route : `${c.route}#${slugs.slug(plain(h.text))}`;
        anchors.set(`/${doc.route}/#${old}`, target);
      });
    }

    const overviewRoute = `/${doc.route}/`;
    const outDir = join(docsDir, doc.route);
    rmSync(outDir, { recursive: true, force: true });
    mkdirSync(outDir, { recursive: true });
    const edit = `${repo}/edit/main/${doc.file}`;
    const source = `${repo}/blob/main/${doc.file}`;
    for (const c of chunks) {
      let body = c.dropFirst ? c.lines.slice(1) : c.lines;
      if (!c.overview) {
        const min = Math.min(...headings(body).map((h) => h.level), 6);
        body = shiftHeadings(body, Math.max(0, min - 2));
      }
      body = [...body];
      while (body.length && /^\s*(---)?\s*$/.test(body.at(-1))) body.pop(); // a trailing rule only separated sections
      let text = body.join('\n');
      // In-doc anchors: point at the page the anchor now lives on.
      text = text.replace(/\]\(#([^)\s]+)\)/g, (all, slug) => {
        const to = anchors.get(`${overviewRoute}#${slug}`);
        if (!to) return all;
        const [route, hash] = to.split('#');
        return route === c.route ? `](#${hash ?? '_top'})` : `](${to})`;
      });
      if (c.overview && doc.linkIndex) text = doc.linkIndex(text, anchors, overviewRoute);
      text = prepare(text, dirname(doc.file).replace(/\\/g, '/'));

      const partChunks = chunks.filter((x) => !x.overview);
      const topic = c.overview
        ? `\n## On this topic\n\n<div class="sw-topic">\n\n${partChunks.map((x) => `- [${x.title}](${x.route})${x.part.description ? ` ${x.part.description[0].toUpperCase()}${x.part.description.slice(1)}.` : ''}`).join('\n')}\n\n</div>\n`
        : '';
      const note = c.overview
        ? `:::note[Source]\nThis page is published from [\`${doc.file}\`](${source}). Edit it there.\n:::\n\n`
        : '';
      const footer = c.overview
        ? ''
        : `\n<div class="sw-part-of">\n\nPart of [${docTitle.replace(/[[\]<]/g, '')}](${overviewRoute}), published from [\`${doc.file}\`](${source}). Edit it there.\n\n</div>\n`;
      const fm = [
        '---',
        `title: ${yaml(c.title)}`,
        `description: ${yaml(c.overview ? doc.description : c.part.description ? `${c.title}: ${c.part.description}.` : `${c.title}, part of ${docTitle}.`)}`,
        `sidebar: { label: ${yaml(c.overview ? doc.overviewLabel ?? 'Overview' : c.part.label ?? c.title)} }`,
        `editUrl: ${edit}`,
        // A contents column with fewer than two entries adds nothing; the page gets the full width instead.
        ...(headings(body).filter((h) => h.level <= 3).length + (c.overview ? 1 : 0) < 2 ? ['tableOfContents: false'] : []),
        '---',
        '',
      ].join('\n');
      const file = c.overview ? join(docsDir, `${doc.route}.md`) : join(outDir, `${c.part.slug}.md`);
      writeFileSync(file, fm + (c.overview ? note + text.trim() + '\n' + topic : text.trim() + '\n' + footer));
    }
  }
  // Old deep links (".../rules/#6-money-and-payments") from outside the site: the overview page reads this map and
  // forwards the reader to the part the anchor moved to (see ThemeProvider.astro).
  const moved = Object.fromEntries([...anchors].filter(([from, to]) => !to.startsWith(from.split('#')[0] + '#')));
  const kit = join(docsDir, '..', '..', '..', 'public', 'kit');
  mkdirSync(kit, { recursive: true });
  writeFileSync(join(kit, 'moved-anchors.json'), JSON.stringify(moved));
  return anchors;
}

// Every generated page (it carries an editUrl into docs/ or motion/): links to an anchor that moved get the new page.
export function rewriteMovedAnchors(docsDir, anchors, repo) {
  const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : /\.mdx?$/.test(f) ? [join(d, f)] : []));
  const marker = `editUrl: ${repo}/edit/main/`;
  for (const file of walk(docsDir)) {
    const text = readFileSync(file, 'utf8');
    if (!text.includes(marker)) continue;
    const next = text.replace(/(\]\(|href=")(\/[^)"#\s]*\/)#([^)"\s]+)/g, (all, lead, route, slug) => {
      const to = anchors.get(`${route}#${slug}`);
      return to ? `${lead}${to}` : all;
    });
    if (next !== text) writeFileSync(file, next);
  }
}
