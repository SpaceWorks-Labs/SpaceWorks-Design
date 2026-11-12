"""Rebuild brand/readme/banner-light.svg and banner-dark.svg.

Run from anywhere:  python brand/readme/make-banner.py
Needs: pip install fonttools brotli

The lockup is embedded from logo/ (masters, unmodified paths). "Design system" is Gilroy ExtraBold and the
tagline is Outfit Regular (wght=400 instance of the variable font), both from fonts/ and converted to outlined
paths so GitHub shows the brand fonts with no font dependency. Kerning is read from the fonts' GPOS pair
adjustments (format 1 and 2); letter-spacing is applied on top. Layout is 1280x320, corner radius 28.
"""
import re
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parents[2]
SWATCHES = ["#142C2A", "#006E63", "#FF7447", "#DFFF8F", "#B5CDFF", "#FFD447", "#FFF4E8"]


def load_font(name, axes=None):
    f = TTFont(ROOT / "fonts" / name)
    if axes:
        f = instancer.instantiateVariableFont(f, axes)
    return f


def pair_kern(font):
    """Return kern(left_glyph, right_glyph) from GPOS 'kern' PairPos lookups."""
    if "GPOS" not in font:
        return lambda a, b: 0
    gpos = font["GPOS"].table
    idx = set()
    for fr in gpos.FeatureList.FeatureRecord:
        if fr.FeatureTag == "kern":
            idx.update(fr.Feature.LookupListIndex)
    subs = []
    for i in sorted(idx):
        for st in gpos.LookupList.Lookup[i].SubTable:
            if st.LookupType == 9:
                st = st.ExtSubTable
            if hasattr(st, "PairSet") or hasattr(st, "Class1Record"):
                subs.append(st)

    def val(v):
        return getattr(v, "XAdvance", 0) or 0 if v is not None else 0

    def kern(a, b):
        for st in subs:
            if getattr(st, "Format", 0) == 1:
                cov = st.Coverage.glyphs
                if a in cov:
                    for pv in st.PairSet[cov.index(a)].PairValueRecord:
                        if pv.SecondGlyph == b:
                            return val(pv.Value1)
            elif getattr(st, "Format", 0) == 2:
                if a in st.Coverage.glyphs:
                    c1 = st.ClassDef1.classDefs.get(a, 0)
                    c2 = st.ClassDef2.classDefs.get(b, 0)
                    v = val(st.Class1Record[c1].Class2Record[c2].Value1)
                    if v:
                        return v
        return 0

    return kern


def text_path(font, text, size, x, y, tracking=0.0):
    """Outline `text` with baseline at (x, y); returns one SVG path 'd' string."""
    cmap = font.getBestCmap()
    gs = font.getGlyphSet()
    kern = pair_kern(font)
    s = size / font["head"].unitsPerEm
    names = [cmap[ord(c)] for c in text]
    d, pen_x = [], 0.0
    for i, n in enumerate(names):
        pen = SVGPathPen(gs, ntos=lambda v: ("%.2f" % v).rstrip("0").rstrip("."))
        gs[n].draw(TransformPen(pen, (s, 0, 0, -s, x + pen_x, y)))
        d.append(pen.getCommands())
        pen_x += gs[n].width * s + tracking
        if i + 1 < len(names):
            pen_x += kern(n, names[i + 1]) * s
    return "".join(d)


def lockup(name):
    svg = (ROOT / "logo" / name).read_text(encoding="utf-8")
    svg = re.sub(r"^<svg[^>]*>", "", svg.strip())
    svg = re.sub(r"</svg>\s*$", "", svg)
    return re.sub(r"clip0_2_\d+", "lk", svg)


def build(dark, title_font, body_font):
    bg, ink = ("#000000", "#FFF4E8") if dark else ("#FFF4E8", "#142C2A")
    sub = "#C8C8C8" if dark else "#3E5654"
    w, g, h = 60, 12, 150
    x0, y0 = 1280 - 96 - (7 * w + 6 * g), 85
    sws = "".join(
        f'<rect x="{x0 + i * (w + g)}" y="{y0 + (14 if i % 2 else 0)}" width="{w}" height="{h - 14}" rx="14" '
        f'fill="{c}" stroke="{"#3A3A3A" if dark else "#142C2A"}" stroke-opacity="{1 if dark else 0.18}" stroke-width="1"/>'
        for i, c in enumerate(SWATCHES)
    )
    t1 = text_path(title_font, "Design system", 56, 80, 188, -1.5)
    t2 = text_path(body_font, "Logo, colour, type, tokens, motion and UX", 20, 80, 236)
    t3 = text_path(body_font, "for every Space Works product.", 20, 80, 262)
    logo = lockup("lockup-horizontal-reversed.svg" if dark else "lockup-horizontal.svg")
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="320" viewBox="0 0 1280 320" role="img" aria-labelledby="t d">
<title id="t">Space Works Design system</title>
<desc id="d">Space Works Design system. Logo, colour, type, tokens, motion and UX for every Space Works product.</desc>
<defs><clipPath id="card"><rect width="1280" height="320" rx="28"/></clipPath></defs>
<g clip-path="url(#card)">
<rect width="1280" height="320" fill="{bg}"/>
<svg x="80" y="60" width="285" height="46" viewBox="0 0 360 58" fill="none">{logo}</svg>
<path fill="{ink}" d="{t1}"/>
<path fill="{sub}" d="{t2}{t3}"/>
{sws}
</g>
</svg>
'''


if __name__ == "__main__":
    title_font = load_font("Gilroy-ExtraBold.woff2")
    body_font = load_font("Outfit-Variable.woff2", {"wght": 400})
    for dark, name in ((False, "light"), (True, "dark")):
        out = ROOT / "brand" / "readme" / f"banner-{name}.svg"
        svg = build(dark, title_font, body_font)
        out.write_text(svg, encoding="utf-8", newline="\n")
        print(out, len(svg.encode()), "bytes")
