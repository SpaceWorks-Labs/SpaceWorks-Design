import {
  FLAP_KEYS, arcOpacity, capOpacity, flapFace, flapTransform, hoverAngle, loopAngle, openAngle, wallOpacity, type FlapKey,
} from "./geometry";

/** Duration of the one-shot opening (ms) and of one loader cycle (ms). */
export const OPEN_MS = 1600;
export const LOOP_MS = 4400;
/** Hover/focus cycle: fold shut (FOLD_MS) then the one-shot opening (OPEN_MS); starts and ends on the resting logo. */
export const FOLD_MS = 600;
export const HOVER_MS = FOLD_MS + OPEN_MS;
/**
 * Flap keyframes are dense (one per frame at 60 fps for the opening) and played with steps(1,end): browsers
 * interpolate two matrix() values by decomposing them, which drifts the hinge and glitches near edge-on, so
 * no flap matrix is ever interpolated. Opacity curves interpolate linearly.
 */
const SAMPLES = 96;
const LOOP_SAMPLES = 160;
const pct = (i: number, n = SAMPLES) => `${Math.round((i / n) * 10000) / 100}%`;
type AngleFn = (key: FlapKey, t: number) => number;

function flapKeyframes(name: string, key: FlapKey, angle: AngleFn, n: number): string {
  const rows: string[] = [];
  let previous = "";
  for (let i = 0; i <= n; i++) {
    const deg = angle(key, i / n);
    const face = flapFace(key, deg);
    // The orange lid half gets a thin ink seam line while shut; at rest the stroke width is 0 (nothing painted).
    const seam = key === "tr" ? `;stroke:var(--sw-seam);stroke-width:${deg > 150 ? 0.45 : 0}px;stroke-linejoin:round` : "";
    const body = `transform:${flapTransform(key, deg)};fill:var(--${face === "c" ? "c" : face === "alt" ? "alt" : "sw-under"})${seam}`;
    if (body !== previous || i === n) rows.push(`${pct(i, n)}{${body}}`);
    previous = body;
  }
  return `@keyframes ${name}-${key}{${rows.join("")}}`;
}

// Every sample is emitted: opacity keyframes interpolate linearly, so dropping unchanged samples would smear a ramp across the gap.
function curveKeyframes(name: string, value: (t: number) => number, n = SAMPLES): string {
  const rows: string[] = [];
  for (let i = 0; i <= n; i++) rows.push(`${pct(i, n)}{opacity:${value(i / n)}}`);
  return `@keyframes ${name}{${rows.join("")}}`;
}

const meanCap = (angle: AngleFn) => (t: number) => capOpacity((["tl", "br"] as const).map(key => angle(key, t)));
const meanWall = (angle: AngleFn) => (t: number) => wallOpacity(FLAP_KEYS.map(key => angle(key, t)));
function arcCurve(key: FlapKey, angle: AngleFn = openAngle, from = 0) {
  const dt = 1 / 400;
  const speed = (t: number) => Math.abs(angle(key, t + dt) - angle(key, t)) / dt;
  let peak = 0;
  for (let i = Math.floor(from * 400); i < 400; i++) peak = Math.max(peak, speed(i / 400));
  // `from`: arcs only show while opening, so the fold that precedes the opening stays dark.
  return (t: number) => (t > 0.97 || t < from ? 0 : arcOpacity(speed(t), peak));
}

const BASE = `.sw-box{position:relative;--sw-under:#354845;--sw-spark:#142C2A;--sw-seam:#142C2A}
html.dark .sw-box{--sw-under:#66625D;--sw-spark:#FFF4E8;--sw-seam:#000}
.sw-box svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.sw-box .dk,html.dark .sw-box .lt{display:none}
html.dark .sw-box .dk{display:block}
.sw-box .f{transform-origin:0 0}
.sw-box .w{fill:#354845;opacity:0}
html.dark .sw-box .w{fill:#FFF4E8;fill-opacity:.14}
.sw-box .a,.sw-box .k,.sw-box .r,.sw-box .p{opacity:0}
.sw-box .a,.sw-box .r{fill:none;stroke:var(--sw-spark);stroke-width:1.1;stroke-linecap:round}
.sw-box .k{fill:var(--sw-spark);transform-box:fill-box;transform-origin:center}
@keyframes sw-box-spark{0%,66%{opacity:0;transform:scale(.3)}77%{opacity:1;transform:scale(1.15)}85%{transform:scale(1)}91%{opacity:1}100%{opacity:0;transform:scale(1)}}
@keyframes sw-box-tick{0%,64%{opacity:0}74%,88%{opacity:1}100%{opacity:0}}
@media (prefers-reduced-motion:reduce){.sw-box .f,.sw-box .w,.sw-box .p,.sw-box .a,.sw-box .k,.sw-box .r{animation:none!important}}`;

