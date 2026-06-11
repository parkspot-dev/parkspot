// PR-5 of conversion-tracking. PageThankYou is shared by both lead
// funnels (PR-4: ?from=vo|so|contact -> lead_confirmed) and the
// booking funnel (PR-5: ?from=booking&t=<id> -> purchase_confirmed).
// The lead-funnel branches were exercised indirectly by PR-4's
// updates to PageVOPortal/PageHome/PageBlogPost (those tests assert
// the redirect query); this spec pins the booking-confirmation
// branch end-to-end so a future router/redirect change can't quietly
// stop firing the GA4 sanity event.
//
// What we assert:
//   - `?from=booking&t=<id>` fires `purchase_confirmed` exactly once
//     with funnel_name=booking and the forwarded transaction_id
//     coerced to a string.
//   - `?from=booking` without `?t=` fires nothing (schema requires
//     transaction_id; a missing id means a stale bookmark / direct
//     visit, which we deliberately ignore).
//   - `?from=vo` still fires `lead_confirmed` (regression guard for
//     PR-4 behaviour after PR-5's branch addition).
//   - No `?from=` at all is a silent no-op (no event, no throw).
import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock the public analytics module so we can assert against `track`
// calls without going through dataLayer. The view imports `track`
// and `EVENTS` from `@/lib/analytics` — re-export EVENTS so the
// component sees the same enum strings the real module exposes.
vi.mock('@/lib/analytics', async () => {
    const real = await vi.importActual('@/lib/analytics/schema.js');
    return {
        track: vi.fn(),
        EVENTS: real.EVENTS,
    };
});

import { track, EVENTS } from '@/lib/analytics';
import PageThankYou from '@/views/PageThankYou.vue';

const mountWithRoute = (route) =>
    mount(PageThankYou, {
        global: {
            mocks: {
                $route: route,
                $router: { push: vi.fn() },
            },
            stubs: {
                TemplateThankYou: {
                    name: 'TemplateThankYou',
                    template: '<div data-testid="thank-you" />',
                    props: ['msg'],
                    emits: ['home-btn'],
                },
            },
        },
    });

describe('PageThankYou.vue — funnel confirmation events', () => {
    beforeEach(() => {
        track.mockClear();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('fires purchase_confirmed when ?from=booking&t=<id> is present', () => {
        const wrapper = mountWithRoute({
            params: { msg: 'You have paid the amount.' },
            query: { from: 'booking', t: 'PAY_4242' },
        });
        expect(track).toHaveBeenCalledTimes(1);
        const [event, params] = track.mock.calls[0];
        expect(event).toBe(EVENTS.PURCHASE_CONFIRMED);
        expect(params).toEqual({
            funnel_name: 'booking',
            transaction_id: 'PAY_4242',
        });
        wrapper.unmount();
    });

    it('coerces a numeric transaction_id to a string', () => {
        const wrapper = mountWithRoute({
            params: { msg: '' },
            query: { from: 'booking', t: 4242 },
        });
        expect(track).toHaveBeenCalledTimes(1);
        const params = track.mock.calls[0][1];
        expect(params.transaction_id).toBe('4242');
        expect(typeof params.transaction_id).toBe('string');
        wrapper.unmount();
    });

    it('fires nothing on ?from=booking without ?t= (missing required transaction_id)', () => {
        const wrapper = mountWithRoute({
            params: { msg: '' },
            query: { from: 'booking' },
        });
        expect(track).not.toHaveBeenCalled();
        wrapper.unmount();
    });

    it('still fires lead_confirmed for ?from=vo (PR-4 regression guard)', () => {
        const wrapper = mountWithRoute({
            params: { msg: '' },
            query: { from: 'vo' },
        });
        expect(track).toHaveBeenCalledTimes(1);
        expect(track.mock.calls[0]).toEqual([
            EVENTS.LEAD_CONFIRMED,
            { funnel_name: 'vo_lead' },
        ]);
        wrapper.unmount();
    });

    it('is a silent no-op when ?from= is absent entirely', () => {
        // Suppress the dev-mode warning the component emits for
        // missing/unknown ?from= so the test output stays clean.
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const wrapper = mountWithRoute({
            params: { msg: '' },
            query: {},
        });
        expect(track).not.toHaveBeenCalled();
        warnSpy.mockRestore();
        wrapper.unmount();
    });
});
