import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createStore } from 'vuex';
import PageSrp from '@/views/PageSrp.vue';
import TemplateSrp from '@/components/templates/TemplateSrp.vue';

const MOCK_PAGE_TITLE = { SEARCH: 'Search Page | ' };

const MOCK_SPOTS = [{ ID: 1, name: 'Spot 1' }];
const MOCK_LOCATION_DETAILS = {
    locDetails: { locName: 'Mock Location' },
    lnglat: [77.2, 28.6],
};
const MOCK_COORDINATE_STRING = '28.6,77.2';

vi.mock('../includes/LatLng', () => ({
    getCoordinate: vi.fn((str) => {
        if (str === MOCK_LOCATION_DETAILS.lnglat.toString()) {
            return MOCK_LOCATION_DETAILS.lnglat;
        }
        if (str === MOCK_COORDINATE_STRING) {
            return [28.6, 77.2];
        }
        return [0, 0];
    }),
}));

const mockRouterPush = vi.fn();
const mockRouterResolve = vi.fn(() => ({ href: '/spot/1' }));

let store;
const actions = {
    srpCall: vi.fn(),
    updateCenterSrp: vi.fn(),
    updateSrpResults: vi.fn(),
};
const mutations = {
    'update-map-center': vi.fn(),
    'update-map-config': vi.fn(),
    'update-paginated-srp-data': vi.fn(),
};

const initializeStore = (emptyResults = false) => {
    const state = {
        srpResults: emptyResults ? [] : MOCK_SPOTS,
        filteredSrpResults: emptyResults ? [] : MOCK_SPOTS,
    };
    const getters = {
        getPaginateSrpResults: () => MOCK_SPOTS,
        getTotalPages: () => 5,
        getLocDetails: () => MOCK_LOCATION_DETAILS,
    };

    store = createStore({
        modules: {
            map: {
                namespaced: true,
                state,
                getters: { ...getters },
                actions: {
                    srpCall: actions.srpCall,
                    updateCenterSrp: actions.updateCenterSrp,
                    updateSrpResults: actions.updateSrpResults,
                },
                mutations: {
                    'update-map-config': mutations['update-map-config'],
                    'update-paginated-srp-data':
                        mutations['update-paginated-srp-data'],
                    'update-map-center': mutations['update-map-center'],
                },
            },
        },
    });
};

const stubComponents = {
    TemplateSrp: {
        props: ['spots', 'totals', 'currentPage', 'reRender'],
        template: "<div class='template-srp-stub'><slot /></div>",
    },
    LoaderModal: {
        template: "<div class='loader-modal-stub'></div>",
    },
};

const mountComponent = (routeQuery = {}, emptyResults = false) => {
    initializeStore(emptyResults);
    return mount(PageSrp, {
        props: {},
        global: {
            plugins: [store],
            stubs: stubComponents,
            mocks: {
                $route: {
                    name: 'srp',
                    params: { location: 'MockLocation' },
                    query: { latlng: MOCK_COORDINATE_STRING, ...routeQuery },
                },
                $router: {
                    push: mockRouterPush,
                    resolve: mockRouterResolve,
                },
            },
            provide: {
                PAGE_TITLE: MOCK_PAGE_TITLE,
            },
        },
    });
};

describe('PageSrp.vue - Search Results View', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        Object.defineProperty(window, 'location', {
            value: {
                search: `?latlng=${MOCK_COORDINATE_STRING}`,
                href: 'http://localhost/search?latlng=28.6,77.2',
            },
            writable: true,
        });
        vi.spyOn(window, 'open').mockImplementation(() => {});
    });

    it('1. Renders LoaderModal when isLoading is true', async () => {
        const wrapper = mountComponent({}, true);

        wrapper.vm.isLoading = true;
        await wrapper.vm.$nextTick();

        expect(wrapper.find('.loader-modal-stub').exists()).toBe(true);
        expect(wrapper.find('.template-srp-stub').exists()).toBe(false);
    });

    it('2. Renders TemplateSrp when results are available', async () => {
        const wrapper = mountComponent();
        wrapper.vm.isLoading = false;
        await wrapper.vm.$nextTick();

        expect(wrapper.find('.template-srp-stub').exists()).toBe(true);

        const srp = wrapper.findComponent(TemplateSrp);
        expect(srp.props('spots')).toEqual(MOCK_SPOTS);
        expect(srp.props('totals')).toBe(5);
    });

    it('3. Calls srpCall and updates config on mounted', async () => {
        const wrapper = mountComponent();

        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.isLoading).toBe(false);

        expect(mutations['update-map-config']).toHaveBeenCalledWith(
            expect.anything(),
            expect.arrayContaining(['77.2', '28.6']),
        );
        expect(actions.srpCall).toHaveBeenCalled();
        expect(wrapper.vm.reRender).toBe(1);
    });

    it('4. Handles mounted error gracefully and redirects', async () => {
        actions.srpCall.mockRejectedValue('API_FAILED');
        const wrapper = mountComponent();

        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        expect(mockRouterPush).toHaveBeenCalledWith({
            name: 'error',
            params: { msg: 'API_FAILED' },
            replace: true,
        });
    });

    it('5. Correctly handles onPageChange event', async () => {
        const wrapper = mountComponent();
        const NEW_PAGE = 3;

        wrapper.vm.onPageChange(NEW_PAGE);

        await wrapper.vm.$nextTick();

        expect(mutations['update-paginated-srp-data']).toHaveBeenCalledWith(
            expect.anything(),
            NEW_PAGE,
        );
        expect(actions.updateCenterSrp).toHaveBeenCalled();

        expect(wrapper.vm.currentPage).toBe(NEW_PAGE);
        expect(wrapper.vm.reRender).toBe(1);
    });

    it('6. Correctly pushes new route on flyToSrp', async () => {
        const wrapper = mountComponent();

        wrapper.vm.flyToSrp();
        await wrapper.vm.$nextTick();

        expect(mockRouterPush).toHaveBeenCalledWith({
            name: 'srp',
            query: { latlng: '28.6,77.2' },
            params: { location: 'Mock Location' },
        });
    });

    it('7. Handles spotDetails by opening new window', () => {
        const wrapper = mountComponent();
        const SPOT_ID = 10;

        wrapper.vm.spotDetails(SPOT_ID);

        expect(mockRouterResolve).toHaveBeenCalledWith({
            name: 'spot-detail',
            params: { spotId: 10 },
        });
        expect(window.open).toHaveBeenCalledWith('/spot/1');
    });

    it('8. Correctly dispatches action on onFilter event', () => {
        const wrapper = mountComponent();
        const FILTER_OPTIONS = { key: 'distance', value: '1km' };

        wrapper.vm.onFilter(FILTER_OPTIONS);

        expect(actions.updateSrpResults).toHaveBeenCalledWith(
            expect.anything(),
            FILTER_OPTIONS,
        );
    });

    it('9. Updates title correctly via router watcher', async () => {
        const wrapper = mountComponent();
        const NEW_TITLE = 'New York City';

        wrapper.vm.$options.watch.$route.handler.call(wrapper.vm, {
            name: 'srp',
            params: { location: NEW_TITLE },
        });

        expect(wrapper.vm.title).toBe(NEW_TITLE);
    });
});
