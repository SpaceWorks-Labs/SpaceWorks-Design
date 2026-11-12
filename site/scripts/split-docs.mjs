// Which repo docs are published as several pages, and where each page starts. Read by sync-split.mjs (to write the
// pages) and by astro.config.mjs (to build the sidebar), so the two can never disagree.
//
//   route   the overview page (the doc's intro + "On this topic"); parts live at <route>/<slug>/
//   start   the start of the heading text where the part begins (searched in order, after the previous part)
//   title   page title; leave it out to use the heading itself (the heading then becomes the page title)
//   label   short sidebar label
//   optional  the part is skipped (page and sidebar entry) while its heading is not in the source, for a section
//             another lane is still writing; every other start heading must exist or the build fails
// Keep the overview routes stable: other repos and old links point at them, and moved anchors are redirected.

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const decisionsIndex = (text, anchors, route) =>
  text.replace(/^\|\s*((?:SW|DS)-\d+)\s*\|/gm, (all, num) => {
    const key = [...anchors.keys()].find((k) => k.startsWith(`${route}#${num.toLowerCase()}--`));
    return key ? `| [${num}](${anchors.get(key)}) |` : all;
  });

export const SPLITS = [
  {
    file: 'docs/product-rules.md',
    route: 'rules',
    title: 'Space Works product rules',
    description: 'The rules every Space Works product follows, from modularity and tenancy to money, accessibility and testing.',
    parts: [
      { start: '1. Stack', slug: 'stack-and-install', title: 'Stack, install and hosting', label: 'Stack, install, hosting', description: 'the shared stack, the one-line install, VPS defaults, self-host versus managed, backups and upgrades' },
      { start: '3. Areas and modules', slug: 'structure', title: 'Areas, roles and code size', label: 'Areas, roles, code size', description: 'areas and modules, role-based views, and the file-size and modularity rules' },
      { start: '6. Money and payments', slug: 'money', label: 'Money and payments', description: 'how charges, payments and the ledger are recorded' },
      { start: '7. Audit trails and logs', slug: 'audit-and-analytics', title: 'Audit trails, logs and analytics', label: 'Audit, logs, analytics', description: 'append-only audit, structured logs and privacy-respecting analytics' },
      { start: '9. API and mobile', slug: 'api-and-tenancy', title: 'API, mobile, tenancy and privacy', label: 'API, tenancy, privacy', description: 'the documented API the apps share, tenant scoping and personal data' },
      { start: '11. Language, accessibility', slug: 'accessibility', label: 'Accessibility and themes', description: 'plain language, the accessibility floor, light and dark themes, and motion' },
      { start: '12. Testing, docs and release', slug: 'testing-and-release', title: 'Testing, release, decisions and handover', label: 'Testing, release, handover', description: 'tests with every change, docs, releases, the decisions ledger and handover notes' },
      { start: '14. CI/CD pipeline', slug: 'ci-cd', label: 'CI/CD pipeline', description: 'the pipeline every repository runs, stage by stage', optional: true },
      { start: 'New-feature checklist', slug: 'checklist', label: 'New-feature checklist', description: 'the list to run before any new feature ships' },
      { start: 'Where each product stands', slug: 'where-each-product-stands', label: 'Where each product stands', description: 'a rule-by-product matrix of what follows the rules today' },
      { start: 'Bring each product up to the rules', slug: 'bring-up', label: 'Bring each product up', description: 'the work left, product by product' },
    ],
  },
  {
    file: 'docs/delivery.md',
    route: 'delivery',
    description: 'How every Space Works repository checks, versions and releases its work, per stack, and where each one stands.',
    parts: [
      { start: '2. Stack 1', slug: 'stacks', title: 'Pipelines per stack', label: 'Pipelines per stack', description: 'Django and React, Next.js and Prisma, Android, iOS and static sites' },
      { start: '7. Where each repo stands', slug: 'status', title: 'Where each repository stands', label: 'Where each repo stands', description: 'the status table, the bring-up list, the new-repository checklist and branch protection' },
    ],
  },
  {
    file: 'docs/motion.md',
    route: 'motion/principles',
    description: 'How Space Works moves: the principles, which animation to use where, the rules and the full catalogue.',
    parts: [
      { start: 'Which animation to use, where', slug: 'which-animation', label: 'Which animation, where', description: 'the decision table: the moment, the animation and the template' },
      { start: 'Rules', slug: 'rules', title: 'Motion rules and tokens', label: 'Rules and tokens', description: 'the rules every animation follows and the tokens it reads' },
      { start: 'Catalogue', slug: 'catalogue', title: 'Motion catalogue', label: 'Catalogue', description: 'every animation in the app by group, and dark theme on every page' },
    ],
  },
  {
    file: 'docs/lessons-learned.md',
    route: 'lessons-learned',
    description: 'Colour matching in light and dark, and the other design lessons behind the Space Works palette.',
    parts: [
      { start: '1. Colour in light and dark', slug: 'colour', label: 'Colour in light and dark', description: 'surfaces, borders, text, accent, focus and status colours' },
      { start: 'Charts', slug: 'colour-charts-brands-artwork', title: 'Colour: charts, tenant colours and artwork', label: 'Charts, tenants, artwork', description: 'chart series, tenant brand colours, logos and illustrations' },
      { start: '2. Typography', slug: 'type-motion-components', title: 'Typography, motion and components', label: 'Type, motion, components', description: 'the lessons outside colour' },
      { start: '5. Process', slug: 'process', title: 'Process, other apps and the five costliest lessons', label: 'Process and other apps', description: 'the process that stops drift, notes for Android, iOS and sibling apps, and the five lessons that cost the most' },
    ],
  },
  {
    file: 'docs/decisions.md',
    route: 'decisions',
    title: 'Design decisions',
    description: 'Every decision that shapes how Space Works looks, moves and is built, with the reason for each.',
    overviewLabel: 'Index',
    linkIndex: decisionsIndex,
    parts: [
      { start: 'Decisions, newest first', slug: 'recent', title: 'Decisions SW-362 and later', label: 'SW-362 and later', description: 'the design system v2.0 decisions: motion templates, theming, rules, previews, charts and the brand book' },
      { start: 'SW-323', slug: 'sw-204-to-sw-323', title: 'Decisions SW-204 to SW-323', label: 'SW-204 to SW-323', description: 'the dark theme, the loader, fonts, the landing page and the UX reviews' },
      { start: 'SW-168', slug: 'sw-12-to-sw-168', title: 'Decisions SW-12 to SW-168', label: 'SW-12 to SW-168', description: 'Patch, the README banners, delight effects and the brand-only theme' },
      { start: 'DS-9', slug: 'design-repo', title: 'Design-repository decisions (DS)', label: 'Design repo (DS)', description: 'decisions that belong only to this repository' },
      { start: 'Superseded decisions', slug: 'superseded', label: 'Superseded', description: 'the decision chains that were replaced, and what replaced them' },
      { start: 'How to record a decision', slug: 'how-to-record', label: 'How to record one', description: 'the template for a new entry' },
    ],
  },
  {
    file: 'docs/ui-brand-spec.md',
    route: 'specs/ui-brand-spec',
    description: 'How the Space Works brand becomes the SpaceWorks UI: sources, derivation rules and key decisions.',
    parts: [
      { start: 'A. Tokens', slug: 'tokens', label: 'Token values and contrast', description: 'every token with its source, and the computed contrast of each text token' },
      { start: 'A.3 Paste-ready', slug: 'index-css', label: 'Paste-ready CSS', description: 'the complete index.css token block' },
      { start: 'B. Interaction states', slug: 'interaction-states', label: 'Interaction states', description: 'hover, active, focus, disabled and selected' },
      { start: 'C. Status pills', slug: 'status-pills', label: 'Status pills', description: 'the status pill families and their tested pairs' },
      { start: 'D. Typography', slug: 'typography', label: 'Type in the product', description: 'faces and roles, self-hosted CSS, type-scale tokens and the mono decision' },
      { start: 'E. Shape', slug: 'shape-and-spacing', label: 'Shape, spacing, elevation', description: 'radii, borders, shadows, spacing and motion values' },
      { start: 'F. Logo', slug: 'logo-in-product', label: 'Logo in the product', description: 'master exports, usage and in-product sizes' },
      { start: 'G. Icons', slug: 'icons', label: 'Iconography', description: 'the icon set, sizes and rules' },
      { start: 'H. Migration lists', slug: 'migration', label: 'Migration lists', description: 'translucency bans, token renames, tenant branding and font changes' },
      { start: 'I. Contrast-guard', slug: 'enforcement', title: 'Contrast guard, fidelity checklist and open decisions', label: 'Guards and open decisions', description: 'the contrast-guard changes, the brand fidelity checklist and the owner decisions still open' },
    ],
  },
  {
    file: 'docs/ux-spec.md',
    route: 'specs/ux-patterns',
    description: 'The Space Works UX spec: patterns, layouts, navigation, every core screen and the quality bar.',
    parts: [
      { start: '1. Pattern catalogue', slug: 'patterns-shell-and-navigation', title: 'Patterns: shell, headers and navigation', label: 'Patterns P1–P10', description: 'observed scale, app shell, page and detail headers, stat cards, callouts, list rows, tabs and pills' },
      { start: 'P11.', slug: 'patterns-content-and-forms', title: 'Patterns: buttons, cards, tables and forms', label: 'Patterns P11–P21', description: 'buttons, activity rail, key–value cards, tables, settings rows, empty states and forms' },
      { start: 'P22.', slug: 'patterns-auth-public-kiosk', title: 'Patterns: auth, public pages and kiosk', label: 'Patterns P22–P30', description: 'auth split screen, centred cards, account tabs, public pages, tickets, kiosk and undo' },
      { start: '1.31', slug: 'interaction-and-microcopy', title: 'Interaction model and microcopy', label: 'Interaction and microcopy', description: 'the interaction model summary and the microcopy style' },
      { start: '1A. Reusable layouts', slug: 'layouts', label: 'Layouts L1–L4', description: 'shared slot types, AppShell, dashboard, list and detail layouts' },
      { start: 'L5.', slug: 'layouts-settings-to-kiosk', title: 'Layouts: settings, forms, flows, auth, public and kiosk', label: 'Layouts L5–L10', description: 'the remaining layouts and the pattern-to-layout map' },
      { start: '2. Staff console sidebar IA', slug: 'sidebar-ia', label: 'Sidebar navigation', description: 'navigation rules, sections, collapse rules and narrow consoles' },
      { start: '3. Screen-by-screen spec', slug: 'screens-home-and-requests', title: 'Screens: home, requests and handout', label: 'Screens S1–S4', description: 'dashboard, requests, request detail with issue and return, direct handout' },
      { start: 'S5.', slug: 'screens-inventory-members-settings', title: 'Screens: inventory, members and settings', label: 'Screens S5–S9', description: 'inventory list and item, members, staff and roles, makerspace settings' },
      { start: 'S10.', slug: 'screens-machines-events-reports', title: 'Screens: machines, events, bookings, reports and audit', label: 'Screens S10–S15', description: 'machines, events, bookings, reports and the audit log' },
      { start: 'S16.', slug: 'screens-member-and-public', title: 'Screens: member area and public pages', label: 'Screens S16–S19', description: 'member home, public catalogue, item and event pages' },
      { start: 'S20.', slug: 'screens-sign-in-kiosk-rest', title: 'Screens: sign-in, invitations, kiosk and the rest', label: 'Screens S20–S24', description: 'staff and member sign-in, invitations, kiosk and the remaining staff tabs' },
      { start: '4. UX quality bar', slug: 'quality-bar', label: 'Quality bar', description: 'the checks every screen must pass' },
      { start: '5. Where the reference boards', slug: 'adaptations', label: 'Adaptations', description: 'where the reference boards do not scale, and what we do instead' },
      { start: '6. Items that need a decision', slug: 'open-items', label: 'Open items', description: 'what still needs a decision or data' },
    ],
  },
  {
    file: 'docs/ux-screens-longtail.md',
    route: 'specs/ux-long-tail-screens',
    description: 'Every SpaceWorks screen beyond the core set, batch by batch, in the closed set of layouts.',
    parts: [
      { start: '2. Batch A', slug: 'batch-a-money-and-stock', title: 'Batch A: operational lists, money and stock', label: 'A1–A6: money and stock', description: 'payments, ledger, transfers, stocktake, to buy and to be fixed' },
      { start: 'A7.', slug: 'batch-a-everything-else', title: 'Batch A: notifications, logs, devices and catalogues', label: 'A7–A18: the rest', description: 'notifications, delivery logs, accountability, warranties, cards, devices, exports and catalogues' },
      { start: '3. Batch B', slug: 'batch-b-detail-and-editor', label: 'B: detail and editor', description: 'the email template editor and other detail pages' },
      { start: '4. Batch C', slug: 'batch-c-configuration', label: 'C: configuration', description: 'settings screens in SettingsLayout' },
      { start: '5. Batch D', slug: 'batch-d-analytics', label: 'D: analytics', description: 'read-only dashboards' },
      { start: '6. Batch E', slug: 'batch-e-f-flows-and-gates', title: 'Batches E and F: flows, gates and system cards', label: 'E and F: flows, gates', description: 'guided flows and centred system cards' },
      { start: '8. Batch G', slug: 'batch-g-public', label: 'G: public pages', description: 'public layouts and public detail pages' },
      { start: '9. Batch H', slug: 'batch-h-i-member-and-stations', title: 'Batches H and I: member area and stations', label: 'H and I: member, stations', description: 'member area tab bodies and kiosk stations' },
      { start: '11. Layout gaps', slug: 'gaps-overlays-merges', title: 'Layout gaps, overlays and merges', label: 'Gaps, overlays, merges', description: 'shared sections, overlays and global chrome, and the cross-cutting merges' },
      { start: '14. Coverage table', slug: 'coverage', label: 'Coverage table', description: 'every screen, its batch and its layout' },
      { start: '15. Appendix', slug: 'appendix-batch-a', title: 'Appendix: wireframes for batch A', label: 'Appendix: batch A', description: 'wireframes and mobile notes, batch A' },
      { start: 'Batch B', slug: 'appendix-batches-b-to-d', title: 'Appendix: wireframes for batches B to D', label: 'Appendix: B to D', description: 'wireframes and mobile notes, batches B, C and D' },
      { start: 'Batch E', slug: 'appendix-batches-e-to-i', title: 'Appendix: wireframes for batches E to I', label: 'Appendix: E to I', description: 'wireframes and mobile notes, batches E to I' },
    ],
  },
];

