---
title: iOS SwiftUI starter
description: Map a pinned kit to native colour, Dynamic Type, fonts, controls and safe areas.
---
# iOS SwiftUI starter

**Starter source only; not compiled here.** First [pin the design release](README.md#pin-the-kit-before-building). This batch publishes no Swift package or component library. Create an iOS 17+ SwiftUI app target using your product's pinned Xcode/Swift toolchain; commit project/dependency resolution. A Mac/Xcode build and device/VoiceOver verification remain required.

1. Add [FirstScreen.swift](../../examples/ios/FirstScreen.swift), [SwTokens.swift](../../examples/ios/SwTokens.swift), Assets.xcassets and Fonts to the target. Set your App's WindowGroup content to FirstScreen().
2. Add Fonts/Outfit-Variable.ttf to Copy Bundle Resources and UIAppFonts in Info.plist (the entry is the actual bundled file path). Keep Fonts/OFL-Outfit.txt. Despite the compatibility filename, the generated native TTF is a static 400-weight Regular instance, with verified PostScript name Outfit-Regular; the original variable WOFF2 remains intact. Verify font loading on the device and fallback to system text. WOFF2 is a web asset, not an iOS bundle font.
3. Generated light/dark maps preserve 17 named compatibility roles. Regenerate from a pinned kit with python examples/web/export-native.py (fonttools[brotli] required); it writes both native starter exports/assets and does not compile. Use Color(.sRGB, red:..., green:..., blue:..., opacity:1), not a hex-to-P3 reinterpretation.
4. Use sw_logo/sw_logo_dark image sets as separate light/reversed logo artwork, preserving aspect ratio and clear space. Do not apply template tint to the full-colour logo.
5. The native Toggle persists an explicit Light/Dark choice with @AppStorage; default Light wins over the OS until the user changes it. preferredColorScheme matches the native controls. No System option. The Search field uses a visible and accessibility label; the sample filters local data and has an explicit empty recovery.

| Source concept | SwiftUI mapping |
| --- | --- |
| Spacing, radii | pt, using 4-point spacing steps and 10/16 custom geometry where required |
| Type | .custom(..., relativeTo:) for Dynamic Type, never fixed-height label containers |
| Web target rule | 44×44 pt minimum house target; retain larger system controls |
| bg / panel / ink / muted | Named theme dictionary roles; use matching on-* for filled badges/buttons |
| Insets / keyboard | Respect safe areas and scrollable content; do not ignoreSafeArea on task controls |
| Motion | Convert ms to seconds; respect accessibilityReduceMotion and native transitions; still state must be usable |

This starter uses Outfit for native text instead of claiming the web display hierarchy has been ported fully. Native controls retain platform behaviour and may need reviewed custom styles to match all brand geometry. The sample has no ornamental animation and uses native screen-reader names.

Before release: build in Xcode; test all accessibility text sizes, VoiceOver rotor/order/labels, hardware keyboard Full Keyboard Access, Switch Control, Voice Control, Increase Contrast, Reduce Motion, portrait/landscape, dark/light, RTL and the keyboard. Do not announce every filtered keystroke; for async search announce settled counts. Follow [Apple accessibility guidance](https://developer.apple.com/design/human-interface-guidelines/accessibility) and the [system criterion map](../accessibility.md). [Native README](../../examples/ios/README.md).
