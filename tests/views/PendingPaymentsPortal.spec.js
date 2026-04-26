import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createStore } from 'vuex';
import PendingPaymentsPortal from '@/views/PendingPaymentsPortal.vue';

describe('PendingPaymentsPortal.vue', () => {
    let wrapper;
    let store;
    let pendingActions;
    let alertMock;
    let toastOpenMock;

    const mountPage = (customMocks = {}) =>
        mount(PendingPaymentsPortal, {
            global: {
                plugins: [store],
                stubs: {
                    'AtomButton': {
                        template:
                            '<button @click="$emit(\'btn-click\')"><slot /></button>',
                    },
                    'MoleculeSearchBox': true,
                    'LoaderModal': true,
                    'QrcodeVue': true,
                    'router-link': {
                        template: '<a><slot /></a>',
                    },
                    'b-icon': true,
                    'b-table': {
                        template: '<div><slot /></div>',
                    },
                    'b-table-column': {
                        template:
                            '<div><slot :row="{}" :filters="{}"></slot></div>',
                    },
                    'b-modal': {
                        template: '<div><slot /></div>',
                    },
                    'b-input': {
                        props: [
                            'modelValue',
                            'value',
                            'readonly',
                            'placeholder',
                            'type',
                            'min',
                            'step',
                        ],
                        template: '<input />',
                    },
                },
                mocks: {
                    $buefy: {
                        dialog: { alert: alertMock },
                        toast: { open: toastOpenMock },
                    },
                    ...customMocks,
                },
            },
        });

    beforeEach(() => {
        alertMock = vi.fn();
        toastOpenMock = vi.fn();

        pendingActions = {
            getPendingPayments: vi.fn().mockResolvedValue(),
            updateAmountToSO: vi.fn().mockResolvedValue({ Success: true }),
        };

        store = createStore({
            modules: {
                pendingPayments: {
                    namespaced: true,
                    state: () => ({
                        pendingPayments: [
                            {
                                PaymentId: 1,
                                BookingId: 'BK1001',
                                BaseAmount: 1500,
                                Amount: 500,
                                SoName: 'SO One',
                                VoName: 'VO One',
                                Account: {
                                    UpiId: 'owner@upi',
                                    PaymentApp: 1,
                                },
                            },
                            {
                                PaymentId: 2,
                                BookingId: 'BK2002',
                                BaseAmount: 1800,
                                Amount: 700,
                                SoName: 'SO Two',
                                VoName: 'VO Two',
                                Account: {},
                            },
                        ],
                        hasError: false,
                        errorMessage: '',
                        isLoading: false,
                    }),
                    actions: pendingActions,
                },
                user: {
                    namespaced: true,
                    state: () => ({
                        isAdmin: true,
                        isAuthReady: true,
                    }),
                },
            },
        });

        vi.clearAllMocks();
    });

    afterEach(() => {
        wrapper?.unmount();
    });

    it('loads pending payments on create when admin and auth ready', async () => {
        wrapper = mountPage();
        await flushPromises();
        expect(pendingActions.getPendingPayments).toHaveBeenCalledTimes(1);
    });

    it('does not load pending payments when user is not admin', async () => {
        store.state.user.isAdmin = false;
        wrapper = mountPage();
        await flushPromises();
        expect(pendingActions.getPendingPayments).not.toHaveBeenCalled();
    });

    it('shows loader when pending payments are loading', () => {
        store.state.pendingPayments.isLoading = true;
        wrapper = mountPage();
        expect(wrapper.find('loader-modal-stub').exists()).toBe(true);
    });

    it('hides loader when pending payments are not loading', () => {
        store.state.pendingPayments.isLoading = false;
        wrapper = mountPage();
        expect(wrapper.find('loader-modal-stub').exists()).toBe(false);
    });

    it('shows error message in UI when hasError becomes true', async () => {
        wrapper = mountPage();
        store.state.pendingPayments.errorMessage = 'API failed';
        store.state.pendingPayments.hasError = true;
        await wrapper.vm.$nextTick();
        expect(alertMock).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'API failed',
            }),
        );
    });

    it('filters pending payments by booking id search', () => {
        wrapper = mountPage();
        wrapper.vm.searchBookingId('bk1001');
        expect(wrapper.vm.filteredPendingPayments).toHaveLength(1);
    });

    it('clearBookingIdSearch resets search', () => {
        wrapper = mountPage();
        wrapper.vm.bookingIdSearch = 'BK123';
        wrapper.vm.clearBookingIdSearch();
        expect(wrapper.vm.bookingIdSearch).toBe('');
    });

    it('openPaymentModal initializes amount and default remark', () => {
        wrapper = mountPage();
        wrapper.vm.openPaymentModal({
            PaymentId: 10,
            BookingId: 'BK-10',
            BaseAmount: 2500,
            VoName: 'Rahul',
            Account: {},
        });
        expect(wrapper.vm.showPaymentModal).toBe(true);
        expect(wrapper.vm.editableAmount).toBe(2500);
        expect(wrapper.vm.draftAmountInput).toBe('2500');
    });

    it('closePaymentModal resets everything', () => {
        wrapper = mountPage();
        wrapper.vm.openPaymentModal({
            PaymentId: 1,
            BaseAmount: 1000,
        });
        wrapper.vm.closePaymentModal();
        expect(wrapper.vm.selectedPayment).toBe(null);
        expect(wrapper.vm.showPaymentModal).toBe(false);
    });

    it('cancelAmountEdit resets draft amount', () => {
        wrapper = mountPage();
        wrapper.vm.editableAmount = 1200;
        wrapper.vm.draftAmountInput = '500';
        wrapper.vm.cancelAmountEdit();
        expect(wrapper.vm.draftAmountInput).toBe('1200');
    });

    it('toggleRemarkEdit enables editing and calls focus', async () => {
        wrapper = mountPage();
        const spy = vi.spyOn(wrapper.vm, 'focusRemarkInput');
        wrapper.vm.toggleRemarkEdit();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.isRemarkEditable).toBe(true);
        expect(spy).toHaveBeenCalled();
    });

    it('decodeTransactionText handles invalid URI', () => {
        wrapper = mountPage();
        const result = wrapper.vm.decodeTransactionText('%E0%A4%A');
        expect(result).toBe('%E0%A4%A');
    });

    it('getDefaultRemark uses fallback', () => {
        wrapper = mountPage();
        const result = wrapper.vm.getDefaultRemark({
            BookingId: 'BK1',
            VoName: 'Dev',
        });
        expect(result).toContain('Dev');
    });

    it('onRemarkInput updates remark', () => {
        wrapper = mountPage();
        wrapper.vm.onRemarkInput('Test');
        expect(wrapper.vm.editableRemark).toBe('Test');
    });

    it('formatAmount works', () => {
        wrapper = mountPage();
        expect(wrapper.vm.formatAmount(1500)).toContain('₹');
    });

    it('resolvedAccountInfo covers mobile branch', () => {
        wrapper = mountPage();
        wrapper.vm.selectedPayment = {
            Account: { Mobile: '9999999999', PaymentApp: 1 },
        };
        expect(wrapper.vm.resolvedAccountInfo).toContain('9999999999');
    });

    it('resolvedPayeeName fallback works', () => {
        wrapper = mountPage();
        wrapper.vm.selectedPayment = {
            SoName: 'Fallback',
            Account: {},
        };
        expect(wrapper.vm.resolvedPayeeName).toBe('Fallback');
    });

    it('finalAmount converts properly', () => {
        wrapper = mountPage();
        wrapper.vm.editableAmount = '1500';
        expect(wrapper.vm.finalAmount).toBe(1500);
    });

    it('builds UPI URL', () => {
        wrapper = mountPage();
        wrapper.vm.selectedPayment = {
            PaymentId: 1,
            SoName: 'Owner',
            Account: {
                BankAccountNumber: '123',
                IfscCode: 'hdfc123',
            },
        };
        wrapper.vm.editableAmount = 1000;
        wrapper.vm.editableRemark = 'Rent';
        expect(wrapper.vm.upiUrl).toContain('upi://pay');
    });

    it('missing UPI shows empty', async () => {
        wrapper = mountPage();
        wrapper.vm.selectedPayment = { Account: {} };
        wrapper.vm.showPaymentModal = true;
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.upiUrl).toBe('');
    });

    it('openSuccessConfirmation blocks invalid', () => {
        wrapper = mountPage();
        wrapper.vm.draftAmountInput = '100';
        wrapper.vm.editableAmount = 200;
        wrapper.vm.openSuccessConfirmation();
        expect(alertMock).toHaveBeenCalled();
    });

    it('openSuccessConfirmation works when valid', () => {
        wrapper = mountPage();
        wrapper.vm.draftAmountInput = '100';
        wrapper.vm.editableAmount = 100;
        wrapper.vm.openSuccessConfirmation();
        expect(wrapper.vm.showSuccessModal).toBe(true);
    });

    it('recordPaymentSuccess success', async () => {
        wrapper = mountPage();
        wrapper.vm.selectedPayment = {
            PaymentId: 1,
            Account: { PaymentApp: 2 },
        };
        wrapper.vm.editableAmount = 1000;
        wrapper.vm.showPaymentModal = true;
        wrapper.vm.showSuccessModal = true;

        await wrapper.vm.recordPaymentSuccess();

        expect(pendingActions.updateAmountToSO).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                PaymentID: 1,
                AmountToSO: 1000,
            }),
        );

        expect(toastOpenMock).toHaveBeenCalledWith(
            expect.objectContaining({ type: 'is-success' }),
        );
    });

    it('recordPaymentSuccess failure', async () => {
        pendingActions.updateAmountToSO.mockResolvedValue({ Success: false });

        wrapper = mountPage();
        wrapper.vm.selectedPayment = { PaymentId: 2, Account: {} };
        wrapper.vm.editableAmount = 1000;

        await wrapper.vm.recordPaymentSuccess();

        expect(alertMock).toHaveBeenCalled();
    });

    it('alertError shows dialog', () => {
        wrapper = mountPage();
        wrapper.vm.alertError('Error');
        expect(alertMock).toHaveBeenCalled();
    });
});
