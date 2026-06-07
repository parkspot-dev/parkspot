import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setDefault, update } from '@/lib/analytics/consent.js';

describe('analytics/consent', () => {
    beforeEach(() => {
        window.dataLayer = [];
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        window.dataLayer = [];
    });

    describe('setDefault()', () => {
        it('pushes a gtag(consent, default, ...) tuple onto the dataLayer', () => {
            setDefault({
                ad_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted',
                analytics_storage: 'granted',
            });
            expect(window.dataLayer).toHaveLength(1);
            const tuple = Array.from(window.dataLayer[0]);
            expect(tuple[0]).toBe('consent');
            expect(tuple[1]).toBe('default');
            expect(tuple[2]).toMatchObject({
                ad_storage: 'granted',
                analytics_storage: 'granted',
            });
        });

        it('handles a missing consent argument gracefully', () => {
            setDefault();
            expect(window.dataLayer).toHaveLength(1);
            expect(Array.from(window.dataLayer[0])).toEqual([
                'consent',
                'default',
                {},
            ]);
        });

        it('no-ops on the server', () => {
            vi.stubGlobal('window', undefined);
            // Must not throw — simply returns false from the underlying gtag.
            expect(() => setDefault({ ad_storage: 'granted' })).not.toThrow();
        });
    });

    describe('update()', () => {
        it('pushes a gtag(consent, update, ...) tuple onto the dataLayer', () => {
            update({ analytics_storage: 'denied' });
            const tuple = Array.from(window.dataLayer[0]);
            expect(tuple).toEqual([
                'consent',
                'update',
                { analytics_storage: 'denied' },
            ]);
        });
    });
});
