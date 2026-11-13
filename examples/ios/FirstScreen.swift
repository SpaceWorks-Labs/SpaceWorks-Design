import SwiftUI

// Starter source only. Add this source, SwTokens, Assets and Fonts to an iOS 17+ SwiftUI app target.
struct FirstScreen: View {
    @AppStorage("sw-starter-theme-dark") private var dark = false
    @State private var query = ""
    private var tokens: [String: Color] { dark ? SwTokens.dark : SwTokens.light }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Image(dark ? "sw_logo_dark" : "sw_logo")
                    .resizable().scaledToFit().frame(maxWidth: 180)
                    .accessibilityLabel("Space Works")
                Toggle("Dark theme", isOn: $dark).frame(minHeight: 44)
                Text("Inventory")
                    .font(.custom("Outfit-Regular", size: 28, relativeTo: .title))
                    .accessibilityAddTraits(.isHeader)
                Text("Find equipment available in your makerspace.")
                VStack(alignment: .leading, spacing: 8) {
                    Text("Search inventory")
                    TextField("Search by name", text: $query)
                        .textFieldStyle(.roundedBorder)
                        .accessibilityLabel("Search inventory")
                        .frame(minHeight: 44)
                    Text("Local sample data only.").foregroundStyle(tokens["muted"]!)
                }
                if "drill press".contains(query.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()) {
                    Text("Drill press").bold().accessibilityAddTraits(.isHeader)
                    Text("Available").foregroundStyle(tokens["on-success"]!)
                        .padding(8).background(tokens["success"]!, in: Capsule())
                    Text("Ask a staff member before use.")
                } else {
                    Text("No items match your search. Clear filters to see all inventory.")
                    Button("Clear filters") { query = "" }.frame(minHeight: 44)
                }
            }
            .font(.custom("Outfit-Regular", size: 17, relativeTo: .body))
            .padding(16).frame(maxWidth: .infinity, alignment: .leading)
        }
        .foregroundStyle(tokens["ink"]!)
        .background(tokens["bg"]!)
        .tint(tokens["accent-ink"]!)
        .preferredColorScheme(dark ? .dark : .light)
    }
}
