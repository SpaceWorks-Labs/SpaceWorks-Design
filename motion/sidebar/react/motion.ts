// Motion constants shared by every hook here. The CSS twins live in src/index.css (--sw-dur-*),
// keep the two in step: a JS exit timer shorter than its CSS exit animation would cut it off.
const tokenMs = (name: string) => {
  if (typeof document === "undefined") return 0;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return (parseFloat(value) || 0) * (value.endsWith("ms") ? 1 : 1000);
};
export const MOTION_MS = {
  get fast() { return tokenMs("--sw-dur-fast"); },
  get base() { return tokenMs("--sw-dur-base"); },
  get slow() { return tokenMs("--sw-dur-slow"); },
  get exit() { return tokenMs("--sw-dur-base") * .75; },
};

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
}

/**
 * True only where animations really run. jsdom has no Web Animations API, so unit tests see
 * `false` and every exit unmounts immediately; reduced-motion users get the same instant path.
 */
export function canAnimate(): boolean {
  return typeof document !== "undefined" && typeof document.getAnimations === "function" && !prefersReducedMotion();
}
