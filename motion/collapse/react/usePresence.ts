import { useEffect, useRef, useState, useSyncExternalStore, type AnimationEvent } from "react";
import { canAnimate, MOTION_MS } from "./motion";

function subscribeAnimation(notify: () => void) {
  if (typeof window === "undefined") return () => {};
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  preference.addEventListener("change", notify);
  return () => preference.removeEventListener("change", notify);
}

/**
 * Keeps an overlay mounted while its exit animation plays.
 *
 * `present` replaces the `if (!open) return null` guard; `closing` is true during the exit (put it
 * on `data-state`, and make the layer inert so it cannot take focus or clicks). Without animation
 * support (tests, reduced motion) `present === open`, so unmounting stays immediate. The timer is
 * the safety net: `onAnimationEnd` finishes early, the timeout finishes if no animation ever ran.
 */
export function usePresence(open: boolean, exitMs: number = MOTION_MS.exit) {
  const [kept, setKept] = useState(open);
  if (open && !kept) setKept(true);
  const animated = useSyncExternalStore(subscribeAnimation, canAnimate, () => false);
  useEffect(() => {
    if (open || !kept) return;
    if (!animated) { setKept(false); return; }
    const timer = setTimeout(() => setKept(false), exitMs);
    return () => clearTimeout(timer);
  }, [open, kept, animated, exitMs]);
  const present = open || (kept && animated);
  const closing = !open && present;
  const onAnimationEnd = (event: AnimationEvent<HTMLElement>) => {
    if (closing && event.target === event.currentTarget) setKept(false);
  };
  return { present, closing, state: closing ? "closed" : "open", onAnimationEnd } as const;
}

type Exiting<T> = { item: T; leaving: boolean };

/** Like usePresence for a list: rows that vanish from `items` stay, flagged `leaving`, until their exit ends. */
export function useExitingItems<T>(items: readonly T[], keyOf: (item: T) => string | number, exitMs: number = MOTION_MS.exit): Exiting<T>[] {
  const animated = useSyncExternalStore(subscribeAnimation, canAnimate, () => false);
  const [view, setView] = useState<Exiting<T>[]>(() => items.map(item => ({ item, leaving: false })));
  const timers = useRef(new Map<string | number, ReturnType<typeof setTimeout>>());
  const keyRef = useRef(keyOf);
  keyRef.current = keyOf;
  useEffect(() => {
    if (!animated) { timers.current.forEach(clearTimeout); timers.current.clear(); setView(items.map(item => ({ item, leaving: false }))); return; }
    setView(previous => {
      const live = new Map(items.map(item => [keyRef.current(item), item] as const));
      const merged: Exiting<T>[] = [];
      const seen = new Set<string | number>();
      for (const row of previous) {
        const key = keyRef.current(row.item);
        const current = live.get(key);
        if (current !== undefined) { const timer = timers.current.get(key); if (timer) clearTimeout(timer); timers.current.delete(key); merged.push({ item: current, leaving: false }); seen.add(key); }
        else merged.push({ item: row.item, leaving: true });
      }
      for (const item of items) if (!seen.has(keyRef.current(item))) merged.push({ item, leaving: false });
      merged.filter(row => row.leaving).forEach(row => {
        const key = keyRef.current(row.item);
        if (timers.current.has(key)) return;
        timers.current.set(key, setTimeout(() => {
          timers.current.delete(key);
          setView(current => current.filter(entry => keyRef.current(entry.item) !== key || !entry.leaving));
        }, exitMs));
      });
      return merged;
    });
  }, [items, animated, exitMs]);
  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);
  return animated ? view : items.map(item => ({ item, leaving: false }));
}
