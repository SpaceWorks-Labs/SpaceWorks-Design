import { useEffect } from "react";
import { eggsAllowed, useDelight, useReducedMotion } from "./DelightProvider";
import "./logoUnfold.css";

/**
 * The box logo unfold. Marks the page so logoUnfold.css may open the logo's flaps on hover and
 * focus, and plays one open-and-shut spring on each logo click. `onLogoClick` receives every
 * click on a `[data-logo]` (Maker mode counts them). Nothing here is announced or focusable.
 */
export function LogoDelight({ pathname, onLogoClick }: { pathname: string; onLogoClick?: () => void }) {
  const { enabled } = useDelight();
  const reduced = useReducedMotion();
  const active = enabled && eggsAllowed(pathname);
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    root.setAttribute("data-sw-delight", "");
    return () => root.removeAttribute("data-sw-delight");
  }, [active]);
  useEffect(() => {
    const running = new Set<HTMLElement>();
    const clicked = (event: MouseEvent) => {
      const logo = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-logo]") : null;
      if (!logo) return;
      onLogoClick?.();
      if (!active || reduced) return;
      // Restart the spring when clicks come quickly: drop the mark, force a style flush, set it again.
      if (running.has(logo)) return;
      running.add(logo); logo.setAttribute("data-logo-pop", "");
      const animations = logo.getAnimations({ subtree: true });
      Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
        if (!running.has(logo)) return;
        running.delete(logo); logo.removeAttribute("data-logo-pop");
      });
    };
    document.addEventListener("click", clicked);
    return () => { document.removeEventListener("click", clicked); running.forEach(logo => logo.removeAttribute("data-logo-pop")); running.clear(); };
  }, [active, reduced, onLogoClick]);
  return null;
}
