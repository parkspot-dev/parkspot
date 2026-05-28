import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createStore } from 'vuex';

import PageNearBy, { safeLocationFromRoute } from '@/views/PageNearBy.vue';

// Mock the SEO meta builders so the test doesn't depend on the real
// `netlify/edge-functions/lib/meta.js` output. We only care that
// `PageNearBy.metaInfo()` invokes them with the route-derived URL and
// passes through the result.
//
// Phase 2.5: the mock now also returns `h1` (consumed by the
// `headline` computed). This lets the heading-hygiene assertions
// (below) run without standing up the real meta builder.
vi.mock('@/utils/seo/meta.js', () => ({
    buildAreaPageMeta: vi.fn(() => ({
        title: 'Mocked Title',
        canonical: 'https://www.parkspot.in/bangalore/parking-near-btm/',
        h1: 'Car Parking near BTM, Bengaluru',
    })),
}));
vi.mock('@/utils/seo/to-head.js', () => ({
    metaPayloadToHead: vi.fn((payload) => ({
        title: payload?.title || '',
        meta: payload?.description
            ? [{ name: 'description', content: payload.description }]
            : [],
        link: payload?.canonical
            ? [{ rel: 'canonical', href: payload.canonical, key: 'canonical' }]
            : [],
        script: [],
    })),
}));

import { buildAreaPageMeta } from '@/utils/seo/meta.js';

function makeStore({ initialPages = {}, loadPageImpl } = {}) {
    const dispatch = vi.fn(async (action, payload) => {
        if (action === 'seoPages/loadPage' && loadPageImpl) {
            return loadPageImpl(payload);
        }
        return null;
    });
    const store = createStore({
        modules: {
            seoPages: {
                namespaced: true,
                state: () => ({ byLocation: { ...initialPages } }),
                getters: {
                    spotsForLocation: (state) => (loc) => {
                        const p = state.byLocation[loc];
                        return p && Array.isArray(p.Sites) ? p.Sites : [];
                    },
                    pageForLocation: (state) => (loc) =>
                        state.byLocation[loc] || null,
                    hasLoadedLocation: (state) => (loc) =>
                        Object.prototype.hasOwnProperty.call(
                            state.byLocation,
                            loc,
                        ),
                },
            },
        },
    });
    store.dispatch = dispatch;
    return { store, dispatch };
}

function mountWith({ route, store, stubs = {} } = {}) {
    return mount(PageNearBy, {
        global: {
            plugins: store ? [store] : [],
            mocks: {
                $route: route,
                $router: { resolve: () => ({ href: '/x' }) },
            },
            stubs: {
                // Phase 2.5: surface the `headline` prop on the stub
                // so the heading-hygiene assertions can read it
                // without standing up the real TemplateNearBy.
                TemplateNearBy: {
                    props: ['nearByLocation', 'spots', 'isLoading', 'headline'],
                    template:
                        '<div class="tnb" :data-loc="nearByLocation" :data-loading="isLoading" :data-headline="headline"><span v-for="s in spots" :key="s.ID" class="spot">{{ s.ID }}</span></div>',
                },
                ...stubs,
            },
        },
    });
}

