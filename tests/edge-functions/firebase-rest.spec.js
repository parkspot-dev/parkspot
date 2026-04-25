import { describe, expect, it, vi } from 'vitest';
import { fetchAreaEnhancement } from '../../netlify/edge-functions/lib/firebase-rest.js';

function mockFetchOk(body) {
    return vi.fn().mockResolvedValue({
        ok: true,
        json: async () => body,
    });
}

function mockFetchFail() {
    return vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) });
}

function mockFetchThrow() {
    return vi.fn().mockRejectedValue(new Error('network down'));
}

describe('fetchAreaEnhancement', () => {
    it('returns a site count when the seo-pages node is found', async () => {
        const fetchImpl = mockFetchOk({
            Sites: [{ ID: 'X' }, { ID: 'Y' }, { ID: 'Z' }],
        });
        const result = await fetchAreaEnhancement('marathahalli', { fetchImpl });
        expect(result).toEqual({ sitesCount: 3 });
    });

    it('falls back to null on non-2xx response', async () => {
        const result = await fetchAreaEnhancement('marathahalli', { fetchImpl: mockFetchFail() });
        expect(result).toBeNull();
    });

    it('falls back to null when fetch throws (network / timeout / CORS)', async () => {
        const result = await fetchAreaEnhancement('marathahalli', { fetchImpl: mockFetchThrow() });
        expect(result).toBeNull();
    });

    it('returns null on an unknown slug', async () => {
        const fetchImpl = mockFetchOk(null);
        const result = await fetchAreaEnhancement('not-a-real-area', { fetchImpl });
        expect(result).toBeNull();
    });

    it('ignores empty / falsy input defensively', async () => {
        const fetchImpl = vi.fn();
        expect(await fetchAreaEnhancement('', { fetchImpl })).toBeNull();
        expect(await fetchAreaEnhancement(undefined, { fetchImpl })).toBeNull();
        expect(fetchImpl).not.toHaveBeenCalled();
    });
});
