import type { ReactNode } from "react";

/**
 * Animated show/hide for a region (sidebar "More", accordions). The wrapper with `id` always
 * exists so `aria-controls` keeps pointing somewhere; children are unmounted once closed, so
 * collapsed content is never reachable by Tab, and while closing the region is inert.
 */
export function Collapse({ open, id, className, children }: { open: boolean; id?: string; className?: string; children: ReactNode }) {
  // Keep the reserved surface mounted so a mid-flight toggle never starts from a new node.
  return <div id={id} className={`sw-collapse ${className ?? ""}`} data-state={open ? "open" : "closed"} inert={!open} aria-hidden={!open}>
    <div className="sw-collapse-inner">{children}</div>
  </div>;
}