function once(): string {
  const run = FLAP_KEYS.map(key => `.sw-box.once .f-${key}{animation:sw-box-${key} ${OPEN_MS}ms steps(1,end) both}`
    + `.sw-box.once .a-${key}{animation:sw-box-a-${key} ${OPEN_MS}ms linear both}`).join("");
  const fx = `.sw-box.once .w{animation:sw-box-w ${OPEN_MS}ms linear both}`
    + `.sw-box.once .p{animation:sw-box-p ${OPEN_MS}ms linear both}`
    + `.sw-box.once .k{animation:sw-box-spark ${OPEN_MS}ms ease-out both}.sw-box.once .r{animation:sw-box-tick ${OPEN_MS}ms linear both}`;
  const frames = FLAP_KEYS.map(key => flapKeyframes("sw-box", key, openAngle, SAMPLES)
    + curveKeyframes(`sw-box-a-${key}`, arcCurve(key))).join("") + curveKeyframes("sw-box-w", meanWall(openAngle)) + curveKeyframes("sw-box-p", meanCap(openAngle));
  return run + fx + frames;
}

function loop(): string {
  const run = FLAP_KEYS.map(key => `.sw-box.loop .f-${key}{animation:sw-boxl-${key} ${LOOP_MS}ms steps(1,end) infinite}`).join("")
    + `.sw-box.loop .w{animation:sw-boxl-w ${LOOP_MS}ms linear infinite}.sw-box.loop .p{animation:sw-boxl-p ${LOOP_MS}ms linear infinite}`;
  return run + FLAP_KEYS.map(key => flapKeyframes("sw-boxl", key, loopAngle, LOOP_SAMPLES)).join("") + curveKeyframes("sw-boxl-w", meanWall(loopAngle)) + curveKeyframes("sw-boxl-p", meanCap(loopAngle));
}

/**
 * Hover/focus cycle (`.sw-box.hov`): fold shut, then open, no hold. Same generators as the loader and the
 * opening; the sparks reuse the opening's timing remapped onto the opening part of the cycle.
 */
function hover(): string {
  const fold = FOLD_MS / HOVER_MS;
  const angle: AngleFn = (key, t) => hoverAngle(key, t, fold);
  const at = (p: number) => `${Math.round((fold + (1 - fold) * p) * 10000) / 100}%`;
  const N = 132;
  const run = FLAP_KEYS.map(key => `.sw-box.hov .f-${key}{animation:sw-boxh-${key} ${HOVER_MS}ms steps(1,end) both}`
    + `.sw-box.hov .a-${key}{animation:sw-boxh-a-${key} ${HOVER_MS}ms linear both}`).join("")
    + `.sw-box.hov .w{animation:sw-boxh-w ${HOVER_MS}ms linear both}.sw-box.hov .p{animation:sw-boxh-p ${HOVER_MS}ms linear both}`
    + `.sw-box.hov .k{animation:sw-boxh-spark ${HOVER_MS}ms ease-out both}.sw-box.hov .r{animation:sw-boxh-tick ${HOVER_MS}ms linear both}`;
  const sparks = `@keyframes sw-boxh-spark{0%,${at(0.66)}{opacity:0;transform:scale(.3)}${at(0.77)}{opacity:1;transform:scale(1.15)}${at(0.85)}{transform:scale(1)}${at(0.91)}{opacity:1}100%{opacity:0;transform:scale(1)}}`
    + `@keyframes sw-boxh-tick{0%,${at(0.64)}{opacity:0}${at(0.74)},${at(0.88)}{opacity:1}100%{opacity:0}}`;
  const frames = FLAP_KEYS.map(key => flapKeyframes("sw-boxh", key, angle, N)
    + curveKeyframes(`sw-boxh-a-${key}`, arcCurve(key, angle, fold), N)).join("")
    + curveKeyframes("sw-boxh-w", meanWall(angle), N) + curveKeyframes("sw-boxh-p", meanCap(angle), N);
  return run + sparks + frames;
}

/** All box CSS. `mode` limits it to what a host needs (index.html only plays the one-shot). */
export function boxOpenCss(mode: "once" | "all" = "all"): string {
  return [BASE, once(), mode === "all" ? `${loop()}
${hover()}` : ""].join("\n");
}

/**
 * Single-colour layer over the same markup and keyframes, for use inside buttons: every face is the
 * host's `currentColor` at a different strength (the flap keyframes read `--c`/`--alt`/`--sw-under`, so
 * overriding those keeps the animation and the cube read). Only the light artwork is shown. Not part of
 * the splash, so index.html stays untouched.
 */
export function boxMonoCss(): string {
  const mix = (n: number) => `color-mix(in srgb,currentColor ${n}%,transparent)`;
  return `.sw-box.mono{--sw-under:${mix(35)}!important;--sw-spark:currentColor;--sw-seam:currentColor}
.sw-box.mono .dk{display:none!important}.sw-box.mono .lt{display:block!important}
.sw-box.mono svg>path:not(.f){fill:currentColor!important}
.sw-box.mono svg>path:not(.f):nth-child(1){fill-opacity:.45}.sw-box.mono svg>path:not(.f):nth-child(2){fill-opacity:.7}
.sw-box.mono .c{fill-opacity:1}
.sw-box.mono .f{--c:currentColor!important;--alt:${mix(60)}!important}
.sw-box.mono .w{fill:currentColor!important;fill-opacity:.25}`;
}
