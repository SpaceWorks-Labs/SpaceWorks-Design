---
title: Adopt Space Works in a new product
description: Choose a platform, pin a design-system release and build the first screen.
---
# Adopt Space Works in a new product

This kit supplies tokens, fonts, logo assets, motion templates and contracts. It does **not** publish a universal React/Compose/SwiftUI component package. Build a new product from a reviewed release snapshot and use the portable starters below; app component copies remain reference-only.

| Platform | First-screen guide | Source | Verification scope |
| --- | --- | --- | --- |
| Plain HTML/CSS | [HTML first screen](plain-html-css.md) | [web starter](../../examples/web/index.html) | Node server and browser checks in the verification record |
| React / Tailwind | [React first screen](react-tailwind.md) | [React source](../../examples/web/react/src.jsx) | Pinned package/build entry; actual build result in verification |
| Android Compose | [Android starter](android-compose.md) | [MainActivity](../../examples/android/app/src/main/java/com/spaceworks/starter/MainActivity.kt) | Starter source and generated assets; **not compiled here** |
| iOS SwiftUI | [iOS starter](ios-swiftui.md) | [FirstScreen](../../examples/ios/FirstScreen.swift) | Starter source and generated assets; **not compiled here** |

## Pin the kit before building

Use the published **v2.0.0** baseline identified by owner decision 382 and the lane brief. The local checkout's VERSION was 2.0.0 and its local tag list was empty on inspection; do not invent a local tag or imply this batch released one. Confirm the remote tag in your product setup; if unavailable stop installation and have the design owner provide the immutable release commit.

```powershell
git ls-remote --exit-code --tags https://github.com/SpaceWorks-Labs/SpaceWorks-Design-System.git refs/tags/v2.0.0
git clone --branch v2.0.0 --depth 1 https://github.com/SpaceWorks-Labs/SpaceWorks-Design-System.git vendor/spaceworks-design
git -C vendor/spaceworks-design rev-parse HEAD
```

These are **consumer setup commands**, not commands executed by this documentation batch. Record the resolved full commit in the product's dependency manifest and commit the vendored snapshot or pinned submodule pointer, including font licences. [Version-specific archive](https://github.com/SpaceWorks-Labs/SpaceWorks-Design-System/archive/refs/tags/v2.0.0.zip) and [release page](https://github.com/SpaceWorks-Labs/SpaceWorks-Design-System/releases/tag/v2.0.0) are the intended release endpoints; availability was not remotely verified here. Never adopt main.zip or update a submodule with --remote as a release procedure.

The starter files added by this batch target **planned v2.1.0** (ledger 397). v2.0.0 cannot contain these new files. Until the owner publishes the additive release, copy the starter sources from the reviewed batch separately and pair them with v2.0.0's compatibility token/font/logo paths; record both source identities. After publication pin the actual v2.1.0 tag/commit deliberately. Do not copy a command using an unreleased tag and assume it exists.

## First-screen acceptance

1. Import the pinned CSS or generated semantic roles, font assets/licences and correct light/reversed logo. Do not convert logo colours with CSS filters.
2. Default to Light; restore a saved explicit Light/Dark choice before first paint. No System choice; map tenant brand overrides only on public/member surfaces after contrast validation.
3. Render one h1, labelled search/filter form, truthful sample list and a distinct filtered-empty message. Use native control semantics and a 44 px web/Apple house target, 48 dp Android, 56 px kiosk.
4. Replace local data with product query/mutation handling only after empty/error/offline/pending/success states are specified. Preserve drafts and safe retry; no endpoint is implied by the sample.
5. Run the [accessibility scripts](../accessibility.md#test-scripts), [component contracts](../components/README.md) and [release upgrade checklist](../releases/migration.md). Store results by product version.

## Design and asset resources

The source Figma link in [UI brand spec](../ui-brand-spec.md#f-logo-exact-extraction-and-in-product-use) is the existing design reference; editable-library access is not verified and no new public library is promised. Request access/reuse through the [contribution route](../contributing-design-system.md). [Logo masters](../../brand/logo-masters.svg), [font files/licences](../../fonts/README.md), [tokens](../../tokens/README.md), [motion sources](../../motion/README.md) and both brand-book editions remain available. Keep artwork edition, kit semver and app version separate.

[Verification record](verification.md) · [Exact sidebar handoff](sidebar-placement.md).
