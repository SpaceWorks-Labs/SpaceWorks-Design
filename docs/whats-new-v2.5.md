# What's new in v2.5

Design System **v2.5.0**, released 14 November 2026 (owner decisions 551 to 557). This release is about where the
design system lives and how it states its rules: one uniform rule set, hosted on its own address, with a landing page
that looks like the SpaceWorks landing page and says only design-system things.

## Changed

- **Hosted at `system.<domain>`.** The design-system site is served at its own address with its own landing page. The
  base path is configuration: set `DESIGN_SITE_BASE` (use `/` at the root) and `DESIGN_SITE_URL` (the origin). The
  GitHub Pages deploy keeps working with the defaults until the new address exists. Product docs keep their own
  design, built from this system's tokens, at `docs.<domain>`.
- **A new landing page.** The look follows the SpaceWorks landing page: the hero, the section rhythm, the quiet symbol
  pattern, the Deep Ink island, reveal on scroll, and the box-open logo on hover. The content is the design system:
  what it is, foundations, components and patterns, brand and logo, the uniform rules, using it in a product,
  downloads and releases. The old home page is now [Overview](overview.mdx).
- **Uniform rules only.** The product rules are stated once and apply to every product and repository. The
  per-repository setup sections, the "where each product stands" matrix, the "bring each product up to the rules"
  work order and the per-product entry-point and role tables are gone, from the rules and from the delivery page.
- **Roles are named generically.** The rules say "a role such as Superadmin, and others" and no longer define each
  role; each product defines its own roles.
- **Credit is to SpaceWorks Labs.** Personal names, handles and local paths were removed from the site, the docs and
  the editable sources. Git history is unchanged.

## Added

- **Rule 12.4: releases are version-based.** Every release has a semantic version and a changelog entry.
- **Rule 12.5: mobile apps have no landing page.** A native app opens to sign-in, or to the member home.
- **Rule 8.3: one analytics rule.** Mixpanel may be used by the product web app, the landing page, the docs and this
  site only when an operator sets a project token, only after the consent banner allows analytics, with the Content
  Security Policy widened only for the configured Mixpanel host, and never sending personal data. This site ships
  with no analytics loader, so the rule is satisfied by default.

## Fixed

- **Theme toggle colours.** The toggle's boundary was a hairline at about 1.4:1 against the page in both themes, it
  looked identical when pressed and when not, and it had no focus ring of its own. It now uses the control-outline
  token for its boundary, the accent pair for the pressed state, a hover token and the focus token. Tokens only, in
  light and dark.

## Version

`VERSION` reads `2.5.0`. See [Releases](releases/README.md), [Versioning and support](releases/versioning.md) and
[Current rules](current-rules.md).
