---
title: Android Compose starter
description: Map a pinned kit to dp, sp, native semantics, fonts and safe areas.
---
# Android Compose starter

**Starter source only; not compiled here.** First [pin the design release](README.md#pin-the-kit-before-building). No Android Space Works artifact is published by this batch. Create an Android Studio Empty Activity project, namespace com.spaceworks.starter, with activity-compose, Compose foundation and Material3. Pin its generated Gradle wrapper, Android/Kotlin plugins and Compose BOM in the product's version catalog/lockfile. This starter assumes minSdk 26+, Java 17 and a Compose-enabled Kotlin toolchain; those are adoption defaults, not a tested device matrix.

1. Copy [MainActivity.kt](../../examples/android/app/src/main/java/com/spaceworks/starter/MainActivity.kt), [SwTokens.kt](../../examples/android/app/src/main/java/com/spaceworks/starter/SwTokens.kt) and the supplied res tree into app/src/main; change package/namespace together if needed.
2. Token maps preserve 17 named light/dark compatibility roles. To regenerate against your pinned snapshot, install fonttools[brotli] in your product tooling and run python examples/web/export-native.py from the kit root. This only writes the new starter dirs, converts the OFL Outfit WOFF2 to TTF without changing glyphs, and copies licensed assets. Read the generated files before adoption. No platform build is performed.
3. Import res/font/outfit_variable.ttf with FontFamily(Font(R.font.outfit_variable)); keep [OFL licence](../../examples/android/OFL-Outfit.txt). Despite the compatibility filename, the generated TTF is an Outfit Regular 400 instance, so the variable web font's Thin default is not mistaken for Regular. Outfit is used for this native starter; a system fallback is acceptable while loading. Do not package paid Gilroy weights or attempt to load WOFF2 as an Android font. Add native-appropriate supplied free display fonts only after confirming packaging/licensing.
4. Use drawable-nodpi/sw_logo and sw_logo_dark as distinct artwork, not runtime recolouring. Keep aspect ratio and clear space.
5. MainActivity selects the light/dark semantic maps explicitly and uses native OutlinedTextField/Switch/Button, scrollable content, safeDrawingPadding and imePadding. The sample defaults Light and keeps theme only for the session; production persists the explicit choice with DataStore and restores before composing. No System choice is introduced.

| Web/source concept | Compose mapping |
| --- | --- |
| sRGB hex role | Color(0xFFRRGGBB), no runtime alpha for text |
| 4 px spacing grid / 10 control / 16 panel | 4 dp steps / 10.dp / 16.dp where custom geometry is needed |
| Type size / line height | sp through TextStyle; honour fontScale, do not convert text to fixed dp |
| Web 44 px house target | Android at least 48.dp touch target; keep layout large enough to avoid overlapping expanded hit boxes |
| Theme layers | bg -> background; panel -> surface; ink -> onBackground/onSurface; accent/on-accent -> primary/onPrimary |
| Motion | ms timings from motion roles; honour system animator scale and provide still state; native easing/gesture behaviour remains native |

Material3 components provide native semantics/interaction scaffolding; validate them after applying custom colours and type. They do not establish complete Space Works geometry/state parity. [Android accessibility API defaults](https://developer.android.com/develop/ui/compose/accessibility/api-defaults) describes semantics and 48 dp targets.

Before release: compile the product, run lint/UI tests, inspect TalkBack names/reading order, Switch Access, keyboard/D-pad focus, large text/display scaling, portrait/landscape, RTL, light/dark, contrast, IME and safe areas. Search “saw” and Clear filters exercise local empty recovery. Add announcements for real async query outcomes; never announce every keystroke. [Native starter README](../../examples/android/README.md).
