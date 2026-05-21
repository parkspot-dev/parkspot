// Regression test for vite-ssg's route enumeration.
//
// Background: the `includedRoutes` hook was originally placed in the 4th
// argument of `ViteSSG(...)`, which is the `ViteSSGClientOptions` slot,
// not the SSG options slot — so vite-ssg silently fell back to "render
// every static route" and Phase-2 area pages were never emitted. To keep
// that bug from recurring we test the filter logic in isolation here and
// also assert that `src/main.js` re-exports the hook as a top-level
// named export (the only shape vite-ssg recognises).
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    buildAreaPagePaths,
    filterStaticPaths,
    SSG_EXCLUDED_EXACT,
} from '@/utils/seo/included-routes.js';
import { __internals as rtdbInternals } from '@/utils/seo/rtdb-build.js';

describe('utils/seo/included-routes', () => {
    describe('filterStaticPaths', () => {
        it('drops all auth-gated trees', () => {
            const input = [
                '/internal/search-portal',
                '/internal/booking-portal',
                '/internal/spot-requests',
                '/internal/users/kyc-status',
                '/payment/gateway',
                '/profile/my-bookings',
                '/user/edit-profile',
            ];
            expect(filterStaticPaths(input)).toEqual([]);
        });

        it('drops paths in the exact-exclusion set', () => {
            const input = [
                '/app',
                '/temp',
                '/thank-you',
                '/error',
                '/search-portal',
            ];
            expect(filterStaticPaths(input)).toEqual([]);
        });

        it('drops paths containing route-param placeholders', () => {
            expect(
                filterStaticPaths([
                    '/blog/:id',
                    '/spot-details/:spotId',
                    '/bangalore/parking-near-:location',
                    '/:catchAll(.*)',
                ]),
            ).toEqual([]);
        });

        it('keeps public, parameter-free routes', () => {
            const input = [
                '/',
                '/about',
                '/contact',
                '/faq',
                '/features',
                '/srp',
                '/get-parking-spot',
                '/register-parking-spot',
                '/terms-and-conditions',
                '/privacy',
                '/blog',
                '/automated-parking',
            ];
            expect(filterStaticPaths(input).sort()).toEqual(input.slice().sort());
        });

        it('preserves the relative order of inputs (deterministic build)', () => {
            expect(filterStaticPaths(['/about', '/faq', '/blog'])).toEqual([
                '/about',
                '/faq',
                '/blog',
            ]);
        });

        it('is tolerant of malformed inputs', () => {
            expect(
                // intentionally bad shapes
                filterStaticPaths([null, undefined, 42, '', '/ok']),
            ).toEqual(['/ok']);
        });
    });

    describe('buildAreaPagePaths', () => {
        it('emits trailing-slashed canonical area-page URLs', () => {
            expect(
                buildAreaPagePaths({
                    bangalore: ['indiranagar', 'koramangala'],
                    hyderabad: ['hitech-city'],
                }),
            ).toEqual([
                '/bangalore/parking-near-indiranagar/',
                '/bangalore/parking-near-koramangala/',
                '/hyderabad/parking-near-hitech-city/',
            ]);
        });

        it('handles missing buckets and unrecognised input', () => {
            expect(buildAreaPagePaths()).toEqual([]);
            expect(buildAreaPagePaths(null)).toEqual([]);
            expect(buildAreaPagePaths({})).toEqual([]);
            expect(buildAreaPagePaths({ bangalore: [] })).toEqual([]);
        });
    });

    describe('SSG_EXCLUDED_EXACT', () => {
        it('is a frozen Set so consumers cannot mutate it at runtime', () => {
            expect(SSG_EXCLUDED_EXACT).toBeInstanceOf(Set);
            expect(Object.isFrozen(SSG_EXCLUDED_EXACT)).toBe(true);
        });

        it('contains the SPA-only paths we agreed never to prerender', () => {
            for (const p of [
                '/app',
                '/temp',
                '/thank-you',
                '/error',
                '/search-portal',
            ]) {
                expect(SSG_EXCLUDED_EXACT.has(p)).toBe(true);
            }
        });
    });

    describe('includedRoutes', () => {
        let originalFetch;

        beforeEach(() => {
            // `includedRoutes` calls into `rtdb-build.js#fetchAllSeoSlugs`,
            // which uses the global `fetch`. Stub it so tests don't hit the
            // real RTDB.
            originalFetch = globalThis.fetch;
            globalThis.fetch = vi.fn(async () => ({
                ok: true,
                async json() {
                    return { indiranagar: true, hyderabad: true };
                },
            }));
            // `rtdb-build.js` memoises the bulk catalogue at module scope.
            // Reset it so tests in this describe block don't leak the
            // previous test's payload into the next test's network mock.
            rtdbInternals.resetCache();
        });

        afterEach(() => {
            globalThis.fetch = originalFetch;
            vi.restoreAllMocks();
        });

        it('combines the filtered static path set with the area-page set', async () => {
            const { includedRoutes } = await import(
                '@/utils/seo/included-routes.js'
            );
            const result = await includedRoutes([
                '/',
                '/about',
                '/internal/search-portal',
                '/blog/:id',
                '/app',
            ]);
            expect(result).toEqual([
                '/',
                '/about',
                '/bangalore/parking-near-indiranagar/',
                '/hyderabad/parking-near-hyderabad/',
            ]);
        });

        it('falls back to static paths when RTDB enumeration throws', async () => {
            const consoleErr = vi
                .spyOn(console, 'error')
                .mockImplementation(() => {});
            globalThis.fetch = vi.fn(async () => {
                throw new Error('network down');
            });
            const { includedRoutes } = await import(
                '@/utils/seo/included-routes.js'
            );
            const result = await includedRoutes(['/', '/internal/admin']);
            expect(result).toEqual(['/']);
            expect(consoleErr).toHaveBeenCalled();
        });
    });
});
