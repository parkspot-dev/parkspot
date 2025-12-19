import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createStore } from 'vuex';
import PageSrp from '@/views/PageSrp.vue';
import TemplateSrp from '@/components/templates/TemplateSrp.vue';

const MOCK_PAGE_TITLE = { SEARCH: 'Search Page | ' };
const MOCK_SPOTS = [{ ID: 1, name: 'Bangalore Spot 1' }];
const MOCK_LOCATION_DETAILS = {
    locDetails: { locName: 'Bangalore' },
    lnglat: [77.5946, 12.9716], 
};
const MOCK_COORDINATE_STRING = '12.9716,77.5946'; 
const EXPECTED_MAP_CONFIG_COORDS = [77.5946, 12.9716]; 

vi.mock('@/includes/LatLng', () => ({
    getCoordinate: vi.fn((str) => {
        if (str === MOCK_COORDINATE_STRING) return [12.9716, 77.5946];
        if (str === MOCK_LOCATION_DETAILS.lnglat.toString()) return [77.5946, 12.9716];
        return [0, 0];
    }),
}));

const mockRouterPush = vi.fn();
const mockRouterResolve = vi.fn(() => ({ href: '/spot/1' }));

let store;
let wrapper;

const actions = {
    srpCall: vi.fn().mockResolvedValue(),
    updateCenterSrp: vi.fn().mockResolvedValue(),
    updateSrpResults: vi.fn().mockResolvedValue(),
};

const mutations = {
    'update-map-center': vi.fn(),
    'update-map-config': vi.fn().mockResolvedValue(),
    'update-paginated-srp-data': vi.fn(),
};

const initializeStore = (emptyResults = false) => {
    store = createStore({
        modules: {
            map: {
                namespaced: true,
                state: {
                    srpResults: emptyResults ? [] : MOCK_SPOTS,
                    filteredSrpResults: emptyResults ? [] : MOCK_SPOTS,
                },
                getters: {
                    getPaginateSrpResults: () => MOCK_SPOTS,
                    getTotalPages: () => 5,
                    getLocDetails: () => MOCK_LOCATION_DETAILS,
                },
                actions,
                mutations,
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

const mountComponent = async (routeQuery = {}, emptyResults = false) => {
    initializeStore(emptyResults);
    const w = mount(PageSrp, {
        global: {
            plugins: [store],
            stubs: stubComponents,
            mocks: {
                $route: {
                    name: 'srp',
                    params: { location: 'Bangalore' },
                    query: { latlng: MOCK_COORDINATE_STRING, ...routeQuery },
                },
                $router: {
                    push: mockRouterPush,
                    resolve: mockRouterResolve,
                },
            },
            provide: { PAGE_TITLE: MOCK_PAGE_TITLE },
        },
    });
    await flushPromises(); 
    return w;
};

describe('PageSrp.vue - Bangalore SRP View', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        Object.defineProperty(window, 'location', {
            value: {
                search: `?latlng=${MOCK_COORDINATE_STRING}`,
                href: `http://localhost/search?latlng=${MOCK_COORDINATE_STRING}`,
            },
            writable: true,
            configurable: true,
        });
        vi.spyOn(window, 'open').mockImplementation(() => {});
    });

    afterEach(() => {
        if (wrapper) wrapper.unmount();
    });

    it('renders LoaderModal when isLoading is true', async () => {
        wrapper = await mountComponent({}, true);
        wrapper.vm.isLoading = true;
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.loader-modal-stub').exists()).toBe(true);
    });

    it('renders TemplateSrp when results are available', async () => {
        wrapper = await mountComponent();
        wrapper.vm.isLoading = false;
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.template-srp-stub').exists()).toBe(true);
    });

    it('updates map config and calls srpCall on mount', async () => {
        wrapper = await mountComponent();
        expect(mutations['update-map-config']).toHaveBeenCalledWith(
            expect.anything(),
            EXPECTED_MAP_CONFIG_COORDS
        );
        expect(actions.srpCall).toHaveBeenCalled();
        expect(wrapper.vm.isLoading).toBe(false);
    });

    it('redirects to error page if srpCall fails', async () => {
        actions.srpCall.mockRejectedValueOnce('SERVER_ERROR');
        wrapper = await mountComponent();
        expect(mockRouterPush).toHaveBeenCalledWith({
            name: 'error',
            params: { msg: 'SERVER_ERROR' },
            replace: true,
        });
    });

    it('handles onPageChange by updating paginated data', async () => {
        wrapper = await mountComponent();
        wrapper.vm.onPageChange(2);
        await flushPromises();
        expect(mutations['update-paginated-srp-data']).toHaveBeenCalledWith(expect.anything(), 2);
        expect(actions.updateCenterSrp).toHaveBeenCalled();
        expect(wrapper.vm.currentPage).toBe(2);
    });

    it('navigates to new srp route on flyToSrp', async () => {
        wrapper = await mountComponent();
        wrapper.vm.flyToSrp();
        await flushPromises();
        expect(mockRouterPush).toHaveBeenCalledWith(expect.objectContaining({
            name: 'srp',
            params: { location: 'Bangalore' }
        }));
    });

    it('opens spot details in a new window', async () => {
        wrapper = await mountComponent();
        wrapper.vm.spotDetails(101);
        expect(mockRouterResolve).toHaveBeenCalledWith(expect.objectContaining({
            params: { spotId: 101 }
        }));
        expect(window.open).toHaveBeenCalledWith('/spot/1');
    });

    it('dispatches updateSrpResults on filter change', async () => {
        wrapper = await mountComponent();
        const filter = { key: 'rent', value: '5000' };
        wrapper.vm.onFilter(filter);
        expect(actions.updateSrpResults).toHaveBeenCalledWith(expect.anything(), filter);
    });
});