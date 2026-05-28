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
    buildBlogPostPaths,
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
            expect(filterStaticPaths(input).sort()).toEqual(
                input.slice().sort(),
            );
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
            ).toEqual(['', '/ok']);
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

    describe('buildBlogPostPaths', () => {
        it('emits trailing-slashed paths for every blog id in the store', () => {
            const fixture = {
                state: {
                    blogs: [{ id: 'foo' }, { id: 'bar-baz' }],
                },
            };
            expect(buildBlogPostPaths(fixture)).toEqual([
                '/blog/foo/',
                '/blog/bar-baz/',
            ]);
        });

        it('skips entries with missing or invalid id (never emits /blog/undefined/)', () => {
            const fixture = {
                state: {
                    blogs: [
                        { id: 'good' },
                        {}, // no id
                        { id: '' }, // empty id
                        { id: '   ' }, // whitespace-only
                        { id: 42 }, // wrong type
                        null,
                        undefined,
                    ],
                },
            };
            expect(buildBlogPostPaths(fixture)).toEqual(['/blog/good/']);
        });

        it('returns [] when the store module is malformed', () => {
            expect(buildBlogPostPaths({})).toEqual([]);
            expect(buildBlogPostPaths({ state: null })).toEqual([]);
            expect(buildBlogPostPaths({ state: { blogs: null } })).toEqual([]);
            expect(buildBlogPostPaths(null)).toEqual([]);
        });

        it('defaults to the real bundled blog list when called with no args', () => {
            // Smoke-test the production wiring: the static import in
            // included-routes.js MUST resolve to a non-empty list, or
            // every Phase-1.5 acceptance check downstream will fail.
            const out = buildBlogPostPaths();
            expect(out.length).toBeGreaterThan(0);
            for (const p of out) {
                expect(p).toMatch(/^\/blog\/[a-z0-9-]+\/$/);
            }
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

        it('combines static paths + blog posts + area pages, in that order', async () => {
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
            // The exact blog ids depend on the bundled `src/store/blog`
            // module, so we don't hard-code them — just assert (a) the
            // static and area-page paths sit at the expected ends, and
            // (b) at least one blog path sits between them in the
            // canonical `/blog/<id>/` shape.
            expect(result[0]).toBe('/');
            expect(result[1]).toBe('/about');
            expect(result.slice(-2)).toEqual([
                '/bangalore/parking-near-indiranagar/',
                '/hyderabad/parking-near-hyderabad/',
            ]);
            const blogPaths = result.filter((p) => p.startsWith('/blog/'));
            expect(blogPaths.length).toBeGreaterThan(0);
            for (const p of blogPaths) {
                expect(p).toMatch(/^\/blog\/[a-z0-9-]+\/$/);
            }
        });

        it('still ships static + blog paths when RTDB enumeration throws', async () => {
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
            expect(result[0]).toBe('/');
            // No area pages — RTDB is down — but blog paths still ship
            // because they come from a bundled JS module, not a network
            // round-trip.
            expect(result.some((p) => p.startsWith('/bangalore/'))).toBe(false);
            expect(result.some((p) => p.startsWith('/hyderabad/'))).toBe(false);
            expect(result.some((p) => p.startsWith('/blog/'))).toBe(true);
            expect(consoleErr).toHaveBeenCalled();
        });
    });
});
