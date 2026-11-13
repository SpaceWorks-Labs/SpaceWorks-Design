import SwiftUI

enum SwTokens {
    static let light: [String: Color] = [
        "bg": Color(.sRGB, red: 1.00000000, green: 0.95686275, blue: 0.90980392, opacity: 1),
        "surface": Color(.sRGB, red: 0.96470588, green: 0.92549020, blue: 0.87843137, opacity: 1),
        "panel": Color(.sRGB, red: 1.00000000, green: 1.00000000, blue: 1.00000000, opacity: 1),
        "hover": Color(.sRGB, red: 0.93725490, green: 0.90196078, blue: 0.85882353, opacity: 1),
        "line": Color(.sRGB, red: 0.83529412, green: 0.81568627, blue: 0.77647059, opacity: 1),
        "outline": Color(.sRGB, red: 0.50980392, green: 0.54117647, blue: 0.51372549, opacity: 1),
        "ink": Color(.sRGB, red: 0.07843137, green: 0.17254902, blue: 0.16470588, opacity: 1),
        "muted": Color(.sRGB, red: 0.35686275, green: 0.40784314, blue: 0.38823529, opacity: 1),
        "focus": Color(.sRGB, red: 0.00000000, green: 0.43137255, blue: 0.38823529, opacity: 1),
        "accent": Color(.sRGB, red: 0.00000000, green: 0.43137255, blue: 0.38823529, opacity: 1),
        "on-accent": Color(.sRGB, red: 1.00000000, green: 0.95686275, blue: 0.90980392, opacity: 1),
        "accent-ink": Color(.sRGB, red: 0.00000000, green: 0.43137255, blue: 0.38823529, opacity: 1),
        "brand-boundary": Color(.sRGB, red: 0.00000000, green: 0.43137255, blue: 0.38823529, opacity: 1),
        "success": Color(.sRGB, red: 0.87450980, green: 1.00000000, blue: 0.56078431, opacity: 1),
        "on-success": Color(.sRGB, red: 0.07843137, green: 0.17254902, blue: 0.16470588, opacity: 1),
        "danger": Color(.sRGB, red: 0.72549020, green: 0.10980392, blue: 0.10980392, opacity: 1),
        "on-danger": Color(.sRGB, red: 1.00000000, green: 0.95686275, blue: 0.90980392, opacity: 1),
    ]
    static let dark: [String: Color] = [
        "bg": Color(.sRGB, red: 0.00000000, green: 0.00000000, blue: 0.00000000, opacity: 1),
        "surface": Color(.sRGB, red: 0.04313725, green: 0.04313725, blue: 0.04313725, opacity: 1),
        "panel": Color(.sRGB, red: 0.07843137, green: 0.07843137, blue: 0.07843137, opacity: 1),
        "hover": Color(.sRGB, red: 0.10980392, green: 0.10980392, blue: 0.10980392, opacity: 1),
        "line": Color(.sRGB, red: 0.17254902, green: 0.17254902, blue: 0.17254902, opacity: 1),
        "outline": Color(.sRGB, red: 0.47058824, green: 0.47058824, blue: 0.47058824, opacity: 1),
        "ink": Color(.sRGB, red: 1.00000000, green: 0.95686275, blue: 0.90980392, opacity: 1),
        "muted": Color(.sRGB, red: 0.67450980, green: 0.67450980, blue: 0.67450980, opacity: 1),
        "focus": Color(.sRGB, red: 0.87450980, green: 1.00000000, blue: 0.56078431, opacity: 1),
        "accent": Color(.sRGB, red: 0.00000000, green: 0.43137255, blue: 0.38823529, opacity: 1),
        "on-accent": Color(.sRGB, red: 1.00000000, green: 0.95686275, blue: 0.90980392, opacity: 1),
        "accent-ink": Color(.sRGB, red: 0.50196078, green: 0.69411765, blue: 0.65098039, opacity: 1),
        "brand-boundary": Color(.sRGB, red: 0.50196078, green: 0.69411765, blue: 0.65098039, opacity: 1),
        "success": Color(.sRGB, red: 0.87450980, green: 1.00000000, blue: 0.56078431, opacity: 1),
        "on-success": Color(.sRGB, red: 0.07843137, green: 0.17254902, blue: 0.16470588, opacity: 1),
        "danger": Color(.sRGB, red: 0.98823529, green: 0.64705882, blue: 0.64705882, opacity: 1),
        "on-danger": Color(.sRGB, red: 0.07843137, green: 0.17254902, blue: 0.16470588, opacity: 1),
    ]
}