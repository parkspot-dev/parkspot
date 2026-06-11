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
});
