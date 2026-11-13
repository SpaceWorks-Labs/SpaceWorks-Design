import { useEffect, useId, useRef } from 'react';
import '../overlays.js';
import '../overlays.css';

/** Token-styled, frame-contained kit demo. App component references are kept alongside it. */
export function OverlaysDemo() {
  const root = useRef<HTMLDivElement>(null);
  const prefix = useId();
  useEffect(() => root.current ? globalThis.SwOverlays.initOverlays(root.current) : undefined, []);
  return <div ref={root}>
  <div className="sw-ov-controls" id={`${prefix}-controls`}>
    <button type="button" className="sw-ov-btn" data-open="dialog">Dialog (pop)</button>
    <button type="button" className="sw-ov-btn" data-open="sheet">Sheet</button>
    <button type="button" className="sw-ov-btn" data-open="right">Drawer right</button>
    <button type="button" className="sw-ov-btn" data-open="left">Drawer left</button>
    <button type="button" className="sw-ov-btn" data-open="menu">Menu</button>
  </div>
  <p className="sw-ov-status" id={`${prefix}-status`} role="status" aria-live="polite">No layer open.</p>

  <div className="sw-ov-frame" id={`${prefix}-frame`}>
    <div className="sw-ov-bar"><strong>Workshop console</strong>
      <span className="sw-ov-anchor" id={`${prefix}-anchor`}><button type="button" className="sw-ov-btn ghost" id={`${prefix}-actions`} data-actions="" aria-haspopup="menu" aria-expanded="false" aria-controls={`${prefix}-menu`}>Actions</button>
</span></div>
        <ul className="sw-ov-menu sw-fx-menu" id={`${prefix}-menu`} role="menu" aria-label="Actions" hidden data-state="closed">
          <li role="none"><button type="button" role="menuitem" tabIndex={-1}>Edit</button></li><li role="none"><button type="button" role="menuitem" tabIndex={-1}>Duplicate</button></li><li role="none"><button type="button" role="menuitem" tabIndex={-1}>Archive</button></li>
        </ul>
    <div className="sw-ov-page"><i></i><i style={{ width: '70%' }}></i><i style={{ width: '45%' }}></i></div>

    <div className="sw-ov-layer sw-ov-scrim sw-fx-fade" id={`${prefix}-dialog`} data-layer="dialog" hidden data-state="closed">
      <div className="sw-ov-panel sw-ov-dialog sw-fx-pop" role="dialog" aria-modal="true" aria-labelledby={`${prefix}-dialog-t`} tabIndex={-1} data-state="closed">
        <div className="sw-ov-handle" aria-hidden="true"></div>
        <div className="sw-ov-head"><h2 id={`${prefix}-dialog-t`}>Hand over this tool?</h2></div>
        <div className="sw-ov-body"><button type="button" className="sw-ov-btn ghost" data-open="sheet">Switch to sheet</button><p>The scrim fades in and the dialog pops from just in front (scale 0.98, 4 px).</p></div>
        <div className="sw-ov-foot"><button type="button" className="sw-ov-btn ghost" data-close="">Cancel</button><button type="button" className="sw-ov-btn" data-close="">Confirm</button></div>
      </div>
    </div>

    <div className="sw-ov-layer sheet sw-ov-scrim sw-fx-fade" id={`${prefix}-sheet`} data-layer="sheet" hidden data-state="closed">
      <div className="sw-ov-panel sw-ov-sheet sw-fx-pop" role="dialog" aria-modal="true" aria-labelledby={`${prefix}-sheet-t`} tabIndex={-1} data-state="closed">
        <div className="sw-ov-handle" aria-hidden="true"></div>
        <div className="sw-ov-head"><h2 id={`${prefix}-sheet-t`}>Filter requests</h2></div>
        <div className="sw-ov-body"><button type="button" className="sw-ov-btn ghost" data-open="sheet">Switch to sheet</button><p>On phones the dialog becomes a bottom sheet: it docks to the bottom edge and rises instead of scaling.</p><p>Content scrolls inside while the header and footer stay put.</p></div>
        <div className="sw-ov-foot"><button type="button" className="sw-ov-btn ghost" data-close="">Cancel</button><button type="button" className="sw-ov-btn" data-close="">Apply</button></div>
      </div>
    </div>

    <div className="sw-ov-layer edge-right sw-ov-scrim sw-fx-fade" id={`${prefix}-right`} data-layer="right" hidden data-state="closed">
      <aside className="sw-ov-panel sw-ov-drawer sw-fx-drawer" role="dialog" aria-modal="true" aria-labelledby={`${prefix}-right-t`} tabIndex={-1} data-state="closed">
        <div className="sw-ov-head"><h2 id={`${prefix}-right-t`}>Detail drawer</h2><button type="button" className="sw-ov-btn ghost" data-close="">Close</button></div>
        <div className="sw-ov-body"><button type="button" className="sw-ov-btn ghost" data-open="sheet">Switch to sheet</button><p>Slides from the right edge, full height of the frame.</p><p>Closing slides it back the way it came.</p></div>
      </aside>
    </div>

    <div className="sw-ov-layer edge-left sw-ov-scrim sw-fx-fade" id={`${prefix}-left`} data-layer="left" hidden data-state="closed">
      <aside className="sw-ov-panel sw-ov-drawer sw-fx-drawer" data-edge="left" role="dialog" aria-modal="true" aria-labelledby={`${prefix}-left-t`} tabIndex={-1} data-state="closed">
        <div className="sw-ov-head"><h2 id={`${prefix}-left-t`}>Sidebar drawer</h2><button type="button" className="sw-ov-btn ghost" data-close="">Close</button></div>
        <div className="sw-ov-body"><button type="button" className="sw-ov-btn ghost" data-open="sheet">Switch to sheet</button><p>The left-edge variant (<code>data-edge="left"</code>) slides from the left.</p></div>
      </aside>
    </div>
  </div>
  </div>;
}
