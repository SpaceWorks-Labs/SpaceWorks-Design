import { useState, type ReactNode } from "react";
import { eggsAllowed, useDelight, useReducedMotion } from "../delight/DelightProvider";

/**
 * A layout container whose first ~8 children fade and rise in a short stagger the first time it
 * mounts (layouts.css `.sw-stagger`: 30 ms apart, 210 ms spread at most). The class is dropped after
 * the first run, so refetches, pagination and tab changes never replay it. Delight only: nothing
 * under reduced motion, and never on kiosk, scanner, checkout or payment paths.
 */
export function StaggerGroup({ className = "", children }: { className?: string; children: ReactNode }) {
  const { enabled } = useDelight();
  const reduced = useReducedMotion();
  const [first, setFirst] = useState(true);
  const stagger = first && enabled && !reduced && eggsAllowed(window.location.pathname);
  return <div onAnimationEnd={event => { if (event.target === event.currentTarget.children[Math.min(7, event.currentTarget.children.length - 1)]) setFirst(false); }} className={`${className}${stagger ? " sw-stagger" : ""}`}>{children}</div>;
}
