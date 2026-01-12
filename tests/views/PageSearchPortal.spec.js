import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import PageSearchPortal from '@/views/PageSearchPortal.vue';

const createStoreMock = (stateOverrides = {}) =>
    createStore({
        modules: {
            searchPortal: {
                namespaced: true,
                state: () => ({
                    activeTab: 0,
                    SOLatLngInput: '',
                    searchMobile: '',
                    parkingRequests: [],
                    interestedVOList: [],
                    loading: false,
                    hasError: false,
                    errorMessage: '',
                    ...stateOverrides.searchPortal,
                }),
                actions: {
                    updateActiveTab: vi.fn(),
                    resetError: vi.fn(),
                    getAgents: vi.fn(),
                    getParkingRequests: vi.fn(),
                    getInterestedVO: vi.fn(),
                    updateMobileInput: vi.fn(),
                    updateSOLatLngInput: vi.fn(),
                },
            },
            user: {
                namespaced: true,
                state: () => ({
                    isAdmin: true,
                    userProfile: { FullName: 'Dev Shrivastav' },
                }),
                actions: {
                    getUserProfile: vi.fn(),
                },
            },
        },
    });

const mountPage = (store, mocks = {}) =>
    mount(PageSearchPortal, {
        global: {
            plugins: [store],
            stubs: {
                'b-tabs': { template: '<div><slot /></div>' },
                'b-tab-item': { template: '<div><slot /></div>' },
                'TemplateSearchPortal': true,
                'MoleculeSearchBox': true,
            },
            mocks: {
                $router: {
                    push: vi.fn(),
                    resolve: () => ({ href: '/srp' }),
                },
                $route: {
                    path: '/search-portal',
                    fullPath: '/search-portal',
                    query: {},
                },
                $buefy: {
                    dialog: { alert: vi.fn() },
                    toast: { open: vi.fn() },
                },
                ...mocks,
            },
        },
    });

describe('PageSearchPortal.vue', () => {
    let wrapper;
    let store;

    beforeEach(() => {
        store = createStoreMock();
        vi.clearAllMocks();
    });

    afterEach(() => {
        wrapper?.unmount();
    });

    it('renders search portal root', () => {
        wrapper = mountPage(store);
        expect(wrapper.find('.search-portal-root').exists()).toBe(true);
    });

    it('sanitizeMobile works correctly', () => {
        wrapper = mountPage(store);
        expect(wrapper.vm.sanitizeMobile('+91-9876543210')).toBe('9876543210');
        expect(wrapper.vm.sanitizeMobile('123')).toBe(null);
    });

    it('navigates for valid mobile number', () => {
        const push = vi.fn();
        wrapper = mountPage(store, { $router: { push } });
        wrapper.vm.searchRequestWithMobile('9876543210');
        expect(push).toHaveBeenCalled();
    });

    it('shows alert for invalid mobile number', () => {
        const alert = vi.fn();
        wrapper = mountPage(store, {
            $buefy: { dialog: { alert } },
        });

        wrapper.vm.searchRequestWithMobile('123');
        expect(alert).toHaveBeenCalled();
    });

    it('shows alert when hasError changes to true', async () => {
        const alert = vi.fn();
        wrapper = mountPage(store, {
            $buefy: { dialog: { alert } },
        });

        store.state.searchPortal.errorMessage = 'Some error';
        store.state.searchPortal.hasError = true;
        await wrapper.vm.$nextTick();
        expect(alert).toHaveBeenCalled();
    });

    it('updates route when activeTabView changes', async () => {
        const push = vi.fn();
        wrapper = mountPage(store, { $router: { push } });
        wrapper.vm.activeTabView = 1;
        await wrapper.vm.$nextTick();
        expect(push).toHaveBeenCalled();
    });

    it('handleConfirm navigates back', () => {
        const push = vi.fn();
        store = createStoreMock({
            searchPortal: {
                searchMobile: '9876543210',
                SOLatLngInput: '12,77',
            },
        });

        wrapper = mountPage(store, { $router: { push } });
        wrapper.vm.handleConfirm();
        expect(push).toHaveBeenCalled();
    });
});
