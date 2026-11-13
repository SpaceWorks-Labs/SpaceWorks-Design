import { useEffect, useRef } from 'react';
import '../toast.js';
import '../../flow.js';
import '../toast.css';

/** Portable adapter; ToastHost.tsx alongside it remains the app integration reference. */
export function ToastDemo() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const api = (globalThis as typeof globalThis & { SwToasts: { initToasts: (node: HTMLElement) => { destroy: () => void } } }).SwToasts.initToasts(root.current!);
    return () => api.destroy();
  }, []);
  return <div ref={root}>
    <button type="button" data-t="ok">Saved</button><button type="button" data-t="err">Error</button>
    <div data-toast-status="" role="status" aria-atomic="true" />
    <div data-toast-alert="" role="alert" aria-atomic="true" />
    <div data-toast-stack="" aria-label="Notifications" />
  </div>;
}
