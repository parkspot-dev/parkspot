import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
    fetchJson,
    splitSlugsByCity,
    fetchAllSeoSlugs,
    fetchSeoPage,
    __internals,
} from '@/utils/seo/rtdb-build.js';

describe('utils/seo/rtdb-build', () => {
    const originalFetch = global.fetch;

    beforeEach(() => {
        // The module memoises the bulk RTDB payload across calls — clear
        // it between tests so each describe block starts cold.
        __internals.resetCache();
    });

    afterEach(() => {
        global.fetch = originalFetch;
        vi.restoreAllMocks();
    });

    describe('splitSlugsByCity', () => {
        it('routes the explicit hyderabad slug to the hyderabad bucket', () => {
            const out = splitSlugsByCity(['marathahalli', 'hyderabad', 'btm']);
            expect(out.hyderabad).toEqual(['hyderabad']);
            expect(out.bangalore).toEqual(['btm', 'marathahalli']);
        });

        it('returns empty buckets for a non-array input', () => {
            expect(splitSlugsByCity(null)).toEqual({
                bangalore: [],
                hyderabad: [],
            });
            expect(splitSlugsByCity(undefined)).toEqual({
                bangalore: [],
                hyderabad: [],
            });
        });

        it('skips empty / non-string entries', () => {
            const out = splitSlugsByCity([
                '',
                null,
                undefined,
                123,
                'koramangala',
            ]);
            expect(out.bangalore).toEqual(['koramangala']);
            expect(out.hyderabad).toEqual([]);
        });

        it('produces deterministic ordering (lexicographic)', () => {
            const out = splitSlugsByCity(['marathahalli', 'btm', 'koramangala']);
            expect(out.bangalore).toEqual(['btm', 'koramangala', 'marathahalli']);
        });
    });

    describe('fetchJson', () => {
        it('rejects when the path does not start with "/"', async () => {
            await expect(fetchJson('seo-pages.json')).rejects.toThrow(
                /must be a string starting with "\/"/,
            );
        });

        it('returns parsed JSON on a 200 response', async () => {
            global.fetch = vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    status: 200,
                    json: () => Promise.resolve({ hello: 'world' }),
                }),
            );

            const out = await fetchJson('/whatever.json');
            expect(out).toEqual({ hello: 'world' });
            expect(global.fetch).toHaveBeenCalledWith(
                `${__internals.DB_BASE}/whatever.json`,
                expect.objectContaining({
                    headers: { accept: 'application/json' },
                }),
            );
        });

        it('throws on a non-2xx response and includes the status', async () => {
            global.fetch = vi.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 503,
                    json: () => Promise.resolve(''),
                }),
            );

            await expect(fetchJson('/seo-pages.json')).rejects.toThrow(
                /-> HTTP 503/,
            );
        });
    });

    describe('fetchAllSeoSlugs', () => {
        it('bulk-fetches the full catalogue and splits the top-level keys by city', async () => {
            global.fetch = vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    status: 200,
                    json: () =>
                        Promise.resolve({
                            marathahalli: { Sites: [{ ID: 'M' }] },
                            btm: { Sites: [{ ID: 'B' }] },
                            hyderabad: { Sites: [{ ID: 'H' }] },
                        }),
                }),
            );

            const out = await fetchAllSeoSlugs();

            // One bulk call against /seo-pages.json — no shallow=true and
            // no per-slug pattern. That's the whole point of the cache.
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(
                `${__internals.DB_BASE}/seo-pages.json`,
                expect.any(Object),
            );
            expect(global.fetch.mock.calls[0][0]).not.toContain('shallow');
            expect(out.bangalore).toEqual(['btm', 'marathahalli']);
            expect(out.hyderabad).toEqual(['hyderabad']);
        });
    });

    describe('fetchSeoPage', () => {
        it('rejects on empty / non-string slug', async () => {
            await expect(fetchSeoPage('')).rejects.toThrow(
                /must be a non-empty string/,
            );
            await expect(fetchSeoPage(undefined)).rejects.toThrow(
                /must be a non-empty string/,
            );
            await expect(fetchSeoPage(42)).rejects.toThrow(
                /must be a non-empty string/,
            );
        });

        it('returns the slug payload from the bulk catalogue', async () => {
            global.fetch = vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    status: 200,
                    json: () =>
                        Promise.resolve({
                            marathahalli: { Sites: [{ ID: 'M1' }] },
                            btm: { Sites: [{ ID: 'B1' }] },
                        }),
                }),
            );

            const out = await fetchSeoPage('marathahalli');
            expect(out).toEqual({ Sites: [{ ID: 'M1' }] });
        });

        it('returns null for an unknown slug instead of throwing', async () => {
            global.fetch = vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    status: 200,
                    json: () =>
                        Promise.resolve({ marathahalli: { Sites: [] } }),
                }),
            );

            const out = await fetchSeoPage('definitely-not-a-real-slug');
            expect(out).toBeNull();
            // The bulk fetch still ran exactly once, even though the slug
            // wasn't there — we should NOT re-request RTDB just because a
            // single slug was missing.
            expect(global.fetch).toHaveBeenCalledTimes(1);
        });

        it('serves concurrent and repeated callers from a single network request', async () => {
            // Even with three parallel callers, only one network request
            // should be issued — the in-flight promise is shared.
            global.fetch = vi.fn(
                () =>
                    new Promise((resolve) =>
                        setTimeout(
                            () =>
                                resolve({
                                    ok: true,
                                    status: 200,
                                    json: () =>
                                        Promise.resolve({
                                            marathahalli: {
                                                Sites: [{ ID: 'M' }],
                                            },
                                            btm: { Sites: [{ ID: 'B' }] },
                                        }),
                                }),
                            10,
                        ),
                    ),
            );

            const [a, b, c] = await Promise.all([
                fetchSeoPage('marathahalli'),
                fetchSeoPage('btm'),
                fetchSeoPage('marathahalli'),
            ]);

            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(a).toEqual({ Sites: [{ ID: 'M' }] });
            expect(b).toEqual({ Sites: [{ ID: 'B' }] });
            expect(c).toEqual({ Sites: [{ ID: 'M' }] });

            // A fourth call after the first batch resolves still hits the
            // cache only — no second fetch.
            await fetchSeoPage('btm');
            expect(global.fetch).toHaveBeenCalledTimes(1);
        });

        it('does NOT poison the cache when the bulk fetch fails; a retry can succeed', async () => {
            global.fetch = vi
                .fn()
                .mockRejectedValueOnce(new Error('rtdb down'))
                .mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    json: () =>
                        Promise.resolve({
                            marathahalli: { Sites: [{ ID: 'M' }] },
                        }),
                });

            await expect(fetchSeoPage('marathahalli')).rejects.toThrow(
                /rtdb down/,
            );

            const out = await fetchSeoPage('marathahalli');
            expect(out).toEqual({ Sites: [{ ID: 'M' }] });
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });
    });
});
