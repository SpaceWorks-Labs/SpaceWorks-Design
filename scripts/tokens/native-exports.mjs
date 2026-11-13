import { json, nativeName, resolve } from './model.mjs';
const esc = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
const numeric = n => Number.isInteger(n) ? n + '.0' : String(n);
const pixel = v => v.value * (v.unit === 'rem' ? 16 : 1);
const rgb = v => v.components.map(n => Math.round(n * 255));
const androidHex = v => '#' + Math.round(v.alpha * 255).toString(16).padStart(2, '0') + rgb(v).map(n => n.toString(16).padStart(2, '0')).join('');
function kotlin(type, v, token) {
  if (type === 'color') return v.alpha === 1 ? `Color(0x${androidHex(v).slice(1).toUpperCase()})` : `Color(red = ${numeric(v.components[0])}f, green = ${numeric(v.components[1])}f, blue = ${numeric(v.components[2])}f, alpha = ${numeric(v.alpha)}f)`;
  if (type === 'dimension') return `${numeric(pixel(v))}.${token.nativeUnit === 'sp' ? 'sp' : 'dp'}`;
  if (type === 'duration') return Math.round(v.value * (v.unit === 's' ? 1000 : 1)).toString();
  if (type === 'cubicBezier') return `CubicBezierEasing(${v.map(n => numeric(n) + 'f').join(', ')})`;
  if (type === 'fontFamily') return `listOf(${v.map(JSON.stringify).join(', ')})`;
  if (type === 'shadow') return `listOf(${v.map(s => `SwShadow(${kotlin('color', s.color)}, ${kotlin('dimension', s.offsetX, {})}, ${kotlin('dimension', s.offsetY, {})}, ${kotlin('dimension', s.blur, {})}, ${kotlin('dimension', s.spread, {})})`).join(', ')})`;
  if (type === 'typography') return `SwTypography(${kotlin('fontFamily', v.fontFamily)}, ${numeric(pixel(v.fontSize))}.sp, ${v.fontWeight}, ${numeric(pixel(v.fontSize) * v.lineHeight)}.sp, ${numeric(pixel(v.letterSpacing))}.sp)`;
  return type === 'fontWeight' ? String(v) : numeric(v) + 'f';
}
function swift(type, v) {
  if (type === 'color') return `Color(.sRGB, red: ${numeric(v.components[0])}, green: ${numeric(v.components[1])}, blue: ${numeric(v.components[2])}, opacity: ${numeric(v.alpha)})`;
  if (type === 'dimension') return `CGFloat(${numeric(pixel(v))})`;
  if (type === 'duration') return numeric(v.value * (v.unit === 's' ? 1 : 0.001));
  if (type === 'cubicBezier') return `SwCubicBezier(x1: ${numeric(v[0])}, y1: ${numeric(v[1])}, x2: ${numeric(v[2])}, y2: ${numeric(v[3])})`;
  if (type === 'fontFamily') return `[${v.map(JSON.stringify).join(', ')}]`;
  if (type === 'shadow') return `[${v.map(s => `SwShadow(color: ${swift('color', s.color)}, x: ${swift('dimension', s.offsetX)}, y: ${swift('dimension', s.offsetY)}, blur: ${swift('dimension', s.blur)}, spread: ${swift('dimension', s.spread)})`).join(', ')}]`;
  if (type === 'typography') return `SwTypography(families: ${swift('fontFamily', v.fontFamily)}, size: ${swift('dimension', v.fontSize)}, weight: ${v.fontWeight}, lineHeight: CGFloat(${numeric(pixel(v.fontSize) * v.lineHeight)}), tracking: ${swift('dimension', v.letterSpacing)})`;
  return type === 'fontWeight' ? String(v) : numeric(v);
}
export function nativeExports(model) {
  const files = {};
  const kt = ['// Generated. Font registration and accessibility scaling belong to the host app.', 'package design.spaceworks.tokens', '', 'import androidx.compose.ui.graphics.Color', 'import androidx.compose.ui.unit.Dp', 'import androidx.compose.ui.unit.TextUnit', 'import androidx.compose.ui.unit.dp', 'import androidx.compose.ui.unit.sp', 'import androidx.compose.animation.core.CubicBezierEasing', '', 'data class SwShadow(val color: Color, val x: Dp, val y: Dp, val blur: Dp, val spread: Dp)', 'data class SwTypography(val families: List<String>, val size: TextUnit, val weight: Int, val lineHeight: TextUnit, val tracking: TextUnit)', '', 'object SpaceWorksTokens {'];
  const sw = ['// Generated. Dimensions are points; typography must use host Dynamic Type scaling.', 'import SwiftUI', '', 'public struct SwShadow { public let color: Color; public let x, y, blur, spread: CGFloat }', 'public struct SwTypography { public let families: [String]; public let size: CGFloat; public let weight: Int; public let lineHeight, tracking: CGFloat }', 'public struct SwCubicBezier { public let x1, y1, x2, y2: Double }', '', 'public enum SpaceWorksTokens {'];
  for (const mode of model.config.modes) {
    const xml = ['<?xml version="1.0" encoding="utf-8"?>', '<!-- Generated. Composite strings retain DTCG JSON; see ARCHITECTURE.md. -->', '<resources>'];
    kt.push(`  object ${mode === 'light' ? 'Light' : 'Dark'} {`);
    sw.push(`  public enum ${mode === 'light' ? 'Light' : 'Dark'} {`);
    for (const [path, token] of Object.entries(model.tokens)) {
      const v = resolve(model, path, mode), name = nativeName(path);
      let tag = 'string', value = typeof v === 'string' ? v : JSON.stringify(v);
      if (token.type === 'color') { tag = 'color'; value = androidHex(v); }
      else if (token.type === 'dimension') { tag = 'dimen'; value = pixel(v) + (token.nativeUnit === 'sp' ? 'sp' : 'dp'); }
      else if (token.type === 'fontWeight' || token.type === 'duration' || (token.type === 'number' && Number.isInteger(v))) { tag = 'integer'; value = token.type === 'duration' ? Math.round(v.value * (v.unit === 's' ? 1000 : 1)) : v; }
      // Android string resources need quoted JSON: escape quotes/backslashes after XML escaping.
      const body = tag === 'string' ? '"' + esc(String(value).replaceAll('\\', '\\\\').replaceAll('"', '\\"').replaceAll("'", "\\'")) + '"' : value;
      xml.push(`  <${tag} name="${name}"${tag === 'string' ? ' translatable="false"' : ''}>${body}</${tag}>`);
      kt.push(`    val ${name} = ${kotlin(token.type, v, token)}`);
      sw.push(`    public static let ${name} = ${swift(token.type, v)}`);
    }
    xml.push('</resources>', ''); kt.push('  }'); sw.push('  }');
    files[`tokens/android/${mode === 'light' ? 'values' : 'values-night'}/tokens.xml`] = xml.join('\n');
  }
  kt.push('}', ''); sw.push('}', '');
  files['tokens/android/SpaceWorksTokens.kt'] = kt.join('\n');
  files['tokens/ios/SpaceWorksTokens.swift'] = sw.join('\n');
  files['tokens/ios/SpaceWorks.xcassets/Contents.json'] = json({ info: { author: 'SpaceWorks', version: 1 } });
  for (const [path, token] of Object.entries(model.tokens)) if (token.type === 'color' && !path.startsWith('primitive.')) {
    const colors = model.config.modes.map(mode => {
      const c = resolve(model, path, mode);
      return { idiom: 'universal', ...(mode === 'dark' ? { appearances: [{ appearance: 'luminosity', value: 'dark' }] } : {}), color: { 'color-space': 'srgb', components: { red: String(c.components[0]), green: String(c.components[1]), blue: String(c.components[2]), alpha: String(c.alpha) } } };
    });
    files[`tokens/ios/SpaceWorks.xcassets/${nativeName(path)}.colorset/Contents.json`] = json({ colors, info: { author: 'SpaceWorks', version: 1 } });
  }
  return files;
}
