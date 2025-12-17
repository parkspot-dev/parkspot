import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createStore } from 'vuex';
import PageSpotDetail from '@/views/PageSpotDetail.vue';

const mockPush = vi.fn();

const mockRouter = {
    push: mockPush,
};

const mockRoute = {
    params: {
        spotId: 'SPOT#123',
    },
};

describe('PageSpotDetail.vue', () => {
    let store;
    let actions;

    const mountComponent = () =>
        mount(PageSpotDetail, {
            global: {
                plugins: [store],
                mocks: {
                    $router: mockRouter,
                    $route: mockRoute,
                    $buefy: {
                        toast: {
                            open: vi.fn(),
                        },
                    },
                },
                stubs: {
                    LoaderModal: {
                        template: '<div class="loader-modal"></div>',
                    },
                    TemplateSpotDetail: {
                        template: '<div class="template-spot-detail"></div>',
                    },
                },
            },
        });

    beforeEach(() => {
        mockPush.mockClear();

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
                    state: {
                        loading: false,
                        title: 'Spot Detail',
                    },
                    actions,
                },
                searchPortal: {
                    namespaced: true,
                    state: {
                        activeTab: 1,
                    },
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

        Object.defineProperty(global.navigator, 'geolocation', {
            value: {
                getCurrentPosition: vi.fn(),
            },
            configurable: true,
        });
    });

    it('shows loader when page is loading', () => {
        store.state.sdp.loading = true;
        const wrapper = mountComponent();

        expect(wrapper.find('.loader-modal').exists()).toBe(true);
        expect(wrapper.find('.template-spot-detail').exists()).toBe(false);
    });

    it('renders spot detail template when loading is false', () => {
        const wrapper = mountComponent();
        expect(wrapper.find('.template-spot-detail').exists()).toBe(true);
    });

    it('fetches spot details on mount with encoded spotId', async () => {
        mountComponent();
        await flushPromises();

        expect(actions.getSpotDetails).toHaveBeenCalledWith(expect.anything(), {
            spotId: 'SPOT%23123',
        });
    });

    it('requests user location on mount', async () => {
        mountComponent();
        await flushPromises();

        expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
    });

    it('updates user location on geolocation success', () => {
        const wrapper = mountComponent();

        wrapper.vm.onGeoSuccess({
            coords: {
                latitude: 28.61,
                longitude: 77.23,
            },
        });

        expect(store._mutations['map/update-user-location']).toBeTruthy();
    });

    it('navigates to search portal with correct params', async () => {
        const wrapper = mountComponent();

        await wrapper.vm.goToSearchPortal([77.23, 28.61]);

        expect(mockPush).toHaveBeenCalledWith({
            name: 'SearchPortal',
            query: {
                latlng: '77.23,28.61',
                tab: expect.any(String),
            },
        });
    });

    it('updates availability and reloads spot details', async () => {
        const wrapper = mountComponent();

        await wrapper.vm.changeAvailability(-1);

        expect(actions.updateAvailability).toHaveBeenCalled();
        expect(actions.getSpotDetails).toHaveBeenCalled();
    });

    it('updates last call date and reloads spot details', async () => {
        const wrapper = mountComponent();

        await wrapper.vm.changeLastCallDate('2025-12-20');

        expect(actions.updateLastCallDate).toHaveBeenCalled();
        expect(actions.getSpotDetails).toHaveBeenCalled();
    });

    it('updates remark and reloads spot details', async () => {
        const wrapper = mountComponent();

        await wrapper.vm.changeRemark('Updated remark');

        expect(actions.updateRemark).toHaveBeenCalled();
        expect(actions.getSpotDetails).toHaveBeenCalled();
    });
});
