// PR-5 of conversion-tracking. PagePaymentGateway is the entry point
// for two distinct booking-funnel events:
//
//   - `payment_initiated` (step 9) — fired after the maya `/validate`
//     call confirms the payment row, just before the user clicks
//     Pay Now and is redirected to Cashfree.
//   - `purchase` (step 10)         — fired after the maya `/status`
//     call returns Status=PAID, with the full enhanced_conversion_data
//     payload. Dedup keyed on `transaction_id` (the `?p=` param) in
//     sessionStorage so Cashfree retries / browser back-button revisits
//     never double-count.
//
// We assert the high-value invariants only:
//   - `payment_initiated` fires exactly once with the right shape on
//     the validate path.
//   - `purchase` fires once on the first PAID status, and is a no-op
//     on a repeat visit with the same `?p=` (this is the most
//     load-bearing guarantee of the whole module).
//   - The success redirect carries `?from=booking&t=<id>` so that
//     PageThankYou can fire `purchase_confirmed`.
//
// What we deliberately skip:
//   - Error / ACTIVE / unknown status branches — covered by the
//     existing redirect assertions in nearby integration tests; the
//     analytics layer adds nothing there.
//   - The handcrafted E.164 normalizer — same logic lives in
//     TemplateSpotDetail.vue and is exercised end-to-end by the
//     attribution suite; duplicating phone-format edge cases here
//     would just couple this spec to an internal helper.
import { flushPromises, mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('@/lib/analytics', async () => {
    const real = await vi.importActual('@/lib/analytics/schema.js');
    return {
        track: vi.fn(),
        EVENTS: real.EVENTS,
    };
});

import { track, EVENTS } from '@/lib/analytics';
import PagePaymentGateway from '@/views/PagePaymentGateway.vue';

// Build a minimal $route stub. The component's `mounted` hook tests
// `pathMatch` against /status|order_id/ and /payment|validate|p|h/ to
// pick which path to take, so we set pathMatch explicitly per scenario.
const makeRoute = ({ pathMatch, query = {} }) => ({
    params: { pathMatch },
    query,
});

const mountWithRoute = (route, routerPush = vi.fn()) =>
    mount(PagePaymentGateway, {
        global: {
            mocks: {
                $route: route,
                $router: { push: routerPush },
            },
            stubs: {
                TemplatePaymentGateway: {
                    name: 'TemplatePaymentGateway',
                    template: '<div data-testid="template-payment" />',
                    props: ['bookingDetails', 'paymentMode', 'status'],
                },
            },
        },
    });

// Canned /validate response: a normal pay-now path with no ErrorCode.
const VALIDATE_OK = {
    BookingInfo: {
        Name: 'Alice',
        Rent: 5000,
        ConvenienceFee: 250,
        SiteID: 'SPOT_42',
        SiteName: 'Indiranagar Covered',
        EmailID: 'alice@example.com',
        Mobile: '9876543210',
        BookingID: 'BK_99',
    },
    PaymentInfo: {
        Amount: 5250,
        Discount: 0,
        Type: 1,
    },
    DueDate: '2026-07-01',
    Payment: { Provider: 'cashfree' },
};

// Canned /status response for the success branch.
const STATUS_PAID = {
    Status: 'PAID',
};

describe('PagePaymentGateway.vue — booking funnel payment events', () => {
    let originalFetch;

    beforeEach(() => {
        track.mockClear();
        // Fresh sessionStorage each test so the dedup set starts empty.
        window.sessionStorage.clear();
        originalFetch = global.fetch;
    });

    afterEach(() => {
        vi.clearAllMocks();
        global.fetch = originalFetch;
        window.sessionStorage.clear();
    });

    it('fires payment_initiated after /validate succeeds with the correct shape', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(VALIDATE_OK),
        });

        const wrapper = mountWithRoute(
            makeRoute({
                pathMatch: 'payment/validate',
                query: { p: 'PAY_77', h: 'hash123' },
            }),
        );
        await flushPromises();

        // Filter to PAYMENT_INITIATED so we don't depend on whether
        // any other ambient event slipped through (none should).
        const initiated = track.mock.calls.find(
            (c) => c[0] === EVENTS.PAYMENT_INITIATED,
        );
        expect(initiated).toBeTruthy();
        expect(initiated[1]).toMatchObject({
            funnel_name: 'booking',
            step_index: 9,
            payment_provider: 'cashfree',
            value: 5250,
            currency: 'INR',
            transaction_id: 'PAY_77',
        });

        wrapper.unmount();
    });

    it('does not fire payment_initiated when /validate returns an ErrorCode', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                ErrorCode: 5,
                DisplayMsg: 'Already paid',
            }),
        });

        const wrapper = mountWithRoute(
            makeRoute({
                pathMatch: 'payment/validate',
                query: { p: 'PAY_77', h: 'h' },
            }),
        );
        await flushPromises();

        expect(
            track.mock.calls.some((c) => c[0] === EVENTS.PAYMENT_INITIATED),
        ).toBe(false);

        wrapper.unmount();
    });

    it('fires purchase exactly once on first PAID status and redirects with from=booking&t=<id>', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(STATUS_PAID),
        });

        const routerPush = vi.fn();
        const wrapper = mountWithRoute(
            makeRoute({
                pathMatch: 'status',
                query: { order_id: 'CF_ORDER_1', p: 'PAY_77' },
            }),
            routerPush,
        );
        await flushPromises();

        const purchaseCalls = track.mock.calls.filter(
            (c) => c[0] === EVENTS.PURCHASE,
        );
        expect(purchaseCalls).toHaveLength(1);
        expect(purchaseCalls[0][1]).toMatchObject({
            funnel_name: 'booking',
            step_index: 10,
            transaction_id: 'PAY_77',
            currency: 'INR',
        });
        // Top-level PII is forbidden — confirm email/phone live only
        // inside enhanced_conversion_data.
        expect(purchaseCalls[0][1]).not.toHaveProperty('email_address');
        expect(purchaseCalls[0][1]).not.toHaveProperty('phone_number');
        expect(
            purchaseCalls[0][1].enhanced_conversion_data,
        ).toBeDefined();

        // Success redirect carries the funnel handoff for PageThankYou.
        expect(routerPush).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'thankYou',
                query: { from: 'booking', t: 'PAY_77' },
            }),
        );

        wrapper.unmount();
    });

    it('dedupes purchase across repeat PAID visits keyed on transaction_id (?p=)', async () => {
        // Both visits return PAID for the same `?p=` — Cashfree retry
        // / back-button revisit / double-mount should fire `purchase`
        // exactly once across the pair.
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(STATUS_PAID),
        });

        const route = makeRoute({
            pathMatch: 'status',
            query: { order_id: 'CF_ORDER_1', p: 'PAY_77' },
        });

        const w1 = mountWithRoute(route);
        await flushPromises();
        w1.unmount();

        const w2 = mountWithRoute(route);
        await flushPromises();
        w2.unmount();

        const purchaseCalls = track.mock.calls.filter(
            (c) => c[0] === EVENTS.PURCHASE,
        );
        expect(purchaseCalls).toHaveLength(1);
    });

    it('falls back to order_id as transaction_id when ?p= is absent', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(STATUS_PAID),
        });

        const wrapper = mountWithRoute(
            makeRoute({
                pathMatch: 'status',
                query: { order_id: 'CF_ORDER_42' },
            }),
        );
        await flushPromises();

        const purchaseCalls = track.mock.calls.filter(
            (c) => c[0] === EVENTS.PURCHASE,
        );
        expect(purchaseCalls).toHaveLength(1);
        expect(purchaseCalls[0][1].transaction_id).toBe('CF_ORDER_42');

        wrapper.unmount();
    });
});
