// PR-5 of conversion-tracking. Pin the contract of
// createListImpressionTracker so a future SRP refactor can't quietly
// re-introduce per-card view_item_list events (which would inflate
// impression counts) or break the SSR no-op handle (which would crash
// vite-ssg prerender).
//
// What we assert:
//   - Returns a no-op handle when IntersectionObserver is unavailable
//     (SSR / prerender / older jsdom envs).
//   - Calls track('view_item_list', {...}) once with all batched items
//     after the debounce window elapses.
//   - Already-seen ids never re-fire even if the same element is
//     observed twice.
//   - disconnect() flushes pending impressions and stops further events.
//   - Items whose getItemMeta() returns null are silently skipped.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the public analytics module so we can assert against `track`
// calls without going through the full dataLayer pipeline. The
// observer imports `track` from `./index.js`, so the relative-path
// mock specifier matches what observer.js sees.
vi.mock('@/lib/analytics/index.js', () => ({
    track: vi.fn(),
}));

import { track } from '@/lib/analytics/index.js';
import { createListImpressionTracker } from '@/lib/analytics/observer.js';

// Tiny IntersectionObserver mock that lets the test control which
// targets become "visible" and when. Mirrors only the surface the
// observer module actually uses: observe, unobserve, disconnect, and
// the constructor signature.
class FakeIntersectionObserver {
    constructor(callback, options) {
        this.callback = callback;
        this.options = options;
        this.targets = new Set();
        FakeIntersectionObserver.instances.push(this);
    }
    observe(el) {
        this.targets.add(el);
    }
    unobserve(el) {
        this.targets.delete(el);
    }
    disconnect() {
        this.targets.clear();
    }
    // Test helper — fire the callback as if the given elements just
    // crossed the threshold.
    trigger(els) {
        const entries = els.map((el) => ({
            target: el,
            isIntersecting: true,
        }));
        this.callback(entries, this);
    }
}
FakeIntersectionObserver.instances = [];

describe('analytics/observer — createListImpressionTracker', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        FakeIntersectionObserver.instances = [];
        // Reinstall the mock on each test so the module sees a clean
        // global. vi.stubGlobal would also work but reassignment is
        // simpler here and observer.js reads the constructor via a
        // bare reference, not via globalThis.
        globalThis.IntersectionObserver = FakeIntersectionObserver;
        track.mockClear();
    });

    afterEach(() => {
        vi.useRealTimers();
        delete globalThis.IntersectionObserver;
    });

    it('returns an SSR no-op handle when IntersectionObserver is unavailable', () => {
        // Stash the constructor away; the factory's first guard should
        // hand back the frozen no-op without throwing.
        delete globalThis.IntersectionObserver;
        const tracker = createListImpressionTracker({
            funnel_name: 'booking',
            getItemMeta: () => ({ item_id: 'x' }),
        });
        expect(typeof tracker.observe).toBe('function');
        expect(typeof tracker.unobserve).toBe('function');
        expect(typeof tracker.disconnect).toBe('function');
        // Calling the no-op methods must not throw or fire `track`.
        const el = {};
        tracker.observe(el, 'spot-1');
        tracker.disconnect();
        expect(track).not.toHaveBeenCalled();
    });

    it('flushes batched view_item_list once after the debounce window', () => {
        const meta = {
            'spot-1': { item_id: 'spot-1', item_name: 'A', price: 100 },
            'spot-2': { item_id: 'spot-2', item_name: 'B', price: 200 },
        };
        const tracker = createListImpressionTracker({
            funnel_name: 'booking',
            getItemMeta: (id) => meta[id] || null,
        });
        const el1 = { tag: 'el1' };
        const el2 = { tag: 'el2' };
        tracker.observe(el1, 'spot-1');
        tracker.observe(el2, 'spot-2');

        // Both cards cross the viewport in quick succession.
        const obs = FakeIntersectionObserver.instances[0];
        obs.trigger([el1, el2]);

        // Pre-debounce: no event yet — the tracker is collecting.
        expect(track).not.toHaveBeenCalled();

        // Advance past the 1s debounce window.
        vi.advanceTimersByTime(1000);
        expect(track).toHaveBeenCalledTimes(1);
        const [event, params] = track.mock.calls[0];
        expect(event).toBe('view_item_list');
        expect(params).toMatchObject({
            funnel_name: 'booking',
            step_index: 3,
        });
        expect(params.items).toHaveLength(2);
        expect(params.items.map((i) => i.item_id).sort()).toEqual([
            'spot-1',
            'spot-2',
        ]);
    });

    it('does not re-fire for ids already seen this session', () => {
        const meta = (id) => ({ item_id: id, item_name: id, price: 0 });
        const tracker = createListImpressionTracker({
            funnel_name: 'booking',
            getItemMeta: meta,
        });
        const el = { tag: 'card' };
        tracker.observe(el, 'spot-X');

        const obs = FakeIntersectionObserver.instances[0];
        obs.trigger([el]);
        vi.advanceTimersByTime(1000);
        expect(track).toHaveBeenCalledTimes(1);

        // Re-observe and re-trigger the same id. The observer should
        // have stopped watching this card (it's in `seenIds`), and even
        // if the trigger somehow gets through, no new event fires.
        track.mockClear();
        tracker.observe(el, 'spot-X');
        obs.trigger([el]);
        vi.advanceTimersByTime(1000);
        expect(track).not.toHaveBeenCalled();
    });

    it('disconnect() flushes any pending impressions and stops further events', () => {
        const meta = (id) => ({ item_id: id, item_name: id, price: 0 });
        const tracker = createListImpressionTracker({
            funnel_name: 'booking',
            getItemMeta: meta,
        });
        const el = { tag: 'card' };
        tracker.observe(el, 'spot-Y');
        const obs = FakeIntersectionObserver.instances[0];
        obs.trigger([el]);

        // Mid-debounce: nothing fired yet.
        vi.advanceTimersByTime(200);
        expect(track).not.toHaveBeenCalled();

        // Disconnect should flush the pending batch synchronously so
        // impressions seen just before unmount aren't lost.
        tracker.disconnect();
        expect(track).toHaveBeenCalledTimes(1);
        expect(track.mock.calls[0][0]).toBe('view_item_list');

        // Subsequent triggers must be ignored — disconnect is final.
        track.mockClear();
        obs.trigger([el]);
        vi.advanceTimersByTime(2000);
        expect(track).not.toHaveBeenCalled();
    });

    it('silently skips ids whose getItemMeta returns null', () => {
        const tracker = createListImpressionTracker({
            funnel_name: 'booking',
            getItemMeta: (id) =>
                id === 'known'
                    ? { item_id: 'known', item_name: 'K', price: 1 }
                    : null,
        });
        const known = { tag: 'k' };
        const unknown = { tag: 'u' };
        tracker.observe(known, 'known');
        tracker.observe(unknown, 'unknown-id');

        const obs = FakeIntersectionObserver.instances[0];
        obs.trigger([known, unknown]);
        vi.advanceTimersByTime(1000);

        expect(track).toHaveBeenCalledTimes(1);
        const params = track.mock.calls[0][1];
        expect(params.items).toEqual([
            { item_id: 'known', item_name: 'K', price: 1 },
        ]);
    });
});
