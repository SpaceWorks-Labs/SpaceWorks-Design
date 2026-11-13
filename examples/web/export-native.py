"""Generate starter-only native role maps/assets from the pinned kit; no platform compilation."""
from pathlib import Path
import json
import re
import shutil
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parents[2]
ANDROID = ROOT / "examples/android/app/src/main"
IOS = ROOT / "examples/ios"

def write(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8", newline="\n")

tokens = json.loads((ROOT / "tokens/tokens.json").read_text(encoding="utf-8"))
roles = ("bg", "surface", "panel", "hover", "line", "outline", "ink", "muted", "focus",
         "accent", "on-accent", "accent-ink", "brand-boundary", "success", "on-success",
         "danger", "on-danger")
for theme in ("light", "dark"):
    for role in roles:
        if not re.fullmatch(r"#[0-9A-Fa-f]{6}", tokens[theme][role]):
            raise ValueError("Expected a six-digit sRGB compatibility role: " + role)
kotlin = ["package com.spaceworks.starter", "", "import androidx.compose.ui.graphics.Color", ""]
swift = ["import SwiftUI", "", "enum SwTokens {"]
for theme in ("light", "dark"):
    kotlin.append("val Sw" + theme.title() + " = mapOf(")
    swift.append("    static let " + theme + ": [String: Color] = [")
    for role in roles:
        colour = tokens[theme][role].lstrip("#")
        kotlin.append('    "' + role + '" to Color(0xFF' + colour + '),')
        values = [int(colour[i:i+2], 16) / 255 for i in (0, 2, 4)]
        swift.append('        "' + role + '": Color(.sRGB, red: %.8f, green: %.8f, blue: %.8f, opacity: 1),' % tuple(values))
    kotlin.append(")\n")
    swift.append("    ]")
swift.append("}")
write(ANDROID / "java/com/spaceworks/starter/SwTokens.kt", "\n".join(kotlin))
write(IOS / "SwTokens.swift", "\n".join(swift))
for destination in (ANDROID / "res/font/outfit_variable.ttf", IOS / "Fonts/Outfit-Variable.ttf"):
    destination.parent.mkdir(parents=True, exist_ok=True)
    font = TTFont(ROOT / "fonts/Outfit-Variable.woff2")
    # A variable web font may have a Thin PostScript default. Native starters use a named Regular instance.
    instantiateVariableFont(font, {"wght": 400}, inplace=True, updateFontNames=True)
    font.flavor = None
    font.save(destination)
for destination in (ROOT / "examples/android/OFL-Outfit.txt", IOS / "Fonts/OFL-Outfit.txt"):
    shutil.copyfile(ROOT / "fonts/LICENSES/OFL-Outfit.txt", destination)
for name, source in (("sw_logo", "lockup-horizontal.png"), ("sw_logo_dark", "lockup-horizontal-reversed.png")):
    target = ANDROID / ("res/drawable-nodpi/" + name + ".png")
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(ROOT / "logo" / source, target)
    image = IOS / ("Assets.xcassets/" + name + ".imageset")
    image.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(ROOT / "logo" / source, image / "logo.png")
    write(image / "Contents.json", json.dumps({"images":[{"filename":"logo.png","idiom":"universal"}],"info":{"author":"SpaceWorks starter","version":1}}, indent=2))
write(IOS / "Assets.xcassets/Contents.json", json.dumps({"info":{"author":"SpaceWorks starter","version":1}}, indent=2))
print("Generated 17 light/dark semantic roles, Outfit TTF and logo resources for Android/iOS. Not compiled.")
