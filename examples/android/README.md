# Android starter source

Not compiled here. Copy app/src/main into a Compose-enabled Android Studio Empty Activity project with namespace com.spaceworks.starter; replace the generated MainActivity. Required product dependencies: activity-compose, Compose foundation and Material3. The adoption defaults are minSdk 26+, Java 17 and the product's pinned Kotlin/Compose toolchain.

SwTokens.kt, Outfit TTF/OFL licence and light/reversed PNG logo resources are generated from this kit by python examples/web/export-native.py. Install fonttools[brotli] in the product tooling for regeneration. The sample defaults Light and stores theme only for the session; production must persist the explicit choice. It filters local sample data and has no network/persistence integration.

[Complete setup, mapping and device checks](../../docs/adoption/android-compose.md).
