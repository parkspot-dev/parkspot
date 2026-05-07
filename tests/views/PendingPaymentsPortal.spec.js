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

    it('does not load pending payments when auth is not ready', async () => {
        store.state.user.isAuthReady = false;
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
            VoName: 'Dev Shrivastav',
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
            VoName: 'Dev Shrivastav',
        });
        expect(result).toContain('Dev Shrivastav');
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
            Account: { Mobile: '855788258', PaymentApp: 1 },
        };
        expect(wrapper.vm.resolvedAccountInfo).toContain('855788258');
    });

    it('resolvedPayeeName fallback works', () => {
        wrapper = mountPage();
        wrapper.vm.selectedPayment = {
            SoName: 'Dev Shrivastav',
            Account: {},
        };
        expect(wrapper.vm.resolvedPayeeName).toBe('Dev Shrivastav');
    });

    it('resolvedPayeeName prefers account full name', () => {
        wrapper = mountPage();
        wrapper.vm.selectedPayment = {
            SoName: 'Dev Shrivastav',
            Account: { FullName: 'Dev Shrivastav' },
        };
        expect(wrapper.vm.resolvedPayeeName).toBe('Dev Shrivastav');
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
            SoName: 'Dev Shrivastav',
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

    it('resolvedUpiId prefers the explicit upi id', () => {
        wrapper = mountPage();
        wrapper.vm.selectedPayment = {
            Account: {
                UpiId: 'owner@upi',
                BankAccountNumber: '123',
                IfscCode: 'hdfc1234',
            },
        };
        expect(wrapper.vm.resolvedUpiId).toBe('owner@upi');
    });

    it('resolvedUpiId builds the bank account fallback', () => {
        wrapper = mountPage();
        wrapper.vm.selectedPayment = {
            Account: {
                BankAccountNumber: '123 456',
                IfscCode: 'hdfc1234',
            },
        };
        expect(wrapper.vm.resolvedUpiId).toBe('123456@HDFC1234.ifsc.npci');
    });

    it('resolvedUpiId returns an empty string when no payment details are available', () => {
        wrapper = mountPage();
        wrapper.vm.selectedPayment = {
            Account: {},
        };
        expect(wrapper.vm.resolvedUpiId).toBe('');
    });

    it('upiUrl uses the fallback transaction reference when remark is empty', () => {
        wrapper = mountPage();
        wrapper.vm.selectedPayment = {
            PaymentId: 44,
            SoName: 'Dev Shrivastav',
            Account: {
                UpiId: 'owner@upi',
            },
        };
        wrapper.vm.editableAmount = 1000;
        wrapper.vm.editableRemark = '';
        expect(wrapper.vm.upiUrl).toContain('tr=Ref44');
    });

    it('saveAmountEdit updates the editable amount for valid input', () => {
        wrapper = mountPage();
        wrapper.vm.draftAmountInput = '2500';
        wrapper.vm.saveAmountEdit();
        expect(wrapper.vm.editableAmount).toBe(2500);
    });

    it('saveAmountEdit shows an error for invalid input', () => {
        wrapper = mountPage();
        wrapper.vm.draftAmountInput = '0';
        wrapper.vm.saveAmountEdit();
        expect(alertMock).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Please enter a valid transfer amount',
            }),
        );
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

    it('closeSuccessModal hides the success modal', () => {
        wrapper = mountPage();
        wrapper.vm.showSuccessModal = true;
        wrapper.vm.closeSuccessModal();
        expect(wrapper.vm.showSuccessModal).toBe(false);
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

    it('recordPaymentSuccess returns early when no payment is selected', async () => {
        wrapper = mountPage();
        wrapper.vm.selectedPayment = null;
        await wrapper.vm.recordPaymentSuccess();
        expect(pendingActions.updateAmountToSO).not.toHaveBeenCalled();
    });

    it('searchBookingId trims the search value', () => {
        wrapper = mountPage();
        wrapper.vm.searchBookingId('  BK1001  ');
        expect(wrapper.vm.bookingIdSearch).toBe('BK1001');
    });

    it('getSpotId trims the site id', () => {
        wrapper = mountPage();
        expect(wrapper.vm.getSpotId({ SiteID: '  SITE-1  ' })).toBe('SITE-1');
    });

    it('getSpotDetailRoute returns the exact route object', () => {
        wrapper = mountPage();
        expect(wrapper.vm.getSpotDetailRoute('SITE-1')).toEqual({
            name: 'spot-detail',
            params: { spotId: 'SITE-1' },
        });
    });

    it('getBookingPortalRoute returns the exact route object', () => {
        wrapper = mountPage();
        expect(wrapper.vm.getBookingPortalRoute(' BK1001 ')).toEqual({
            name: 'booking-portal',
            query: { bookingId: 'BK1001' },
        });
    });

    it('alertError shows dialog', () => {
        wrapper = mountPage();
        wrapper.vm.alertError('Error');
        expect(alertMock).toHaveBeenCalled();
    });

    it('does not render table-wrapper when user is not admin', () => {
        store.state.user.isAdmin = false;
        wrapper = mountPage();
        expect(wrapper.find('.table-wrapper').exists()).toBe(false);
    });

    it('does not render table-wrapper when auth is not ready', () => {
        store.state.user.isAuthReady = false;
        wrapper = mountPage();
        expect(wrapper.find('.table-wrapper').exists()).toBe(false);
    });

    it('filteredPendingPayments returns full list when search is empty', () => {
        wrapper = mountPage();
        wrapper.vm.bookingIdSearch = '';
        expect(wrapper.vm.filteredPendingPayments).toHaveLength(2);
    });

    it('filteredPendingPayments matches case insensitive search', () => {
        wrapper = mountPage();
        wrapper.vm.searchBookingId('bk1001');
        expect(wrapper.vm.filteredPendingPayments[0].BookingId).toBe('BK1001');
    });

    it('resolvedUpiId strips spaces and uppercases IFSC', () => {
        wrapper = mountPage();
        wrapper.vm.selectedPayment = {
            Account: {
                BankAccountNumber: '123 456',
                IfscCode: 'hdfc0001',
            },
        };

        expect(wrapper.vm.resolvedUpiId).toBe('123456@HDFC0001.ifsc.npci');
    });

    it('upiUrl contains encoded remark and correct amount', () => {
        wrapper = mountPage();
        wrapper.vm.selectedPayment = {
            PaymentId: 1,
            SoName: 'Dev',
            Account: { UpiId: 'owner@upi' },
        };

        wrapper.vm.editableAmount = 1500;
        wrapper.vm.editableRemark = 'Rent Payment';
        const url = wrapper.vm.upiUrl;
        expect(url).toContain('upi://pay');
        expect(url).toContain('am=1500.00');
        expect(url).toContain('Rent%20Payment');
    });

    it('openPaymentModal sets correct initial state', () => {
        wrapper = mountPage();

        const payment = {
            PaymentId: 5,
            BookingId: 'BK5',
            BaseAmount: 2000,
            VoName: 'Dev',
            Account: {},
        };

        wrapper.vm.openPaymentModal(payment);
        expect(wrapper.vm.selectedPayment).toEqual(payment);
        expect(wrapper.vm.editableAmount).toBe(2000);
        expect(wrapper.vm.draftAmountInput).toBe('2000');
        expect(wrapper.vm.showPaymentModal).toBe(true);
    });

    it('closePaymentModal fully resets state', () => {
        wrapper = mountPage();
        wrapper.vm.selectedPayment = { PaymentId: 1 };
        wrapper.vm.editableAmount = 1000;
        wrapper.vm.draftAmountInput = '1000';
        wrapper.vm.editableRemark = 'Test';
        wrapper.vm.isRemarkEditable = true;
        wrapper.vm.showPaymentModal = true;

        wrapper.vm.closePaymentModal();
        expect(wrapper.vm.selectedPayment).toBe(null);
        expect(wrapper.vm.editableAmount).toBe(0);
        expect(wrapper.vm.draftAmountInput).toBe('0');
        expect(wrapper.vm.editableRemark).toBe('');
        expect(wrapper.vm.isRemarkEditable).toBe(false);
        expect(wrapper.vm.showPaymentModal).toBe(false);
    });

    it('openSuccessConfirmation blocks when draft and editable mismatch', () => {
        wrapper = mountPage();
        wrapper.vm.draftAmountInput = '100';
        wrapper.vm.editableAmount = 200;
        wrapper.vm.openSuccessConfirmation();
        expect(alertMock).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String),
            }),
        );
    });

    it('recordPaymentSuccess sends correct payload to action', async () => {
        wrapper = mountPage();
        wrapper.vm.selectedPayment = {
            PaymentId: 99,
            Account: {},
        };

        wrapper.vm.editableAmount = 1234;
        await wrapper.vm.recordPaymentSuccess();
        expect(pendingActions.updateAmountToSO).toHaveBeenCalledWith(
            expect.any(Object),
            expect.objectContaining({
                PaymentID: 99,
                AmountToSO: 1234,
            }),
        );
    });

    it('recordPaymentSuccess shows success toast with message', async () => {
        wrapper = mountPage();
        wrapper.vm.selectedPayment = {
            PaymentId: 1,
            Account: {},
        };

        wrapper.vm.editableAmount = 1000;
        await wrapper.vm.recordPaymentSuccess();
        expect(toastOpenMock).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'is-success',
                message: expect.any(String),
            }),
        );
    });

    it('alertError passes correct payload to dialog', () => {
        wrapper = mountPage();
        wrapper.vm.alertError('Test error');

        expect(alertMock).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Test error',
                type: 'is-danger',
            }),
        );
    });
});
