import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { gtag, push } from '@/lib/analytics/dataLayer.js';

describe('analytics/dataLayer', () => {
    beforeEach(() => {
        // Each test starts with a fresh dataLayer.
        window.dataLayer = undefined;
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    describe('push()', () => {
        it('initializes window.dataLayer if absent and pushes payload', () => {
            const result = push({ event: 'page_view', page_path: '/x' });
            expect(result).toBe(true);
            expect(window.dataLayer).toEqual([
                { event: 'page_view', page_path: '/x' },
            ]);
        });

        it('appends to an existing dataLayer without overwriting prior entries', () => {
            window.dataLayer = [{ event: 'first' }];
            push({ event: 'second' });
            expect(window.dataLayer).toEqual([
                { event: 'first' },
                { event: 'second' },
            ]);
        });

        it('returns false and does nothing when window is undefined (SSR)', () => {
            // Simulate SSR by stubbing `window` to undefined.
            vi.stubGlobal('window', undefined);
            const result = push({ event: 'page_view' });
            expect(result).toBe(false);
        });
    });

    describe('gtag()', () => {
        it('pushes the variadic arguments object onto the dataLayer', () => {
            const result = gtag('consent', 'default', { ad_storage: 'granted' });
            expect(result).toBe(true);
            expect(window.dataLayer).toHaveLength(1);
            // Per the GTM shim shape, args are pushed as an array-like.
            expect(Array.from(window.dataLayer[0])).toEqual([
                'consent',
                'default',
                { ad_storage: 'granted' },
            ]);
        });

        it('no-ops on the server', () => {
            vi.stubGlobal('window', undefined);
            expect(gtag('consent', 'default', {})).toBe(false);
        });
    });
});
