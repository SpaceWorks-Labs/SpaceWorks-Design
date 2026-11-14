// The one place the site's base path is decided. GitHub Pages serves the site under /SpaceWorks-Design-System; the
// intended host, system.<domain>, serves it at the root. Set DESIGN_SITE_BASE ("/" for the root) and DESIGN_SITE_URL
// (the origin, for the sitemap and canonical links) to move it; the default keeps the GitHub Pages deploy working.
// `base` has no trailing slash, and is '' at the root, so `${base}/kit/...` is always a valid path.
const raw = (process.env.DESIGN_SITE_BASE ?? '/SpaceWorks-Design-System').trim();
export const base = ('/' + raw.replace(/^\/+|\/+$/g, '')).replace(/^\/$/, '');
// What Astro's `base` option takes.
export const astroBase = base || '/';
