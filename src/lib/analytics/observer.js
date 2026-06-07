// IntersectionObserver helper for batching list-impression analytics
// events (`view_item_list` on the SRP). One event per scroll session
// rather than one per card, per plan.md §2.5 / events.csv.
//
// SSR-safe: factory returns no-op handles when `window` or
// `IntersectionObserver` is unavailable (vite-ssg prerender, jsdom
// test envs without polyfill).
//
// Usage:
//   const tracker = createListImpressionTracker({
//     funnel_name: 'booking',
//     getItemMeta: (id) => ({ item_id: id, item_name, price }),
//   });
//   tracker.observe(el, spotId);
//   // ... later, on unmount:
//   tracker.disconnect();

import { track } from './index.js';
import { EVENTS } from './schema.js';

const FLUSH_DEBOUNCE_MS = 1000;

function noop() {}

const NOOP_HANDLE = Object.freeze({
    observe: noop,
    unobserve: noop,
    disconnect: noop,
});

/**
 * Build an IntersectionObserver-backed batched impression tracker.
 *
 * @param {Object} opts
 * @param {string} opts.funnel_name           Funnel identifier (e.g. `'booking'`).
 * @param {(id: string) => Object|null} opts.getItemMeta
 *     Maps an item id to its `{ item_id, item_name, price }` payload.
 *     Return `null` to silently skip the impression.
 * @param {number} [opts.stepIndex=3]         Step index per Appendix A.
 * @param {number} [opts.threshold=0.5]       IntersectionObserver threshold.
 * @return {{ observe: (el: Element, id: string) => void,
 *           unobserve: (el: Element) => void,
 *           disconnect: () => void }}
 */
export function createListImpressionTracker({
    funnel_name,
    getItemMeta,
    stepIndex = 3,
    threshold = 0.5,
} = {}) {
    if (
        typeof window === 'undefined' ||
        typeof IntersectionObserver === 'undefined'
    ) {
        return NOOP_HANDLE;
    }

    // Map element -> id so the observer callback can look up which
    // card became visible. WeakMap avoids retaining detached nodes.
    const elementToId = new WeakMap();
    // Track ids already seen this session so we never count a card
    // twice when the user scrolls back up.
    const seenIds = new Set();
    // Pending batch of impressions waiting to be flushed.
    let pending = [];
    let flushTimer = null;

    function scheduleFlush() {
        if (flushTimer) clearTimeout(flushTimer);
        flushTimer = setTimeout(flush, FLUSH_DEBOUNCE_MS);
    }

    function flush() {
        flushTimer = null;
        if (pending.length === 0) return;
        const items = pending;
        pending = [];
        track(EVENTS.VIEW_ITEM_LIST, {
            funnel_name,
            step_index: stepIndex,
            items,
        });
    }

    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                const id = elementToId.get(entry.target);
                if (!id || seenIds.has(id)) continue;
                seenIds.add(id);
                const meta =
                    typeof getItemMeta === 'function' ? getItemMeta(id) : null;
                if (meta) pending.push(meta);
                // Stop watching this card — once seen, never re-fire.
                observer.unobserve(entry.target);
            }
            if (pending.length > 0) scheduleFlush();
        },
        { threshold },
    );

    return {
        observe(el, itemId) {
            if (!el || !itemId) return;
            elementToId.set(el, itemId);
            observer.observe(el);
        },
        unobserve(el) {
            if (!el) return;
            observer.unobserve(el);
        },
        disconnect() {
            if (flushTimer) {
                clearTimeout(flushTimer);
                flushTimer = null;
            }
            // Final flush so impressions seen just before unmount aren't lost.
            flush();
            observer.disconnect();
        },
    };
}
