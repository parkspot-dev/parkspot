import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createStore } from 'vuex';
import PageSpotDetail from '@/views/PageSpotDetail.vue';

const mockPush = vi.fn();
const mockRouter = { push: mockPush };
const mockRoute = { params: { spotId: 'SPOT#123' } };

describe('PageSpotDetail.vue - Complete Test Suite', () => {
    let store;
    let actions;
    let commitSpy;
    let wrapper;

    const mountComponent = () =>
        mount(PageSpotDetail, {
            global: {
                plugins: [store],
                mocks: {
                    $router: mockRouter,
                    $route: mockRoute,
                    $buefy: {
                        toast: { open: vi.fn() },
                    },
                },
                stubs: {
                    LoaderModal: {
                        template: '<div class="loader-modal"></div>',
                    },
                    TemplateSpotDetail: {
                        template: '<div class="template-spot-detail"></div>',
                    },
                    AtomDatePicker: {
                        template: '<div class="date-picker"></div>',
                        props: ['assignedDate', 'size'],
                    },
                    AtomTextarea: {
                        template: '<div class="remark-textarea"></div>',
                        props: ['value', 'size'],
                    },
                },
            },
        });

    beforeEach(() => {
        Object.defineProperty(global.navigator, 'geolocation', {
            value: { getCurrentPosition: vi.fn() },
            configurable: true,
        });

        actions = {
            getSpotDetails: vi.fn().mockResolvedValue(),
            updateAvailability: vi.fn().mockResolvedValue(),
            updateLastCallDate: vi.fn().mockResolvedValue(),
            updateRemark: vi.fn().mockResolvedValue(),
        };

        store = createStore({
            modules: {
                sdp: {
                    namespaced: true,
                    state: { loading: false, title: 'Spot Detail' },
                    actions,
                },
                searchPortal: {
                    namespaced: true,
                    state: { activeTab: 1 },
                    actions: {
                        updateActiveTab: vi.fn(),
                        updateSOLatLngInput: vi.fn(),
                    },
                },
                map: {
                    namespaced: true,
                    mutations: {
                        'update-user-location': vi.fn(),
                    },
                },
            },
        });

        commitSpy = vi.spyOn(store, 'commit');
    });

    afterEach(() => {
        wrapper?.unmount();
        vi.restoreAllMocks();
    });

    it('shows loader and hides content when loading', () => {
        store.state.sdp.loading = true;
        wrapper = mountComponent();
        expect(wrapper.find('.loader-modal').exists()).toBe(true);
        expect(wrapper.find('.template-spot-detail').exists()).toBe(false);
    });

    it('shows content and hides loader when loaded', () => {
        store.state.sdp.loading = false;
        wrapper = mountComponent();
        expect(wrapper.find('.loader-modal').exists()).toBe(false);
        expect(wrapper.find('.template-spot-detail').exists()).toBe(true);
    });

    it('fetches spot details on mount with encoded spotId', async () => {
        wrapper = mountComponent();
        await flushPromises();
        expect(actions.getSpotDetails).toHaveBeenCalledWith(expect.anything(), {
            spotId: 'SPOT%23123',
        });
    });

    it('updates user location on geolocation success using commit spy', () => {
        wrapper = mountComponent();
        wrapper.vm.onGeoSuccess({
            coords: { latitude: 28.61, longitude: 77.23 },
        });

        const call = commitSpy.mock.calls.find(
            ([type]) => type === 'map/update-user-location',
        );

        expect(call).toBeDefined();
        expect(call[1]).toEqual([77.23, 28.61]);
    });

    it('handles getSpotDetails failure gracefully', async () => {
        actions.getSpotDetails.mockRejectedValueOnce({
            DisplayMsg: 'API Error',
        });

        wrapper = mountComponent();
        await flushPromises();

        expect(wrapper.vm.$buefy.toast.open).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Something went wrong!',
                type: 'is-danger',
            }),
        );

        expect(mockPush).toHaveBeenCalledWith({
            name: 'error',
            params: { msg: 'API Error' },
        });
    });

    it('navigates to search portal with correct query params', async () => {
        wrapper = mountComponent();
        await wrapper.vm.goToSearchPortal([77.23, 28.61]);
        expect(mockPush).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'SearchPortal',
                query: expect.objectContaining({
                    latlng: '77.23,28.61',
                }),
            }),
        );
    });

    it('triggers availability update and refreshes data', async () => {
        wrapper = mountComponent();
        await wrapper.vm.changeAvailability(-1);
        expect(actions.updateAvailability).toHaveBeenCalled();
        expect(actions.getSpotDetails).toHaveBeenCalled();
    });

    it('requests user location permission on component mount', async () => {
        wrapper = mountComponent();
        await flushPromises();
        expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
    });
});
