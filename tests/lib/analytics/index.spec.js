import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    EVENTS,
    LEAD_TYPES,
    identify,
    setUserProperty,
    track,
} from '@/lib/analytics/index.js';

const STORAGE_KEY = 'parkspot_attrib';

describe('analytics/index (public API)', () => {
    beforeEach(() => {
        window.dataLayer = [];
        sessionStorage.clear();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        window.dataLayer = [];
        sessionStorage.clear();
    });

    describe('track()', () => {
        it('pushes a payload with the event name and merged page defaults', () => {
            window.history.replaceState({}, '', '/some/path?x=1');
            document.title = 'Test Title';
            const ok = track(EVENTS.PAGE_VIEW, {
                page_path: '/some/path?x=1',
                page_title: 'Test Title',
            });
            expect(ok).toBe(true);
            expect(window.dataLayer).toHaveLength(1);
            expect(window.dataLayer[0]).toMatchObject({
                event: 'page_view',
                page_path: '/some/path?x=1',
                page_title: 'Test Title',
            });
        });

        it('merges attribution from sessionStorage into every push', () => {
            sessionStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    gclid: 'G123',
                    utm_source: 'google',
                    utm_campaign: 'jun',
                }),
            );
            track(EVENTS.FUNNEL_VIEW, { funnel_name: 'vo_lead' });
            const event = window.dataLayer[0];
            expect(event.gclid).toBe('G123');
            expect(event.utm_source).toBe('google');
            expect(event.utm_campaign).toBe('jun');
        });

        it('lets explicit params override page defaults and attribution', () => {
            sessionStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ utm_source: 'fb' }),
            );
            track(EVENTS.PAGE_VIEW, {
                page_path: '/explicit',
                page_title: 'Explicit',
                utm_source: 'override',
            });
            const event = window.dataLayer[0];
            expect(event.page_path).toBe('/explicit');
            expect(event.utm_source).toBe('override');
        });

        it('throws (in dev) when a required param is missing', () => {
            // Vitest exposes import.meta.env.DEV = true under `npm run test`.
            expect(() =>
                track(EVENTS.GENERATE_LEAD, {
                    funnel_name: 'vo_lead',
                    lead_type: LEAD_TYPES.PARKING_SEEKER,
                    value: 500,
                    currency: 'INR',
                    // enhanced_conversion_data omitted
                }),
            ).toThrow(/missing required param/);
        });

        it('returns false and does nothing on the server', () => {
            vi.stubGlobal('window', undefined);
            const ok = track(EVENTS.PAGE_VIEW, {
                page_path: '/x',
                page_title: 'X',
            });
            expect(ok).toBe(false);
        });
    });

    describe('identify()', () => {
        it('emits an identify event with user_id and user_properties', () => {
            identify('user_42', { is_authenticated: true, user_role: 'guest' });
            expect(window.dataLayer).toHaveLength(1);
            expect(window.dataLayer[0]).toMatchObject({
                event: 'identify',
                user_id: 'user_42',
                user_properties: {
                    is_authenticated: true,
                    user_role: 'guest',
                },
            });
        });

        it('handles missing user_properties without crashing', () => {
            identify('user_42');
            expect(window.dataLayer[0]).toMatchObject({
                event: 'identify',
                user_id: 'user_42',
                user_properties: {},
            });
        });
    });

    describe('setUserProperty()', () => {
        it('emits a set_user_property event with the key/value pair', () => {
            setUserProperty('city', 'Bangalore');
            expect(window.dataLayer).toHaveLength(1);
            expect(window.dataLayer[0]).toMatchObject({
                event: 'set_user_property',
                user_properties: { city: 'Bangalore' },
            });
        });
    });

    describe('New Relic forwarding', () => {
        let addPageAction;

        beforeEach(() => {
            addPageAction = vi.fn();
            window.newrelic = { addPageAction };
        });

        afterEach(() => {
            delete window.newrelic;
        });

        it('mirrors funnel events with the call-site params only', () => {
            sessionStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ gclid: 'G123', utm_source: 'google' }),
            );
            track(EVENTS.FORM_SUBMIT_ATTEMPT, { funnel_name: 'vo_lead' });
            expect(addPageAction).toHaveBeenCalledTimes(1);
            expect(addPageAction).toHaveBeenCalledWith('form_submit_attempt', {
                funnel_name: 'vo_lead',
            });
        });

        it('flattens items and drops item names', () => {
            track(EVENTS.SELECT_ITEM, {
                funnel_name: 'srp',
                items: [
                    { item_id: 'S1', item_name: 'Koramangala Lot', price: 50 },
                ],
            });
            expect(addPageAction).toHaveBeenCalledWith('select_item', {
                funnel_name: 'srp',
                item_count: 1,
                item_id: 'S1',
                price: 50,
            });
        });

        it('never forwards enhanced conversion data or the search location', () => {
            track(EVENTS.GENERATE_LEAD, {
                funnel_name: 'vo_lead',
                lead_type: LEAD_TYPES.PARKING_OWNER,
                value: 500,
                currency: 'INR',
                enhanced_conversion_data: {
                    email: 'owner@example.com',
                    phone_number: '+919876543210',
                },
            });
            track(EVENTS.SEARCH, { search_term: '12.9716,77.5946' });
            expect(addPageAction).toHaveBeenNthCalledWith(1, 'generate_lead', {
                funnel_name: 'vo_lead',
                lead_type: 'parking_owner',
                value: 500,
                currency: 'INR',
            });
            expect(addPageAction).toHaveBeenNthCalledWith(2, 'search', {});
        });

        it('never forwards the transaction ID, not even as an item ID', () => {
            // PagePaymentGateway falls back to the transaction ID when it
            // has neither a spot ID nor a booking ID.
            track(EVENTS.PURCHASE, {
                funnel_name: 'booking',
                transaction_id: 'P123',
                value: 500,
                currency: 'INR',
                items: [{ item_id: 'P123', item_name: 'Lot', price: 500 }],
                enhanced_conversion_data: {},
            });
            expect(addPageAction).toHaveBeenCalledWith('purchase', {
                funnel_name: 'booking',
                value: 500,
                currency: 'INR',
                item_count: 1,
                price: 500,
            });
        });

        it('skips page views and identity events', () => {
            track(EVENTS.PAGE_VIEW, { page_path: '/x', page_title: 'X' });
            identify('user_42', { is_authenticated: true });
            setUserProperty('city', 'Bangalore');
            expect(window.dataLayer).toHaveLength(3);
            expect(addPageAction).not.toHaveBeenCalled();
        });
    });
});
