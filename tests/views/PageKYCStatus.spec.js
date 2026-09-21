import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createStore } from 'vuex';
import PageKYCStatus from '@/views/PageKYCStatus.vue';
import { flushPromises } from '@vue/test-utils';

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
    getIDTypeLabel: (val) => (val === 1 ? 'Aadhaar' : 'RC'),
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
                            User: {
                                FullName: 'Test User',
                                UserName: 'testuser',
                                Mobile: '9876543210',
                                KYCStatus: 0,
                            },
                            IDVerifiedDetails: { Name: 'Test User', IDType: 1 },
                            OwnershipVerifiedDetails: {
                                Name: 'Test User',
                                IDType: 2,
                            },
                            IdentityDocument: ['front.jpg'],
                            OwnershipDocument: [],
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
                'b-table': {
                    props: ['data'],
                    template: `
                        <div class="b-table-stub">
                            <slot />
                            <slot name="default" :row="data[0]" />
                        </div>
                    `,
                },
                'b-table-column': {
                    template: '<div><slot /><slot name="default" :row="{ User: { FullName: \'Test\', Mobile: \'999\', KYCStatus: 0 } }" /></div>',
                },
                'b-modal': {
                    props: ['modelValue'],
                    template: '<div class="b-modal-stub" v-if="modelValue"><slot /></div>',
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

    it('fetches pending users on mount', async () => {
        const wrapper = factory();
        await wrapper.vm.$nextTick();
        await flushPromises();

        expect(actions.fetchKycPendingUsers).toHaveBeenCalledTimes(1);
    });

    it('shows loader when isLoading is true', () => {
        store.state.kycStatusPortal.isLoading = true;
        const wrapper = factory();
        expect(wrapper.find('.loader-modal').exists()).toBe(true);
    });

    it('calls fetchKycPendingUsers on search and clear actions', async () => {
        const wrapper = factory({ query: { mobile: '9876543210' } });

        await wrapper.find('.search-btn').trigger('click');
        await wrapper.find('.clear-btn').trigger('click');

        expect(actions.updateMobileInput).toHaveBeenCalledTimes(3);
        expect(actions.fetchKycPendingUsers).toHaveBeenCalledTimes(3);
    });

    it('updates KYC status', async () => {
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

    it('opens image preview modal', async () => {
        const wrapper = factory();

        wrapper.vm.openImage('front.jpg');

        expect(wrapper.vm.showImageModal).toBe(true);
        expect(wrapper.vm.selectedImage).toBe('front.jpg');
    });

    it('opens details modal for ID and Ownership with documents', async () => {
        const wrapper = factory();
        const fullUser = {
            User: { FullName: 'Test', Mobile: '123', KYCStatus: 1 },
            IDVerifiedDetails: { Name: 'Test', Gender: 'M', DOB: '2000-01-01', MaskedAadhar: 'XXXX', Address: 'Addr', IDType: 1 },
            OwnershipVerifiedDetails: { Name: 'Test', VehicleNumber: 'DL01', Expiry: '2030', Make: 'Toyota', Model: 'Camry', Address: 'Addr', IDType: 2 },
            IdentityDocument: ['id.jpg'],
            OwnershipDocument: ['rc.jpg'],
        };
        store.state.kycStatusPortal.users = [fullUser];
        await wrapper.vm.$nextTick();

        wrapper.vm.openDetailsModal(fullUser, 'id');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.showDetailsModal).toBe(true);

        wrapper.vm.openDetailsModal(fullUser, 'ownership');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.activeModalType).toBe('ownership');

        // Without details
        const emptyUser = { User: { FullName: 'Empty' } };
        wrapper.vm.openDetailsModal(emptyUser, 'id');
        await wrapper.vm.$nextTick();
        wrapper.vm.openDetailsModal(emptyUser, 'ownership');
        await wrapper.vm.$nextTick();
    });

    it('shows error alert when hasError becomes true', async () => {
        const wrapper = factory();

        wrapper.vm.$store.state.kycStatusPortal.errorMessage = 'Some error';
        wrapper.vm.$store.state.kycStatusPortal.hasError = true;
        await wrapper.vm.$nextTick();

        expect(buefyMock.dialog.alert).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Some error',
            }),
        );
    });

    it('covers getIDTypeLabel and getKYCStatusLabel helper methods', () => {
        const wrapper = factory();
        expect(wrapper.vm.getIDTypeLabel(1)).toBe('Aadhaar');
        expect(wrapper.vm.getKYCStatusLabel(0)).toBe('PENDING');
    });

    it('handles search and clear edge cases correctly', async () => {
        const wrapper = factory({ query: {} });
        await wrapper.vm.searchUsersWithMobile('9876543210');
        await wrapper.vm.searchUsersWithMobile('');
        await wrapper.vm.onClearMobileInput();
        await wrapper.vm.onStatusUpdate(store.state.kycStatusPortal.users[0], 'INVALID_STATUS');
    });
});
