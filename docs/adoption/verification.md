---
title: Starter verification
description: Actual source, build and browser evidence for batch 1C with explicit limits.
---
# Starter verification

Scope: new batch-1C documentation and standalone examples, 2026-11-13. This is not a claim that the existing documentation site or product application is WCAG-conformant. The app worktree was read-only. Final publication/base-path testing belongs to batch 3/4.

## Web build and browser evidence

- React/Tailwind production build passed with Node 24.21.0, React/react-dom 19.2.7, Vite 8.1.6, Tailwind 4.3.2 and PostCSS 8.5.23. Eighteen modules transformed. Validation reused the existing reviewed frontend node_modules through SW_STARTER_MODULES; no clean network install/lockfile resolution was asserted.
- The dependency-free Node HTTP server opened both first screens and the gallery. Browser: Chrome 156.0.8078.4 via local CDP.
- 24 combinations passed: HTML first screen, gallery and React built first screen × 320/390/768/1280 CSS px × Light/Dark. No document-width overflow; one h1; fonts/logo loaded; theme class matched the choice.
- Nineteen gallery examples exercised 192 state/variant selections. These are reference compositions; source-app API availability remains separately documented.
- HTML search/clear and React controlled search passed. Dialog initial focus, Escape and opener return passed; local panel ArrowRight selection passed.
- Toast focus paused expiry beyond 8 seconds; awaited local Undo completed and returned focus to the trigger. This does not repair the read-only app toastStore.
- Axe WCAG A/AA-tag scans on the three default pages reported zero violations (24/28/24 rule passes respectively). These scans are bounded samples, not 55-criterion conformance evidence or exhaustive state/theme scans.
- Forced-colours/reduced-motion media emulation applied and actual first-screen control rectangles met the 44 px house target. Manual high-contrast perception, real browser zoom and screen-reader testing were not performed.
- Recorded successful run: 89 assertions, zero runtime exceptions and zero failed asset responses. [Machine results](../../examples/web/verification/results.json) and [390 px screenshot](../../examples/web/verification/first-screen-390.png); the screenshot was visually inspected.

Reproduce from the repository root with the server running:

```powershell
node examples/web/server.mjs
# In another terminal, point these at installed local tools:
$env:SW_STARTER_CHROME='C:/path/to/chrome.exe'
$env:SW_STARTER_AXE='C:/path/to/axe-core/axe.min.js'
node examples/web/verify-browser.mjs
```

SW_STARTER_AXE is optional; without it the script does not claim an axe scan. The script uses a fresh temporary Chromium profile and loopback pages; no product APIs are called.

## Documentation and native assets

[Documentation results](../../examples/web/verification/docs-results.json) come from node examples/web/check-docs.mjs: component template/state coverage, all 55 A/AA rows, P1–P30/L1–L10 entries, relative page/asset/fragment links and additive source-item preservation. Source hash changes caused by other batches are reported separately; retained source items must still resolve. This is a source check, not the site's rendered-link/base-path acceptance.

python examples/web/export-native.py generated 17 semantic roles per theme for each native starter, copied the supplied logo PNGs and OFL licence, and instantiated the variable Outfit source at weight 400 before producing TTF. The generated PostScript name was checked as **Outfit-Regular**; the static native instance is deliberately kept under the starter's compatibility filename Outfit-Variable.ttf / outfit_variable.ttf. The original web font is untouched. Python source compilation was checked separately.

**Android/iOS sources were not compiled, installed, run on devices or tested with TalkBack/VoiceOver.** The consuming product must confirm toolchain/API compatibility, actual font loading, safe areas, large type, colour/theme mapping, native control semantics and task outcomes.

## Release and preservation limits

No existing source/spec/README/site/token/motion file, git state or delivery configuration was edited by this batch. No release/tag was created or remote tag/checksum availability verified. The local VERSION inspection was 2.0.0; new additive documentation targets planned v2.1.0 under decision 397. Support/deprecation timelines are policy defaults for owner approval with that release.

Manual NVDA/VoiceOver, actual 200% text/400% browser zoom, final site navigation/old hashes, native compilation/device tests and release publication remain explicit integration gates. [Sidebar handoff](sidebar-placement.md) gives every new page route and example asset dependency.
