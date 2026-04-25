// Once the SPA hydrates, @unhead/vue takes over <head> management. The
// Netlify edge function tags title / meta / canonical / og with values we
// CAN dedupe safely (@unhead treats meta[name], meta[property] and
// link[rel=canonical] as having stable keys), but JSON-LD <script> blocks
// have no natural dedupe key. The edge function marks its injected script
// with `data-nr-seo="route"`; we strip those on startup so the client-side
// useHead() call is free to emit the fresh structured-data block without
// leaving behind a stale copy.
//
// This is a one-shot cleanup and costs ~1ms in the DOM.

export function cleanupEdgeInjectedStructuredData() {
    if (typeof document === 'undefined') return;
    const stale = document.querySelectorAll('script[data-nr-seo="route"]');
    stale.forEach((node) => node.parentNode?.removeChild(node));
}
