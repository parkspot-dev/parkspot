import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createStore } from 'vuex';

import seoPages from '@/store/seoPages';

vi.mock('@/firebase', () => ({
    getValueFromFirebase: vi.fn(),
}));
vi.mock('@/utils/seo/rtdb-build.js', () => ({
    fetchSeoPage: vi.fn(),
}));

import { getValueFromFirebase } from '@/firebase';
import { fetchSeoPage } from '@/utils/seo/rtdb-build.js';

function mountModuleStore() {
    return createStore({ modules: { seoPages } });
}

describe('store/seoPages', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('loadPage (client path)', () => {
        // Default for these tests is the non-SSR branch because
        // `import.meta.env.SSR` is false in the Vitest environment.
        it('commits and caches the Firebase result', async () => {
            const payload = { Sites: [{ ID: 'A' }] };
            getValueFromFirebase.mockResolvedValue(payload);

            const store = mountModuleStore();
            const result = await store.dispatch('seoPages/loadPage', 'btm');

            expect(getValueFromFirebase).toHaveBeenCalledWith(
                'seo-pages/btm',
            );
            expect(result).toEqual(payload);
            expect(store.state.seoPages.byLocation.btm).toEqual(payload);
        });

        it('short-circuits when the slug is already cached (including null)', async () => {
            getValueFromFirebase.mockResolvedValue({ Sites: [{ ID: 'B' }] });
            const store = mountModuleStore();
            // Pre-seed a null entry; this should still count as cached.
            store.commit('seoPages/setPage', {
                location: 'koramangala',
                data: null,
            });

            const result = await store.dispatch(
                'seoPages/loadPage',
                'koramangala',
            );

            expect(getValueFromFirebase).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });

        it('falls back to null and commits when Firebase throws', async () => {
            const errSpy = vi
                .spyOn(console, 'error')
                .mockImplementation(() => {});
            getValueFromFirebase.mockRejectedValue(new Error('net down'));
            const store = mountModuleStore();

            const result = await store.dispatch('seoPages/loadPage', 'btm');
            expect(result).toBeNull();
            expect(store.state.seoPages.byLocation.btm).toBeNull();
            errSpy.mockRestore();
        });

        it('returns null for empty / non-string inputs without committing', async () => {
            const store = mountModuleStore();
            await store.dispatch('seoPages/loadPage', '');
            await store.dispatch('seoPages/loadPage', null);
            await store.dispatch('seoPages/loadPage', undefined);
            expect(getValueFromFirebase).not.toHaveBeenCalled();
            expect(fetchSeoPage).not.toHaveBeenCalled();
            expect(store.state.seoPages.byLocation).toEqual({});
        });
    });

    describe('getters', () => {
        it('spotsForLocation returns Sites array when present, [] otherwise', () => {
            const store = mountModuleStore();
            store.commit('seoPages/setPage', {
                location: 'btm',
                data: { Sites: [{ ID: 'A' }, { ID: 'B' }] },
            });
            store.commit('seoPages/setPage', {
                location: 'koramangala',
                data: { Sites: 'not-an-array' },
            });
            store.commit('seoPages/setPage', {
                location: 'unknown',
                data: null,
            });

            const spotsFor = store.getters['seoPages/spotsForLocation'];
            expect(spotsFor('btm')).toHaveLength(2);
            expect(spotsFor('koramangala')).toEqual([]);
            expect(spotsFor('unknown')).toEqual([]);
            expect(spotsFor('never-seen')).toEqual([]);
        });

        it('hasLoadedLocation distinguishes between "loaded with null" and "never seen"', () => {
            const store = mountModuleStore();
            store.commit('seoPages/setPage', {
                location: 'btm',
                data: null,
            });
            const has = store.getters['seoPages/hasLoadedLocation'];
            expect(has('btm')).toBe(true);
            expect(has('never-seen')).toBe(false);
        });

        it('pageForLocation returns the raw entry or null', () => {
            const store = mountModuleStore();
            const data = { Sites: [{ ID: 'A' }], heading: 'BTM' };
            store.commit('seoPages/setPage', { location: 'btm', data });
            expect(store.getters['seoPages/pageForLocation']('btm')).toEqual(data);
            expect(
                store.getters['seoPages/pageForLocation']('never-seen'),
            ).toBeNull();
        });
    });
});
