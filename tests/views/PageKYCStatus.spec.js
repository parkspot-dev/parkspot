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
                    template:
                        '<div class="search-box">' +
                        '<button class="search-btn" @click="$emit(\'on-search\', \'9876543210\')">search</button>' +
                        '<button class="clear-btn" @click="$emit(\'clear-input\')">clear</button>' +
                        '</div>',
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

    it('calls fetchKycPendingUsers on mount', () => {
        factory();
        expect(actions.fetchKycPendingUsers).toHaveBeenCalled();
    });

    it('shows loader when isLoading is true', () => {
        store.state.kycStatusPortal.isLoading = true;
        const wrapper = factory();
        expect(wrapper.find('.loader-modal').exists()).toBe(true);
    });

    it('searches user by mobile and updates route', async () => {
        const wrapper = factory();
        await wrapper.find('.search-btn').trigger('click');

        expect(actions.updateMobileInput).toHaveBeenCalledWith(
            expect.anything(),
            '9876543210',
        );
        expect(routerMock.push).toHaveBeenCalled();
    });

    it('clears mobile input and resets route', async () => {
        const wrapper = factory({ query: { mobile: '9876543210' } });
        await wrapper.find('.clear-btn').trigger('click');

        expect(actions.updateMobileInput).toHaveBeenCalledWith(
            expect.anything(),
            ''
        );
        expect(routerMock.push).toHaveBeenCalled();
    });

    it('updates KYC status on select change', async () => {
        const wrapper = factory();

        await wrapper.vm.onStatusUpdate(
            store.state.kycStatusPortal.users[0],
            'APPROVED',
        );

        expect(actions.updateStatus).toHaveBeenCalled();
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
});
