# Current rules

Binding guidance register, reviewed **2026-11-13** for DS-AUDIT phase 2, batch 1A. Start here when retained passages disagree. IDs are permanent; link to the subject ID rather than repeating a rule. Later owner decisions win. Rule 395 requires additive, dated corrections beside old passages; it does not permit rewriting history.

Authority is the SpaceWorks ledger `handover/research/decisions-2026-10-18.md` (number and full date below), with the public [decision record](decisions.md). An implementation observation is evidence, not a new owner decision. Where no later geometry decision exists, the adopted brand spec remains the default; the auto decisions are stated explicitly below.

## CR-THEME-01

**Theme choices: Light, Dark and System.** Light is the fallback. Respect a saved choice, cross-tab updates and a session choice when storage fails. System follows the device only when chosen by the visitor or configured as a space's default look on public/member/display surfaces. A fixed choice ignores OS changes. Paint `html.dark` before first paint and update browser chrome with the painted theme.

**Deciding authority:** SW-364, **2026-11-13** (explicit light/dark/system implementation), later than the undated D11 prohibition; SW-204, **2026-11-07** (light default). Verified read-only against app `lib/theme.ts`, `public/boot.js` and `ThemeChoice.tsx` on 2026-11-13.

**Occurrences:** [theming §§2–4 and checklist](theming.md#2-the-switch), [brand D11](ui-brand-spec.md#0-key-decisions), [brand H.7](ui-brand-spec.md#h7-other-corrections), [brand checklist row 21](ui-brand-spec.md#k-brand-fidelity-checklist-rule--where--how-enforced), [UX user menu](ux-spec.md#24-top-and-bottom-of-the-sidebar), [lesson 29](lessons-learned.md#3-motion), [product themes](product-rules.md#11-language-accessibility-themes-and-motion), [SW-364](decisions.md#sw-364--motion-guide-and-theming-guide), [SW-204](decisions.md#sw-204--light-mode-is-the-default).

## CR-STATUS-01

**Small status marks keep their fills in both themes.** Success = `bg-success text-on-success`; warn = `bg-warn text-on-warn`; info = `bg-info text-on-info`; emphasis = `bg-emphasis text-on-emphasis`. Do not turn these pastel marks into dark soft pills. A word is mandatory; an icon is optional. Accent remains `bg-accent-soft text-accent-ink`; danger remains `bg-panel border-danger-line text-danger`; neutral remains `bg-surface border-line text-ink`. “Solid in both themes” does not turn these three exceptions into filled action buttons. Large success/warn/info callouts use the solid fill in light and the named opaque soft fill plus tone ink in dark.

**Deciding authority:** SW-373, **2026-11-13** (current brand guidelines), corroborated by lesson 9's app commit `6e60c20c4` and current `components/ui/tones.ts`. The D6/C dark-pill recipe predates this recorded small-mark/large-surface distinction; no separate owner SW-number is recorded for that implementation change.

**Occurrences:** [brand D6](ui-brand-spec.md#0-key-decisions), [status matrix and domain words](ui-brand-spec.md#c-status-pills), [lessons 9–12](lessons-learned.md#status-colours), [UX P10](ux-spec.md#p10-pills-and-chips), [long-tail conventions](ux-screens-longtail.md#02-conventions-used-by-every-screen-here-so-they-are-not-repeated-per-screen), [theming bright fills](theming.md#the-bright-brand-colours-are-the-same-in-both-themes).

## CR-RADIUS-01

**Product controls use 10 px; cards/panels use 16 px; tags/status pills are fully round.** Use the component role, not a radius measured on an inspiration board. The retained 6/8/10/12/16/20/full scale permits explicitly specified component variants; it does not change these defaults. Cards are flat. The documented `shadow-overlay` exception belongs only to floating popovers, menus, modals, drawers and toasts.

**Deciding authority:** SW-373, **2026-11-13**, brand spec D8/E. **Auto decision:** retain those adopted brand defaults because no later owner switch to pill controls is recorded. The “owner may switch” sentence is conditional, not evidence of a switch.

**Occurrences:** [brand D8](ui-brand-spec.md#0-key-decisions), [shape tokens and overlay exception](ui-brand-spec.md#e-shape-borders-shadow-spacing-motion), [open control-radius item](ui-brand-spec.md#j-owner-decisions-still-open), [UX measured scale](ux-spec.md#10-observed-scale-use-these-not-ad-hoc-values), [UX buttons](ux-spec.md#p11-buttons), [long-tail pill terminology](ux-screens-longtail.md#02-conventions-used-by-every-screen-here-so-they-are-not-repeated-per-screen).

## CR-SIDEBAR-01

**Sidebar: Citron in light, neutral `#0B0B0B` in dark, text-only navigation, filled teal current item with `aria-current="page"`.** Use the brand E product geometry: 256 px desktop width, 20 px inset, 44 px items and 4 px gaps. The measured 240–300 px widths, 264 px proposal, warm-grey active item and reference icons are research. Keep task grouping, route-aware disclosure, scrolling and responsive navigation behaviour from the UX spec. The user menu includes the theme choices in CR-THEME-01.

**Deciding authority:** SW-316, **2026-11-11** (neutral dark family); SW-373, **2026-11-13** (brand defaults). **Auto decision:** brand D9/E wins on visual geometry over the earlier measured reference; no later owner approval of the 264 px proposal is recorded.

**Occurrences:** [brand D9](ui-brand-spec.md#0-key-decisions), [sidebar tokens](ui-brand-spec.md#a1-full-token-table-with-the-source-of-every-value), [interaction states](ui-brand-spec.md#b-interaction-states), [brand E](ui-brand-spec.md#e-shape-borders-shadow-spacing-motion), [logo sizes](ui-brand-spec.md#f3-in-product-sizes-rules-symbol-48-px-primary-lockup-180-px-wide-clear-space-h4), [icon rules](ui-brand-spec.md#g-icons), [open sidebar item](ui-brand-spec.md#j-owner-decisions-still-open), [UX P1](ux-spec.md#p1-app-shell-and-sidebar-r1r10-r16-r17), [UX L1](ux-spec.md#l1-appshell--sidebar--content-r1r10-r16r17), [UX sidebar IA](ux-spec.md#2-staff-console-sidebar-ia), [theming sidebar](theming.md#the-bright-brand-colours-are-the-same-in-both-themes), [lesson 30](lessons-learned.md#4-components).

## CR-TYPE-01

**Three families, with explicit weights.** Gilroy ships only Light **300** and ExtraBold **800**: use 800 for display headings, 300 for deliberately light display text. Outfit **400–700** handles body/UI; use Outfit 600 for the documented page/panel/section heading roles and numbers. Unbounded **500–600** provides one short accent phrase per layout. Never request Gilroy 400/500/600/700 or synthesise a missing face. IDs/code in product UI use Outfit with tabular figures (and `.code-text` where specified), not a separate monospace family.

**Deciding authority:** SW-299, **2026-11-11**, superseding earlier Gilroy arrangements; SW-220, **2026-11-09**, for Outfit. The one-accent role is retained from the adopted brand spec.

**Occurrences:** [brand D7](ui-brand-spec.md#0-key-decisions), [faces, CSS, scale and IDs](ui-brand-spec.md#d-typography), [font migration](ui-brand-spec.md#h6-font-mono-migration-codex-4), [brand checklist rows 14–16](ui-brand-spec.md#k-brand-fidelity-checklist-rule--where--how-enforced), [lessons 21–23](lessons-learned.md#2-typography), [UX observed weights](ux-spec.md#10-observed-scale-use-these-not-ad-hoc-values), [README font changelog](../README.md#v20-token-sync-ships-alongside-spaceworks-0120), [SW-299](decisions.md#sw-299--only-the-free-gilroy-weights-ship).

## CR-LOGO-01

**Closed logo: four visible, solid flap regions, two orange and two green in both themes.** Top-left and bottom-right stay green `#006E63`; top-right and bottom-left stay orange `#FF7447`, on both sides throughout movement. Reversed product geometry keeps the cream body and this flap palette. Explicit monochrome/forced-colours variants keep four separate regions in one colour. Retain static-rest fidelity, no holes, depth order and reduced-motion stills. SW-381's one-orange-lid interpretation and face recolouring are historical.

**Deciding authority:** [SW-389](decisions.md#sw-389--four-visible-flaps-keep-their-own-colours-when-shut), **2026-11-13**, superseding that part of SW-381. No change to the newly added public decision is made by this register.

**Occurrences:** [motion Brand catalogue](motion.md#brand), [lessons 39 and 40](lessons-learned.md#5-process), [lesson 40 at the end of the page](lessons-learned.md#the-five-lessons-that-cost-the-most), [brand logo use](ui-brand-spec.md#f-logo-exact-extraction-and-in-product-use), [theming artwork](theming.md#6-artwork-per-theme), [superseded SW-381 wording](decisions.md#sw-381--logo-box-animation-one-orange-face-when-shut-no-holes-in-dark-frame-checked).

## CR-DARK-01

**Dark is one neutral black family:** page `#000000`, surface/sidebar `#0B0B0B`, panel `#141414`, hover `#1C1C1C`, decorative line `#2C2C2C`; Cream text and Citron focus. No green-tinted dark page surfaces. Bright brand fills remain accents. A deliberately dark island on a light page may use Deep Ink; on an already dark page it rejoins the neutral black family. The old blanket “no black” rule is superseded. Tenant label derivation may use black as its documented final functional fallback.

**Deciding authority:** SW-316, **2026-11-11**, superseding SW-225's intermediate palette and the dark clauses of SW-275/300; brand H.5 records the preserved tenant-label fallback.

**Occurrences:** [brand introduction](ui-brand-spec.md), [brand D1 and A token/CSS tables](ui-brand-spec.md#a-tokens), [brand tenant fallback](ui-brand-spec.md#h5-tenant-branding-contract-codex-3), [theming introduction/token layer](theming.md#1-the-token-layer), [motion dark guide](motion.md#dark-theme-on-every-page), [lesson 1 and pairing table](lessons-learned.md#1-colour-in-light-and-dark), [README dark changelog](../README.md#v20-token-sync-ships-alongside-spaceworks-0120), [SW-316](decisions.md#sw-316--dark-theme-is-one-solid-black-family).

## CR-CHART-01

**Series are `--chart-1` … `--chart-5`:** teal `#006E63`, orange `#FF7447`, citron `#DFFF8F`, sky `#B5CDFF`, yellow `#FFD447`, identical in both themes. Contrast comes from `--chart-edge` (Deep Ink in light, Cream in dark): 1 px edge on filled marks and 4 px casing under 2 px lines. Retain stable identity mapping, dash patterns and meaningful labels. Danger is an explicit negative/error role, never an ordinary series. Old named series aliases and dull ink recipes are historical, not the current series API.

**Deciding authority:** SW-380, **2026-11-13**.

**Occurrences:** [theming palette](theming.md#the-bright-brand-colours-are-the-same-in-both-themes), [theming artwork/charts](theming.md#6-artwork-per-theme), [lesson 13](lessons-learned.md#charts), [brand migration chart rule](ui-brand-spec.md#h7-other-corrections), [README old chart label](../README.md#v20-token-sync-ships-alongside-spaceworks-0120), [SW-380](decisions.md#sw-380--one-bright-chart-palette-in-light-and-dark-contrast-from-edges).

## CR-MOTION-01

**Use the shared motion defaults:** fast/base/slow = 120/180/240 ms; standard/enter/exit curves = `cubic-bezier(0.2,0,0,1)` / `cubic-bezier(0.16,1,0.3,1)` / `cubic-bezier(0.4,0,1,1)`. Use transform/opacity; ordinary hover is colour only. Interaction-path motion never blocks input beyond 240 ms. Theme reveal (720 ms), box opening (1600 ms), hover fold/open (600 + 1600 = 2200 ms) and loader loop (4400 ms) are named non-blocking exceptions. Logo hover/focus finishes once, does not restart in flight, and never runs on touch or under reduced motion. Tenant logos stay still. Use the box loader and a meaningful status label; reduced motion shows its still state. Kiosk/TV zero distances. Delight defaults on with the space's opt-out; reduced motion takes precedence, including for theme switching.

**Deciding authority:** SW-51, **2026-10-20** (defaults); SW-322/323, **2026-11-11** (loader/motion); SW-364/367/376, **2026-11-13** (catalogue, full hover cycle, theme reveal). Ledger **399, 2026-11-13**, adds symmetric choreography, token timing, interruptibility, focus/announcements and reduced-motion end states; named logo-cycle semantics remain as specified above.

**Occurrences:** [motion defaults](motion.md#which-animation-to-use-where), [motion rules and tokens](motion.md#rules), [brand E](ui-brand-spec.md#e-shape-borders-shadow-spacing-motion), [theming reveal](theming.md#switch-animation), [lessons 24–29](lessons-learned.md#3-motion), [product loading/motion](product-rules.md#11-language-accessibility-themes-and-motion), [long-tail loading](ux-screens-longtail.md#02-conventions-used-by-every-screen-here-so-they-are-not-repeated-per-screen), [README historical one-shot description](../README.md#v20-token-sync-ships-alongside-spaceworks-0120), [SW-367](decisions.md#sw-367--logo-hover-fold-shut-then-open), [SW-376](decisions.md#sw-376--theme-switch-animation-as-a-template).

## CR-OPACITY-01

**Text is opaque.** Use `text-muted`/`--color-muted` for secondary text, never `text-ink/80` or `rgb(var(--color-ink) / .8)`. Use named opaque `*-soft` roles for tinted backgrounds, never an alpha brand fill. Triplet storage enables compositing where explicitly permitted (for example a scrim); it grants no exception for translucent text. Temporary animation opacity does not define the resting text colour.

**Deciding authority:** SW-373, **2026-11-13**, and adopted brand D5/B/H.1; implementation provenance and contrast rationale are recorded there. Rule 395, **2026-11-13**, governs how the contradictory examples are retained.

**Occurrences:** [brand D5](ui-brand-spec.md#0-key-decisions), [brand interaction states](ui-brand-spec.md#b-interaction-states), [migration bans](ui-brand-spec.md#h1-translucency-bans-codex-1), [theming triplet explanation](theming.md#1-the-token-layer), [theming component examples](theming.md#5-how-components-consume-tokens), [product accessibility](product-rules.md#11-language-accessibility-themes-and-motion), [lesson text rules](lessons-learned.md#text-muted-text-and-accent).

## CR-DISABLED-01

**Disabled controls use explicit opaque states:** `bg-surface text-muted border-line`, with hover/press effects suppressed. Use native `disabled` where supported; if `aria-disabled` is needed, also prevent activation. Explain what enables the action beside the control when it is not obvious. A disabled-opacity example or the old “allowed outside the button family” exception is not a current recipe. Read-only retains readable content and its label; it is not a disabled action.

**Deciding authority:** adopted brand B, reaffirmed by SW-373, **2026-11-13**; DSA-015's correction is additive under rule 395, **2026-11-13**.

**Occurrences:** [brand B](ui-brand-spec.md#b-interaction-states), [historical H.1 exception](ui-brand-spec.md#h1-translucency-bans-codex-1), [UX button states](ux-spec.md#p11-buttons), [current theming example](theming.md#5-how-components-consume-tokens).

## CR-RELEASE-01

**Keep product, release and working-tree versions distinct.** The design-system series is **v2.0**, independently of the **SpaceWorks app 0.12.0**. **v2.0.0 was released 2026-11-13** (SW-382/386 and the supplied lane release record); local tag `v2.0.0` is present. The fixes named by SW-389/390/405 are the **v2.0.1 checkpoint**, whose intended `VERSION` is **2.0.1**. Ledger **397, 2026-11-13**, sets the larger phase-2 additions to **v2.1.0**. Neither a target nor a `VERSION` edit proves publication.

**Observed at 2026-11-13, batch 1A baseline:** the root `VERSION` actually reads **2.0.0**, and `git tag --list` includes **v2.0.0**. The requested 2.0.1 checkpoint value is therefore pending the owning release lane; this batch cannot edit `VERSION`. No live GitHub release query was made. Release status above is attributed to the owner/lane record, not a new remote observation. Refresh this observation additively after integration.

**Deciding authority:** SW-382/386/389/390, **2026-11-13**, ledger 397 and the batch brief. Do not relabel app release numbers, asset paths or dated decision titles.

**Occurrences:** [README version](../README.md), [README token-sync heading](../README.md#v20-token-sync-ships-alongside-spaceworks-0120), [delivery static-site status](delivery.md#6-stack-5-static-sites-website-docs-design-system), [delivery status table](delivery.md#7-where-each-repo-stands), [delivery gaps](delivery.md#8-bringing-each-repo-up-to-the-rules), [SW-382](decisions.md#sw-382--this-release-is-space-works-design-system-v20), [SW-389](decisions.md#sw-389--four-visible-flaps-keep-their-own-colours-when-shut), [SW-405](decisions.md#sw-405--every-project-has-its-own-landing-page-and-feature-docs-built-from-this-system).

## CR-SCOPE-01

**Canonical product guidance, documentation presentation and historical research have different scope.** Apply this register and the adopted brand roles to product UI. Reference-board pixel measurements, ASCII wireframes and earlier proposed values remain research even when an old heading says “use these”. Documentation chrome or an animation demonstration does not grant a product exception. Literal 0.12.0 app references stay valid; the system is v2.0. The current brand book is v2 (50 pages); v1 (17 pages) remains a historical download. Typography has three families. Stale labels in files outside batch 1A must be clarified by their owning integration batch without deleting old content.

**Deciding authority:** SW-373/382/385, **2026-11-13**, DS-5 (**2026-10-15 and 2026-10-19**), and rule 395, **2026-11-13**. Geometry precedence is the explicit auto decision in CR-RADIUS-01/CR-SIDEBAR-01, not a newly invented owner approval.

**Occurrences:** [brand source statement](ui-brand-spec.md), [brand measured mock](ui-brand-spec.md#e-shape-borders-shadow-spacing-motion), [brand open-items heading](ui-brand-spec.md#j-owner-decisions-still-open), [UX measured scale](ux-spec.md#10-observed-scale-use-these-not-ad-hoc-values), [UX pending-data heading](ux-spec.md#6-items-that-need-a-decision-or-data-before-implementation), [long-tail research status](ux-screens-longtail.md), [README contents](../README.md#contents), [historical SW-366](decisions.md#sw-366--what-changed-in-0120-page).

## CR-CONTENT-01

**Clear, warm, specific and truthful.** Use the [voice and content guide](voice-and-content.md), British English, sentence case and action labels that name the result. No fake Undo for evidence, handovers, payments or other audited records. A correction/refund/reversal is a new authorised operation with its own record; show the actual scope and consequence. Distinguish empty, filtered-empty, loading, offline queued, partial failure and confirmed success. Keep identifiers and exact evidence available without making an ID the primary label.

**Deciding authority:** SW-235, **2026-11-10**, SW-373/405, **2026-11-13**, and the retained UX P30 safety contract. DSA-026 supplies the expanded writing patterns, not new backend capabilities.

**Occurrences:** [UX microcopy](ux-spec.md#132-microcopy-style), [UX Undo/confirmation](ux-spec.md#p30-undo-and-confirmation-behaviour-r8-r28), [long-tail copy conventions](ux-screens-longtail.md#02-conventions-used-by-every-screen-here-so-they-are-not-repeated-per-screen), [product language](product-rules.md#11-language-accessibility-themes-and-motion), [product landing/docs rule](product-rules.md#121-landing-page-and-feature-docs-every-project-except-the-native-apps), [brand checklist row 19](ui-brand-spec.md#k-brand-fidelity-checklist-rule--where--how-enforced).

## CR-DELIVERY-01

**Delivery tables are dated observations; pipeline proposals are rules, not work authorised in this batch.** SW-386, **2026-11-13**, explicitly defers adding workflows, CODEOWNERS or branch-protection changes. SW-387, **2026-11-13**, records maintainer-only main/dev protection without new required checks. Retain the tables, but read their implementation claims at the stated observation date. The retired SpaceWorks-Docs site is not the current documentation architecture: SW-405, **2026-11-13**, puts feature docs in each product and has native apps link to the hub. Keep product-rules §12.1 and public SW-405 as supplied.

**Occurrences:** [delivery general rules](delivery.md#1-rules-every-product-follows), [static sites](delivery.md#6-stack-5-static-sites-website-docs-design-system), [status table](delivery.md#7-where-each-repo-stands), [gap proposals and checklist](delivery.md#8-bringing-each-repo-up-to-the-rules), [product CI/CD rule](product-rules.md#14-cicd-pipeline), [per-product snapshot](product-rules.md#where-each-product-stands), [product §12.1](product-rules.md#121-landing-page-and-feature-docs-every-project-except-the-native-apps).
