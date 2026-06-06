import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import PageSearchPortal from '@/views/PageSearchPortal.vue';
import { mayaClient } from '@/services/api';

vi.mock('@/services/api', () => ({
    mayaClient: {
        patch: vi.fn(),
    },
}));

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
        vi.unstubAllGlobals();
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

    it('shows non-cancelable alert and reloads on both dialog actions when updateRequest fails', async () => {
        const alert = vi.fn();
        const originalLocation = window.location;
        const reloadMock = vi.fn();

        Object.defineProperty(window, 'location', {
            configurable: true,
            value: {
                ...originalLocation,
                reload: reloadMock,
            },
        });

        mayaClient.patch.mockResolvedValue({
            ErrorCode: 'ERR_001',
            DisplayMsg: 'Unable to update',
        });

        wrapper = mountPage(store, {
            $buefy: {
                dialog: { alert },
                toast: { open: vi.fn() },
            },
        });

        await wrapper.vm.updateRequest({ id: 1 });
        expect(alert).toHaveBeenCalledWith(
            expect.objectContaining({
                title: 'Error',
                message: 'Unable to update',
                canCancel: false,
                onConfirm: expect.any(Function),
                onCancel: expect.any(Function),
            }),
        );

        const dialogConfig = alert.mock.calls[0][0];
        dialogConfig.onConfirm();
        dialogConfig.onCancel();
        expect(reloadMock).toHaveBeenCalledTimes(2);
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: originalLocation,
        });
    });
});
