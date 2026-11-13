package com.spaceworks.starter

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp

// Starter source only. Put in an Android Studio Empty Activity project with namespace com.spaceworks.starter.
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { FirstScreen() }
    }
}

@Composable
fun FirstScreen() {
    var dark by remember { mutableStateOf(false) } // SW-204: explicit light default.
    var query by remember { mutableStateOf("") }
    val colours = if (dark) SwDark else SwLight
    val outfit = FontFamily(Font(R.font.outfit_variable))
    val baseType = Typography()
    val type = baseType.copy(
        bodyLarge = baseType.bodyLarge.copy(fontFamily = outfit),
        titleLarge = baseType.titleLarge.copy(fontFamily = outfit),
        labelLarge = baseType.labelLarge.copy(fontFamily = outfit)
    )
    val baseScheme = if (dark) darkColorScheme() else lightColorScheme()
    val scheme = baseScheme.copy(
        primary = colours.getValue("accent"), onPrimary = colours.getValue("on-accent"),
        primaryContainer = colours.getValue("surface"), onPrimaryContainer = colours.getValue("ink"),
        secondary = colours.getValue("accent"), onSecondary = colours.getValue("on-accent"),
        secondaryContainer = colours.getValue("surface"), onSecondaryContainer = colours.getValue("ink"),
        tertiary = colours.getValue("accent"), onTertiary = colours.getValue("on-accent"),
        tertiaryContainer = colours.getValue("surface"), onTertiaryContainer = colours.getValue("ink"),
        background = colours.getValue("bg"), onBackground = colours.getValue("ink"),
        surface = colours.getValue("panel"), onSurface = colours.getValue("ink"),
        surfaceVariant = colours.getValue("surface"), onSurfaceVariant = colours.getValue("muted"),
        outline = colours.getValue("brand-boundary"), outlineVariant = colours.getValue("line"),
        surfaceContainer = colours.getValue("panel"), surfaceContainerHigh = colours.getValue("panel"),
        surfaceContainerHighest = colours.getValue("surface"), surfaceContainerLow = colours.getValue("surface"),
        surfaceContainerLowest = colours.getValue("bg"),
        error = colours.getValue("danger"), onError = colours.getValue("on-danger")
    )
    MaterialTheme(colorScheme = scheme, typography = type) {
        Surface(color = colours.getValue("bg")) {
            Column(Modifier.fillMaxSize().safeDrawingPadding().imePadding()
                .verticalScroll(rememberScrollState()).padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)) {
                Image(painterResource(if (dark) R.drawable.sw_logo_dark else R.drawable.sw_logo),
                    contentDescription = "Space Works", modifier = Modifier.width(180.dp).height(54.dp))
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Dark theme")
                    Switch(checked = dark, onCheckedChange = { dark = it },
                        modifier = Modifier.semantics { contentDescription = "Dark theme" })
                }
                Text("Inventory", style = MaterialTheme.typography.titleLarge,
                    modifier = Modifier.semantics { heading() })
                Text("Find equipment available in your makerspace.")
                OutlinedTextField(value = query, onValueChange = { query = it },
                    label = { Text("Search inventory") },
                    supportingText = { Text("Search by name. Local sample data only.") },
                    modifier = Modifier.fillMaxWidth())
                if ("drill press".contains(query.trim(), ignoreCase = true)) {
                    Text("Drill press", style = MaterialTheme.typography.titleLarge)
                    Text("Available", color = colours.getValue("on-success"),
                        modifier = Modifier.background(colours.getValue("success")).padding(8.dp))
                    Text("Ask a staff member before use.")
                } else {
                    Text("No items match your search. Clear filters to see all inventory.")
                    OutlinedButton(onClick = { query = "" }, modifier = Modifier.heightIn(min = 48.dp)) {
                        Text("Clear filters")
                    }
                }
            }
        }
    }
}
