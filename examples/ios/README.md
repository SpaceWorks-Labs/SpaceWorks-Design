# iOS starter source

Not compiled here. Add FirstScreen.swift, SwTokens.swift, Assets.xcassets and Fonts to an iOS 17+ SwiftUI target. Use FirstScreen() in the app WindowGroup. Register Fonts/Outfit-Variable.ttf in UIAppFonts and bundle it with its OFL licence. Confirm the font's Outfit-Regular PostScript name on the device.

The generated role maps/assets come from python examples/web/export-native.py in the kit root (requires fonttools[brotli]). The sample persists explicit Light/Dark with @AppStorage, honours native Dynamic Type and filters local data. No API or full component parity is implied.

[Complete setup, mapping and device checks](../../docs/adoption/ios-swiftui.md).
