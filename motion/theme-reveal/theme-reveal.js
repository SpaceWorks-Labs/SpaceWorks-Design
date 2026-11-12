// Space Works theme switch, framework-free classic script (works from file://, a <script> tag or a bundler import).
// Mirror of frontend/src/lib/themeTransition.ts + theme.ts. Exposes window.SwThemeReveal = { switchTheme, applyTheme }.
//
//   <link rel="stylesheet" href="theme-reveal.css"><script src="theme-reveal.js"></script>
//   button.onclick = () => SwThemeReveal.switchTheme(isDark ? "light" : "dark", button);
//
// Needs theme-reveal.css. The theme is always applied, even when an animation API is missing or throws.
(function () {
const DEFAULT_KEY = "makerspace.theme";
const FEATHER = 160;
const TIMING = { duration: 720, easing: "cubic-bezier(0.45, 0, 0.2, 1)" };
const DARK_QUERY = "(prefers-color-scheme: dark)";

const systemDark = () => { try { return matchMedia(DARK_QUERY).matches; } catch { return false; } };

/** Paint a theme now, no animation. `next` is "light", "dark" or "system". */
function applyTheme(next, { storageKey = DEFAULT_KEY, onApply } = {}) {
  try { localStorage.setItem(storageKey, next); } catch { /* private window: still apply for this session */ }
  const dark = next === "dark" || (next === "system" && systemDark());
  document.documentElement.classList.toggle("dark", dark);
  const chrome = document.querySelector('meta[name="theme-color"]');
  if (chrome) chrome.content = dark ? "#000000" : "#FFF4E8";
  onApply?.(dark);
}

const supportsFeather = () =>
  typeof CSS !== "undefined" && typeof CSS.registerProperty === "function"
  && CSS.supports?.("mask-image", "radial-gradient(circle, #000, transparent)") === true;

function originOf(el) {
  if (!el) return { x: window.innerWidth - 40, y: 32 };
  const box = el.getBoundingClientRect();
  return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
}

/** Switch theme with the circle reveal growing from `originEl` (a toggle button). */
function switchTheme(next, originEl, options = {}) {
  const apply = () => (options.apply ? options.apply(next) : applyTheme(next, options)); // options.apply replaces the default painting (scoped demos)
  const root = document.documentElement;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { apply(); return; }
  if (typeof document.startViewTransition !== "function") {
    // Cross-fade fallback: every colour transitions together for 420 ms.
    root.classList.add("sw-theme-fade");
    apply();
    setTimeout(() => root.classList.remove("sw-theme-fade"), 460);
    return;
  }

  root.removeAttribute("data-sw-vt"); // a route transition in flight would name a content region; we need one whole-page snapshot
  const { x, y } = originOf(originEl);
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + FEATHER;
  const feathered = supportsFeather();
  root.style.setProperty("--sw-reveal-x", `${x}px`);
  root.style.setProperty("--sw-reveal-y", `${y}px`);
  root.classList.add(feathered ? "sw-theme-reveal-soft" : "sw-theme-reveal");
  const cleanUp = () => {
    root.classList.remove("sw-theme-reveal", "sw-theme-reveal-soft");
    root.style.removeProperty("--sw-reveal-x");
    root.style.removeProperty("--sw-reveal-y");
  };

  let applied = false;
  const update = () => { applied = true; apply(); };
  const recover = () => { if (!applied) update(); cleanUp(); };
  try {
    const transition = document.startViewTransition(update);
    transition.ready.then(() => {
      // fill: "forwards" holds the final frame; without it the mask snaps back for one frame and flashes the old theme.
      root.animate?.(
        feathered
          ? { "--sw-reveal": ["0px", `${radius}px`] }
          : { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { ...TIMING, fill: "forwards", pseudoElement: "::view-transition-new(root)" },
      );
    }).catch(recover);
    transition.finished.then(cleanUp, recover);
  } catch { recover(); }
}

const api = { switchTheme, applyTheme };
if (typeof window !== "undefined") window.SwThemeReveal = api;
if (typeof module !== "undefined") module.exports = api;
})();