// The parts of a doc whose start heading is in the source now (optional parts may be missing; required ones must not).
export function presentParts(doc, root) {
  const path = join(root, doc.file);
  if (!existsSync(path)) return [];
  let fence = false;
  const heads = readFileSync(path, 'utf8').split(/\r?\n/).filter((line) => {
    if (/^\s*(```|~~~)/.test(line)) fence = !fence;
    return !fence && /^#{2,6}\s/.test(line);
  }).map((line) => line.replace(/^#+\s+/, '').replace(/`([^`]*)`/g, '$1').replace(/\*/g, '').trim());
  let from = 0;
  return doc.parts.filter((part) => {
    const at = heads.findIndex((h, i) => i >= from && h.startsWith(part.start));
    if (at < 0 && !part.optional) throw new Error(`split-docs: "${part.start}" not found in ${doc.file}`);
    if (at >= 0) from = at + 1;
    return at >= 0;
  });
}

const ROOT = fileURLToPath(new URL('../../', import.meta.url));

// Sidebar entries for one split doc: the overview, then each part (or a chosen subset, by slug).
export function splitItems(route, only) {
  const doc = SPLITS.find((d) => d.route === route);
  const present = presentParts(doc, ROOT);
  const parts = (only ? only.map((s) => doc.parts.find((p) => p.slug === s)) : doc.parts).filter((p) => present.includes(p));
  return [
    ...(only ? [] : [{ slug: doc.route, label: doc.overviewLabel ?? 'Overview' }]),
    ...parts.map((p) => ({ slug: `${doc.route}/${p.slug}`, label: p.label ?? p.title ?? p.start })),
  ];
}