describe('PageNearBy.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('helpers', () => {
        it('safeLocationFromRoute trims and tolerates missing params', () => {
            expect(
                safeLocationFromRoute({ params: { location: ' btm  ' } }),
            ).toBe('btm');
            expect(safeLocationFromRoute({})).toBe('');
            expect(safeLocationFromRoute({ params: {} })).toBe('');
            expect(safeLocationFromRoute(null)).toBe('');
        });
    });

    describe('mounted()', () => {
        it('dispatches seoPages/loadPage on cold mount', async () => {
            const { store, dispatch } = makeStore({
                loadPageImpl: async (loc) => {
                    store.state.seoPages.byLocation = {
                        ...store.state.seoPages.byLocation,
                        [loc]: { Sites: [{ ID: 'A' }, { ID: 'B' }] },
                    };
                    return store.state.seoPages.byLocation[loc];
                },
            });

            const wrapper = mountWith({
                route: {
                    name: 'discover',
                    path: '/bangalore/parking-near-btm',
                    fullPath: '/bangalore/parking-near-btm',
                    params: { location: 'btm' },
                },
                store,
            });
            await flushPromises();

            expect(dispatch).toHaveBeenCalledWith('seoPages/loadPage', 'btm');
            expect(wrapper.findAll('.spot')).toHaveLength(2);
            expect(wrapper.find('.tnb').attributes('data-loading')).toBe(
                'false',
            );
        });

        it('hydration shortcut: skips dispatch when the slug is already loaded', async () => {
            const { store, dispatch } = makeStore({
                initialPages: {
                    btm: { Sites: [{ ID: 'A' }] },
                },
            });

            const wrapper = mountWith({
                route: {
                    name: 'discover',
                    path: '/bangalore/parking-near-btm',
                    fullPath: '/bangalore/parking-near-btm',
                    params: { location: 'btm' },
                },
                store,
            });
            await flushPromises();

            expect(dispatch).not.toHaveBeenCalled();
            expect(wrapper.vm.isLoading).toBe(false);
            expect(wrapper.findAll('.spot')).toHaveLength(1);
        });
    });

    describe('serverPrefetch()', () => {
        it('dispatches seoPages/loadPage with the trimmed slug', async () => {
            const dispatch = vi.fn(async () => null);
            const ctx = {
                $route: {
                    path: '/bangalore/parking-near-btm',
                    fullPath: '/bangalore/parking-near-btm',
                    params: { location: ' btm ' },
                },
                $store: {
                    dispatch,
                    getters: {
                        'seoPages/pageForLocation': () => ({ Sites: [] }),
                    },
                },
                isLoading: true,
                nearByLocation: '',
                show: false,
                title: undefined,
            };
            await PageNearBy.serverPrefetch.call(ctx);
            expect(dispatch).toHaveBeenCalledWith('seoPages/loadPage', 'btm');
            expect(ctx.nearByLocation).toBe('btm');
            expect(ctx.isLoading).toBe(false);
        });

        it('is a no-op when there is no `location` param on the route', async () => {
            const dispatch = vi.fn();
            const ctx = {
                $route: {},
                $store: {
                    dispatch,
                    getters: {
                        'seoPages/pageForLocation': () => null,
                    },
                },
                isLoading: true,
                nearByLocation: '',
                show: false,
            };
            await PageNearBy.serverPrefetch.call(ctx);
            expect(dispatch).not.toHaveBeenCalled();
            expect(ctx.isLoading).toBe(false);
        });

        it('degrades cleanly when the dispatch throws (no rethrow, isLoading flips false)', async () => {
            const errSpy = vi
                .spyOn(console, 'error')
                .mockImplementation(() => {});
            const dispatch = vi.fn(async () => {
                throw new Error('rtdb down');
            });
            const ctx = {
                $route: { params: { location: 'btm' }, path: '/x' },
                $store: {
                    dispatch,
                    getters: {
                        'seoPages/pageForLocation': () => null,
                    },
                },
                isLoading: true,
                nearByLocation: '',
                show: false,
            };
            await PageNearBy.serverPrefetch.call(ctx);
            expect(ctx.isLoading).toBe(false);
            errSpy.mockRestore();
        });
    });

    describe('metaInfo()', () => {
        it('invokes buildAreaPageMeta with the route-derived URL and passes through the head payload', () => {
            const { store } = makeStore({
                initialPages: { btm: { Sites: [{ ID: 'A' }] } },
            });
            const wrapper = mountWith({
                route: {
                    name: 'discover',
                    path: '/bangalore/parking-near-btm',
                    fullPath: '/bangalore/parking-near-btm/',
                    params: { location: 'btm' },
                },
                store,
            });
            wrapper.vm.nearByLocation = 'btm';
            buildAreaPageMeta.mockClear();
            const info = wrapper.vm.$options.metaInfo.call(wrapper.vm);

            expect(buildAreaPageMeta).toHaveBeenCalled();
            const calledWith = buildAreaPageMeta.mock.calls[0];
            // First positional arg is a URL object built from $route.fullPath.
            expect(calledWith[0]).toBeInstanceOf(URL);
            expect(calledWith[0].pathname).toBe('/bangalore/parking-near-btm/');
            // Second positional arg is an enhancement object with sitesCount
            // when spots are present.
            expect(calledWith[1]).toEqual({ sitesCount: 1 });

            expect(info.title).toBe('Mocked Title');
            expect(info.link).toEqual([
                {
                    rel: 'canonical',
                    href: 'https://www.parkspot.in/bangalore/parking-near-btm/',
                    key: 'canonical',
                },
            ]);
        });

        it('passes `null` enhancement when no spots are loaded yet', () => {
            const { store } = makeStore();
            const wrapper = mountWith({
                route: {
                    name: 'discover',
                    path: '/bangalore/parking-near-unknown',
                    fullPath: '/bangalore/parking-near-unknown',
                    params: { location: 'unknown' },
                },
                store,
            });
            wrapper.vm.$options.metaInfo.call(wrapper.vm);
            const calls = buildAreaPageMeta.mock.calls;
            expect(calls[calls.length - 1][1]).toBeNull();
        });
    });

    // Phase 2.5 heading-hygiene regression. The route page now exposes
    // a `headline` computed that pulls H1 text from the SAME builder
    // that produces the document <title> and JSON-LD, so the
    // prerendered <h1>, the edge-injected <title>, and the SERP
    // snippet share one source of truth.
    describe('headline computed (Phase 2.5)', () => {
        it('sources the H1 text from buildAreaPageMeta(...).h1 and passes it to TemplateNearBy', () => {
            const { store } = makeStore({
                initialPages: { btm: { Sites: [{ ID: 'A' }] } },
            });
            const wrapper = mountWith({
                route: {
                    name: 'discover',
                    path: '/bangalore/parking-near-btm',
                    fullPath: '/bangalore/parking-near-btm/',
                    params: { location: 'btm' },
                },
                store,
            });
            expect(wrapper.vm.headline).toBe('Car Parking near BTM, Bengaluru');
            // And the prop forwarding to the template:
            expect(wrapper.find('.tnb').attributes('data-headline')).toBe(
                'Car Parking near BTM, Bengaluru',
            );
        });

        it('degrades to empty string when buildAreaPageMeta throws', () => {
            // Failsafe: if the URL is malformed or the builder is
            // unavailable, the route page must not crash. The
            // template's default headline takes over visually.
            const { store } = makeStore();
            buildAreaPageMeta.mockImplementationOnce(() => {
                throw new Error('boom');
            });
            const wrapper = mountWith({
                route: {
                    name: 'discover',
                    path: '/bangalore/parking-near-btm',
                    fullPath: '/bangalore/parking-near-btm',
                    params: { location: 'btm' },
                },
                store,
            });
            expect(wrapper.vm.headline).toBe('');
        });
    });
});
