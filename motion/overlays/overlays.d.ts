export {};
declare global {
  var SwOverlays: {
    /** Installs exclusive, frame-scoped overlay behavior; returns an effect cleanup. */
    initOverlays(root: HTMLElement): () => void;
  };
}
