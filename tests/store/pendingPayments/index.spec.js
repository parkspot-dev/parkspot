import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createStore } from 'vuex';
import pendingPayments from '@/store/pendingPayments';
import { mayaClient } from '@/services/api';
import { getPaymentAppTypeLabel } from '@/constant/enums';

vi.mock('@/services/api', () => ({
    mayaClient: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

vi.mock('@/constant/enums', () => ({
    getPaymentAppTypeLabel: vi.fn(),
}));

describe('PendingPayments Store', () => {
    let store;

    beforeEach(() => {
        vi.clearAllMocks();
        getPaymentAppTypeLabel.mockImplementation((code) => {
            if (code === 1) return 'PhonePe';
            if (code === 2) return 'Gpay';
            return 'Not Set';
        });

        store = createStore({
            modules: {
                pendingPayments: {
                    ...pendingPayments,
                    state: { ...pendingPayments.state },
                },
            },
        });
    });

    afterEach(() => {
        store = null;
    });

    describe('mutations', () => {
        it('set-pending-payments sets data and clears error state', () => {
            store.state.pendingPayments.hasError = true;
            store.state.pendingPayments.errorMessage = 'Old error';

            store.commit('pendingPayments/set-pending-payments', [
                { PaymentId: 1 },
            ]);

            expect(store.state.pendingPayments.pendingPayments).toEqual([
                { PaymentId: 1 },
            ]);
            expect(store.state.pendingPayments.hasError).toBe(false);
            expect(store.state.pendingPayments.errorMessage).toBe('');
        });

        it('record-payment-success removes by paymentId when present', () => {
            store.state.pendingPayments.pendingPayments = [
                { PaymentId: 101, BookingId: 'B101' },
                { PaymentId: 202, BookingId: 'B202' },
            ];

            store.commit('pendingPayments/record-payment-success', {
                paymentId: 101,
            });

            expect(store.state.pendingPayments.pendingPayments).toEqual([
                { PaymentId: 202, BookingId: 'B202' },
            ]);
        });

        it('record-payment-success removes by bookingId when paymentId missing', () => {
            store.state.pendingPayments.pendingPayments = [
                { PaymentId: 101, BookingId: 'B101' },
                { PaymentId: 202, BookingId: 'B202' },
            ];

            store.commit('pendingPayments/record-payment-success', {
                bookingId: 'B202',
            });

            expect(store.state.pendingPayments.pendingPayments).toEqual([
                { PaymentId: 101, BookingId: 'B101' },
            ]);
        });
    });

    describe('actions', () => {
        it('getPendingPayments sets loading true while request is pending and false after resolve', async () => {
            let resolveRequest;
            const pendingRequest = new Promise((resolve) => {
                resolveRequest = resolve;
            });
            mayaClient.get.mockReturnValue(pendingRequest);

            const dispatchPromise = store.dispatch('pendingPayments/getPendingPayments');

            await Promise.resolve();

            expect(store.state.pendingPayments.isLoading).toBe(true);

            resolveRequest({ PendingPayments: [] });
            await dispatchPromise;

            expect(store.state.pendingPayments.isLoading).toBe(false);
        });

        it('getPendingPayments normalizes legacy account fields from PendingPayments payload', async () => {
            mayaClient.get.mockResolvedValue({
                PendingPayments: [
                    {
                        PaymentID: '7',
                        BookingID: 'BK-0007',
                        Amount: '500',
                        BaseAmount: '1200',
                        PaymentApp: 'phonepe',
                        VoName: 'VO Name',
                        SoName: 'SO Name',
                        Account: {
                            account_number: '1234 5678',
                            ifsc_code: 'hdfc0001234',
                            mobile: ' 99999 88888 ',
                            fullName: 'Owner Legacy',
                            UpiID: ' owner@okhdfc ',
                        },
                    },
                ],
            });

            await store.dispatch('pendingPayments/getPendingPayments');

            const payment = store.state.pendingPayments.pendingPayments[0];
            expect(payment.PaymentId).toBe(7);
            expect(payment.BookingId).toBe('BK-0007');
            expect(payment.Amount).toBe(500);
            expect(payment.BaseAmount).toBe(1200);
            expect(payment.PaymentApp).toBe(1);
            expect(payment.PaymentAppLabel).toBe('PhonePe');
            expect(payment.PaymentDetails).toBe('1234 5678/HDFC0001234');
            expect(payment.Account.FullName).toBe('Owner Legacy');
            expect(payment.Account.UpiId).toBe('owner@okhdfc');
            expect(payment.Account.UpiID).toBe('owner@okhdfc');
            expect(payment.Account.Mobile).toBe('9999988888');
            expect(payment.Account.BankAccountNumber).toBe('1234 5678');
            expect(payment.Account.account_number).toBe('1234 5678');
            expect(payment.Account.IfscCode).toBe('HDFC0001234');
            expect(payment.Account.ifsc_code).toBe('HDFC0001234');
        });

        it('getPendingPayments supports Data payload and resolves mobile payment details', async () => {
            mayaClient.get.mockResolvedValue({
                Data: [
                    {
                        PaymentId: 9,
                        BookingId: 'BK-0009',
                        Account: {
                            Mobile: '8888877777',
                            paymentAppLabel: 'Custom Pay',
                            PaymentApp: 2,
                        },
                    },
                ],
            });

            await store.dispatch('pendingPayments/getPendingPayments');

            const payment = store.state.pendingPayments.pendingPayments[0];
            expect(payment.PaymentId).toBe(9);
            expect(payment.PaymentApp).toBe(2);
            expect(payment.PaymentAppLabel).toBe('Custom Pay');
            expect(payment.PaymentDetails).toBe('8888877777/Custom Pay');
        });

        it('getPendingPayments sets error state on API error response', async () => {
            mayaClient.get.mockResolvedValue({
                DisplayMsg: 'Failed',
                ErrorMsg: 'Backend error',
            });

            await store.dispatch('pendingPayments/getPendingPayments');

            expect(store.state.pendingPayments.hasError).toBe(true);
            expect(store.state.pendingPayments.errorMessage).toBe(
                'Failed ( Backend error )',
            );
        });

        it('updateAmountToSO posts normalized payload and removes success payment', async () => {
            store.state.pendingPayments.pendingPayments = [
                { PaymentId: 55, BookingId: 'BK-55' },
                { PaymentId: 66, BookingId: 'BK-66' },
            ];
            mayaClient.post.mockResolvedValue({ Success: true });

            await store.dispatch('pendingPayments/updateAmountToSO', {
                paymentId: '55',
                amountPaid: '321.45',
                paymentApp: 'google pay',
                TransferDate: '2026-04-04',
            });

            expect(mayaClient.post).toHaveBeenCalledWith(
                '/payment/amount-to-so',
                expect.objectContaining({
                    PaymentID: 55,
                    AmountToSO: 321.45,
                    PaymentApp: 2,
                    TransferDate: '2026-04-04',
                }),
            );
            expect(store.state.pendingPayments.pendingPayments).toEqual([
                { PaymentId: 66, BookingId: 'BK-66' },
            ]);
        });

        it('updateAmountToSO sets error and keeps data when API returns DisplayMsg', async () => {
            store.state.pendingPayments.pendingPayments = [
                { PaymentId: 77, BookingId: 'BK-77' },
            ];
            mayaClient.post.mockResolvedValue({
                DisplayMsg: 'Update failed',
                ErrorMsg: 'Validation',
            });

            const res = await store.dispatch('pendingPayments/updateAmountToSO', {
                PaymentID: 77,
                AmountToSO: 500,
                PaymentApp: 1,
            });

            expect(res).toEqual({
                DisplayMsg: 'Update failed',
                ErrorMsg: 'Validation',
            });
            expect(store.state.pendingPayments.hasError).toBe(true);
            expect(store.state.pendingPayments.errorMessage).toBe(
                'Update failed ( Validation )',
            );
            expect(store.state.pendingPayments.pendingPayments).toEqual([
                { PaymentId: 77, BookingId: 'BK-77' },
            ]);
        });
    });
});
