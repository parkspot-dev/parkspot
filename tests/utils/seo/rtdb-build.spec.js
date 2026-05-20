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
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
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
        it('shallow-fetches and splits by city', async () => {
            global.fetch = vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    status: 200,
                    json: () =>
                        Promise.resolve({
                            marathahalli: true,
                            btm: true,
                            hyderabad: true,
                        }),
                }),
            );

            const out = await fetchAllSeoSlugs();

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('shallow=true'),
                expect.any(Object),
            );
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

        it('encodes the slug into the path', async () => {
            global.fetch = vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    status: 200,
                    json: () => Promise.resolve({ Sites: [{ ID: '1' }] }),
                }),
            );

            const out = await fetchSeoPage('koramangala/4th block');

            expect(global.fetch).toHaveBeenCalledWith(
                `${__internals.DB_BASE}/seo-pages/${encodeURIComponent(
                    'koramangala/4th block',
                )}.json`,
                expect.any(Object),
            );
            expect(out).toEqual({ Sites: [{ ID: '1' }] });
        });
    });
});
