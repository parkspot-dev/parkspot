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
                    AtomButton: {
                        template:
                            '<button @click="$emit(\'btn-click\')"><slot /></button>',
                    },
                    MoleculeSearchBox: true,
                    LoaderModal: true,
                    QrcodeVue: true,
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
                                    PaymentAppLabel: 'PhonePe',
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
        store = createStore({
            modules: {
                pendingPayments: {
                    namespaced: true,
                    state: () => ({
                        pendingPayments: [],
                        hasError: false,
                        errorMessage: '',
                        isLoading: false,
                    }),
                    actions: pendingActions,
                },
                user: {
                    namespaced: true,
                    state: () => ({
                        isAdmin: false,
                        isAuthReady: true,
                    }),
                },
            },
        });
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
        expect(wrapper.vm.filteredPendingPayments[0].BookingId).toBe('BK1001');
    });

    it('openPaymentModal initializes amount and default remark', () => {
        wrapper = mountPage();

        wrapper.vm.openPaymentModal({
            PaymentId: 10,
            BookingId: 'BK-10',
            BaseAmount: 2500,
            VoName: 'Rahul',
            Account: {
                PaymentAppLabel: 'PhonePe',
            },
        });

        expect(wrapper.vm.showPaymentModal).toBe(true);
        expect(wrapper.vm.editableAmount).toBe(2500);
        expect(wrapper.vm.draftAmountInput).toBe('2500');
        expect(wrapper.vm.editableRemark).toBe('Rent(Rahul, booking id: BK-10)');
    });

    it('shows account info even when QR is unavailable', async () => {
        wrapper = mountPage();
        wrapper.vm.selectedPayment = {
            PaymentId: 18,
            BookingId: 'BK-18',
            BaseAmount: 1800,
            SoName: 'Owner',
            Account: {
                Mobile: '9999990000',
                PaymentAppLabel: 'PhonePe',
            },
        };
        wrapper.vm.showPaymentModal = true;

        await wrapper.vm.$nextTick();

        expect(wrapper.vm.upiUrl).toBe('');
        expect(wrapper.find('.missing-upi-text').exists()).toBe(true);
        expect(wrapper.find('.account-info-value').text()).toContain(
            '9999990000/PhonePe',
        );
    });

    it('builds UPI URL from bank account + IFSC account details', () => {
        wrapper = mountPage();
        wrapper.vm.selectedPayment = {
            PaymentId: 21,
            BookingId: 'BK-21',
            BaseAmount: 3000,
            SoName: 'Bank Owner',
            Account: {
                FullName: 'Bank Owner',
                BankAccountNumber: '123456789',
                IfscCode: 'hdfc0001234',
            },
        };
        wrapper.vm.editableAmount = 3000;
        wrapper.vm.editableRemark = 'Monthly rent';

        expect(wrapper.vm.resolvedUpiId).toBe('123456789@HDFC0001234.ifsc.npci');
        expect(wrapper.vm.upiUrl).toContain(
            'pa=123456789%40HDFC0001234.ifsc.npci',
        );
        expect(wrapper.vm.upiUrl).toContain('pn=Bank%20Owner');
    });

    it('saveAmountEdit shows validation alert for zero value', () => {
        wrapper = mountPage();
        wrapper.vm.draftAmountInput = '0';

        wrapper.vm.saveAmountEdit();

        expect(alertMock).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Please enter a valid transfer amount',
            }),
        );
    });

    it('saveAmountEdit shows validation alert for empty input', () => {
        wrapper = mountPage();
        wrapper.vm.draftAmountInput = '';

        wrapper.vm.saveAmountEdit();

        expect(alertMock).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Please enter a valid transfer amount',
            }),
        );
    });

    it('saveAmountEdit shows validation alert for negative value', () => {
        wrapper = mountPage();
        wrapper.vm.draftAmountInput = '-99';

        wrapper.vm.saveAmountEdit();

        expect(alertMock).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Please enter a valid transfer amount',
            }),
        );
    });

    it('saveAmountEdit shows validation alert for non-numeric input', () => {
        wrapper = mountPage();
        wrapper.vm.draftAmountInput = 'abc';

        wrapper.vm.saveAmountEdit();

        expect(alertMock).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Please enter a valid transfer amount',
            }),
        );
    });

    it('openSuccessConfirmation blocks when amount edits are not saved', () => {
        wrapper = mountPage();
        wrapper.vm.editableAmount = 1000;
        wrapper.vm.draftAmountInput = '999';

        wrapper.vm.openSuccessConfirmation();

        expect(wrapper.vm.showSuccessModal).toBe(false);
        expect(alertMock).toHaveBeenCalledWith(
            expect.objectContaining({
                message:
                    'Please save or cancel amount changes before continuing',
            }),
        );
    });

    it('recordPaymentSuccess calls action and closes modal on success', async () => {
        wrapper = mountPage();
        wrapper.vm.selectedPayment = {
            PaymentId: 31,
            BookingId: 'BK-31',
            Account: {
                PaymentApp: 2,
            },
        };
        wrapper.vm.editableAmount = 2100;
        wrapper.vm.showPaymentModal = true;
        wrapper.vm.showSuccessModal = true;

        await wrapper.vm.recordPaymentSuccess();

        expect(pendingActions.updateAmountToSO).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                PaymentID: 31,
                AmountToSO: 2100,
                PaymentApp: 2,
            }),
        );
        expect(wrapper.vm.showSuccessModal).toBe(false);
        expect(wrapper.vm.showPaymentModal).toBe(false);
        expect(wrapper.vm.selectedPayment).toBe(null);
        expect(toastOpenMock).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Payment recorded successfully',
                type: 'is-success',
            }),
        );
    });
});
