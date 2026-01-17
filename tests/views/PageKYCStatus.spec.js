import { mount } from "@vue/test-utils";
import { describe, it, expect,vi, beforeEach } from "vitest";
import { createStore } from "vuex";
import PageKYCStatus from "@/views/PageKYCStatus.vue";


vi.mock('@/constant/enums', () => ({
    KYCStatusLabel: ['PENDING', 'APPROVED', 'REJECTED'],
    KYCStatus: {
        PENDING: 0,
        APPROVED: 1,
        REJECTED: 2,
    },
    getKYCStatusLabel: (val) => {
        const map = {
            0: 'PENDING',
            1: 'APPROVED',
            2: 'REJECTED',
        };
        return map[val];
    },
}));


let store;
let actions;

beforeEach(() => {
    vi.clearAllMocks();
    
    actions = {
        fetchKycPendingUsers: vi.fn(),
        updateStatus: vi.fn(),
        updateMobileInput: vi.fn(),
    };

    store = createStore({
        modules: {
            kycStatusPortal: {
                namespaced: true,
                state: () => ({
                    isLoading: false,
                    hasError: false,
                    errorMessage: '',
                    users: [
                        {
                            ID: 1,
                            FullName: 'Test User',
                            Mobile: '9876543210',
                            KYCStatus: 0,
                            IDProofURLs: ['front.jpg'],
                            OwnershipProofURLs: [],
                        },
                    ],
                    searchMobile: '',
                }),
                actions,
            },
        },
    });
});

const routerMock = {
    push: vi.fn(),
};

const buefyMock = {
    dialog: {
        alert: vi.fn(),
    },
    toast: {
        open: vi.fn(),
    },
};

const factory = (routerOverrides = {}) =>
    mount(PageKYCStatus, {
        global: {
            plugins: [store],
            stubs: {
                'LoaderModal': {
                    template: '<div class="loader-modal"></div>',
                },
                'SelectInput': true,
                'MoleculeSearchBox': {
                    template: `
                        <div class="search-box">
                            <button class="search-btn" @click="$emit('on-search', '9876543210')">
                                search
                            </button>
                            <button class="clear-btn" @click="$emit('clear-input')">
                                clear
                            </button>
                        </div>
                    `,
                },
                'b-table': true,
                'b-modal': true,
            },
            config: {
                compilerOptions: {
                    isCustomElement: (tag) => tag === 'b-table-column',
                },
            },
            mocks: {
                $router: routerMock,
                $route: {
                    query: {},
                    ...routerOverrides,
                },
                $buefy: buefyMock,
            },
        },
    });


describe('PageKYCStatus.vue', () => {
    it('mounts successfully', () => {
        const wrapper = factory();
        expect(wrapper.exists()).toBe(true);
    });

    it('refreshes pending users safely on mount', async () => {
        const wrapper =factory();
        await wrapper.vm.$nextTick();

        expect(actions.fetchKycPendingUsers).toHaveBeenCalledTimes(1);
    });

    it('shows loader when isLoading is true', () => {
        store.state.kycStatusPortal.isLoading = true;
        const wrapper = factory();
        expect(wrapper.find('.loader-modal').exists()).toBe(true);
    });

    it('calls refreshPendingUsersSafely on search and clear actions', async () => {
        const wrapper = factory({ query: { mobile: '9876543210' } });

        await wrapper.find('.search-btn').trigger('click');
        await wrapper.find('.clear-btn').trigger('click');

        // updateMobileInput is expected to be called 3 times:
        // 1) during component creation to initialize state from route
        // 2) when searching with a mobile number
        // 3) when clearing the search input

        expect(actions.updateMobileInput).toHaveBeenCalledTimes(3);
        expect(actions.fetchKycPendingUsers).toHaveBeenCalledTimes(3);
    });

    it('does not manually clear users during search', async () => {
        const wrapper = factory();
        const commitSpy = vi.spyOn(store, 'commit');

        await wrapper.find('.search-btn').trigger('click');

        expect(commitSpy).not.toHaveBeenCalledWith(
            'kycStatusPortal/set-users',
            [],
        );
    });

    it('updates KYC status and refreshes list', async () => {
        const wrapper = factory();

        await wrapper.vm.onStatusUpdate(
            store.state.kycStatusPortal.users[0],
            'APPROVED',
        );

        expect(actions.updateStatus).toHaveBeenCalled();
        expect(actions.fetchKycPendingUsers).toHaveBeenCalled();

        expect(buefyMock.toast.open).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.stringContaining('KYC Status updated'),
                type: 'is-success',
            }),
        );
    });

    it('open image preview modal', async () => {
        const wrapper = factory();

        wrapper.vm.openImage('front.jpg');

        expect(wrapper.vm.showImageModal).toBe(true);
        expect(wrapper.vm.selectedImage).toBe('front.jpg');
    });

    it('shows error alert when hasError becomes true', async () => {
        const wrapper = factory();

        store.state.kycStatusPortal.hasError = true;
        store.state.kycStatusPortal.errorMessage = 'Some error';
        await wrapper.vm.$nextTick();

        expect(buefyMock.dialog.alert).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Some error',
            }),
        );
    });

    it('restores previous users if fetch fails', async () => {
        actions.fetchKycPendingUsers.mockRejectedValueOnce(
            new Error('API failed'),
        );

        const initialUsers = [...store.state.kycStatusPortal.users];
        const wrapper = factory();

        await wrapper.vm.refreshPendingUsersSafely();

        expect(store.state.kycStatusPortal.users).toEqual(initialUsers);
        expect(buefyMock.dialog.alert).toHaveBeenCalled();
    });
});
