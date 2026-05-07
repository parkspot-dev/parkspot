import { flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createStore } from 'vuex';
import pendingPaymentsModule from '@/store/pendingPayments';
import { mayaClient } from '@/services/api';

vi.mock('@/services/api', () => ({
    mayaClient: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

describe('pendingPayments store', () => {
    let store;

    beforeEach(() => {
        vi.clearAllMocks();

        store = createStore({
            modules: {
                pendingPayments: {
                    ...pendingPaymentsModule,
                    state: { ...pendingPaymentsModule.state },
                },
            },
        });
    });

    describe('Behavior tests', () => {
        it('set-pending-payments stores items and clears the previous error state', () => {
            store.state.pendingPayments.hasError = true;
            store.state.pendingPayments.errorMessage = 'Old error';

            const payments = [
                {
                    PaymentId: 7,
                    BookingId: 'BK-7',
                },
            ];

            store.commit('pendingPayments/set-pending-payments', payments);

            expect(store.state.pendingPayments.pendingPayments).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        PaymentId: 7,
                        BookingId: 'BK-7',
                    }),
                ]),
            );
            expect(store.state.pendingPayments.hasError).toBe(false);
            expect(store.state.pendingPayments.errorMessage).toBe('');
        });

        it('record-payment-success removes an item by payment id', () => {
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

        it('record-payment-success removes an item by booking id when payment id is missing', () => {
            store.state.pendingPayments.pendingPayments = [
                { PaymentId: 101, BookingId: 'B101' },
                { PaymentId: 202, BookingId: 'B202' },
            ];

            store.commit('pendingPayments/record-payment-success', {
                bookingId: 'B101',
            });

            expect(store.state.pendingPayments.pendingPayments).toEqual([
                { PaymentId: 202, BookingId: 'B202' },
            ]);
        });

        it('getPendingPayments stores API data on success', async () => {
            mayaClient.get.mockResolvedValue([
                {
                    PaymentId: 7,
                    BookingId: 'BK-7',
                    Amount: '500',
                },
            ]);

            await store.dispatch('pendingPayments/getPendingPayments');
            await flushPromises();
            expect(mayaClient.get).toHaveBeenCalledTimes(1);
            expect(mayaClient.get).toHaveBeenCalledWith(
                '/internal/pending-payments',
            );
            expect(store.state.pendingPayments.pendingPayments).toEqual([
                expect.objectContaining({
                    PaymentId: 7,
                    BookingId: 'BK-7',
                    Amount: '500',
                }),
            ]);
            expect(store.state.pendingPayments.hasError).toBe(false);
            expect(store.state.pendingPayments.errorMessage).toBe('');
            expect(store.state.pendingPayments.isLoading).toBe(false);
        });

        it('getPendingPayments falls back to an empty array when the API returns null', async () => {
            mayaClient.get.mockResolvedValue(null);
            await store.dispatch('pendingPayments/getPendingPayments');
            await flushPromises();
            expect(store.state.pendingPayments.pendingPayments).toEqual([]);
            expect(store.state.pendingPayments.hasError).toBe(false);
            expect(store.state.pendingPayments.errorMessage).toBe('');
        });

        it('getPendingPayments toggles loading around an active request', async () => {
            let resolveRequest;
            mayaClient.get.mockReturnValue(
                new Promise((resolve) => {
                    resolveRequest = resolve;
                }),
            );

            const actionPromise = store.dispatch(
                'pendingPayments/getPendingPayments',
            );

            await flushPromises();
            expect(store.state.pendingPayments.isLoading).toBe(true);
            resolveRequest([]);
            await actionPromise;
            await flushPromises();
            expect(store.state.pendingPayments.isLoading).toBe(false);
        });

        it('getPendingPayments stores a formatted API error with ErrorMsg', async () => {
            mayaClient.get.mockResolvedValue({
                DisplayMsg: 'Failed',
                ErrorMsg: 'Error',
            });

            await store.dispatch('pendingPayments/getPendingPayments');
            await flushPromises();
            expect(store.state.pendingPayments.hasError).toBe(true);
            expect(store.state.pendingPayments.errorMessage).toBe(
                'Failed ( Error )',
            );
            expect(store.state.pendingPayments.isLoading).toBe(false);
        });

        it('getPendingPayments stores a formatted API error without ErrorMsg', async () => {
            mayaClient.get.mockResolvedValue({
                DisplayMsg: 'Failed',
            });

            await store.dispatch('pendingPayments/getPendingPayments');
            await flushPromises();
            expect(store.state.pendingPayments.hasError).toBe(true);
            expect(store.state.pendingPayments.errorMessage).toBe('Failed');
            expect(store.state.pendingPayments.isLoading).toBe(false);
        });

        it('getPendingPayments stores the fallback error message when the request fails', async () => {
            mayaClient.get.mockRejectedValue(new Error('Network error'));
            await store.dispatch('pendingPayments/getPendingPayments');
            await flushPromises();
            expect(store.state.pendingPayments.hasError).toBe(true);
            expect(store.state.pendingPayments.errorMessage).toBe(
                'Failed to fetch pending payments',
            );
            expect(store.state.pendingPayments.isLoading).toBe(false);
        });

        it('updateAmountToSO posts the exact success payload and removes the payment', async () => {
            store.state.pendingPayments.pendingPayments = [
                { PaymentId: 55, BookingId: 'BK-55' },
                { PaymentId: 66, BookingId: 'BK-66' },
            ];
            mayaClient.post.mockResolvedValue({ Success: true });

            await store.dispatch('pendingPayments/updateAmountToSO', {
                PaymentID: 55,
                AmountToSO: 300,
                bookingId: 'BK-55',
            });

            await flushPromises();
            expect(mayaClient.post).toHaveBeenCalledWith(
                '/payment/amount-to-so',
                expect.objectContaining({
                    PaymentID: 55,
                    AmountToSO: 300,
                }),
            );
            expect(store.state.pendingPayments.pendingPayments).toEqual([
                { PaymentId: 66, BookingId: 'BK-66' },
            ]);
            expect(store.state.pendingPayments.hasError).toBe(false);
            expect(store.state.pendingPayments.errorMessage).toBe('');
            expect(store.state.pendingPayments.isLoading).toBe(false);
        });

        it('updateAmountToSO includes TransferDate when provided', async () => {
            mayaClient.post.mockResolvedValue({ Success: true });
            await store.dispatch('pendingPayments/updateAmountToSO', {
                PaymentID: 55,
                AmountToSO: 300,
                TransferDate: '2026-04-21',
            });

            await flushPromises();

            expect(mayaClient.post).toHaveBeenCalledWith(
                '/payment/amount-to-so',
                expect.objectContaining({
                    PaymentID: 55,
                    AmountToSO: 300,
                    TransferDate: '2026-04-21',
                }),
            );
        });

        it('updateAmountToSO toggles loading around an active request', async () => {
            let resolveRequest;

            mayaClient.post.mockReturnValue(
                new Promise((resolve) => {
                    resolveRequest = resolve;
                }),
            );

            const actionPromise = store.dispatch(
                'pendingPayments/updateAmountToSO',
                {
                    PaymentID: 55,
                    AmountToSO: 300,
                },
            );

            await flushPromises();

            expect(store.state.pendingPayments.isLoading).toBe(true);
            resolveRequest({ Success: true });
            await actionPromise;
            await flushPromises();
            expect(store.state.pendingPayments.isLoading).toBe(false);
        });

        it('updateAmountToSO stores a formatted API error with ErrorMsg', async () => {
            mayaClient.post.mockResolvedValue({
                DisplayMsg: 'Failed',
                ErrorMsg: 'Error',
            });

            await store.dispatch('pendingPayments/updateAmountToSO', {
                PaymentID: 1,
                AmountToSO: 300,
            });

            await flushPromises();

            expect(mayaClient.post).toHaveBeenCalledWith(
                '/payment/amount-to-so',
                expect.objectContaining({
                    PaymentID: 1,
                    AmountToSO: 300,
                }),
            );
            expect(store.state.pendingPayments.hasError).toBe(true);
            expect(store.state.pendingPayments.errorMessage).toBe(
                'Failed ( Error )',
            );
            expect(store.state.pendingPayments.isLoading).toBe(false);
        });

        it('updateAmountToSO stores a formatted API error without ErrorMsg', async () => {
            mayaClient.post.mockResolvedValue({
                DisplayMsg: 'Failed',
            });

            await store.dispatch('pendingPayments/updateAmountToSO', {
                PaymentID: 1,
                AmountToSO: 300,
            });

            await flushPromises();

            expect(store.state.pendingPayments.hasError).toBe(true);
            expect(store.state.pendingPayments.errorMessage).toBe('Failed');
            expect(store.state.pendingPayments.isLoading).toBe(false);
        });

        it('updateAmountToSO stores the fallback error message when the request rejects without a message', async () => {
            mayaClient.post.mockRejectedValue(new Error());

            await store.dispatch('pendingPayments/updateAmountToSO', {
                PaymentID: 1,
                AmountToSO: 300,
            });

            await flushPromises();

            expect(store.state.pendingPayments.hasError).toBe(true);
            expect(store.state.pendingPayments.errorMessage).toBe(
                'Failed to update payment',
            );
            expect(store.state.pendingPayments.isLoading).toBe(false);
        });

        it('updateAmountToSO stores the rejected API error message when one is available', async () => {
            mayaClient.post.mockRejectedValue(new Error('Transfer failed'));

            await store.dispatch('pendingPayments/updateAmountToSO', {
                PaymentID: 1,
                AmountToSO: 300,
            });

            await flushPromises();

            expect(store.state.pendingPayments.hasError).toBe(true);
            expect(store.state.pendingPayments.errorMessage).toBe(
                'Transfer failed',
            );
            expect(store.state.pendingPayments.isLoading).toBe(false);
        });

        it('updateAmountToSO validates a missing PaymentID', async () => {
            await store.dispatch('pendingPayments/updateAmountToSO', {
                AmountToSO: 300,
            });

            await flushPromises();

            expect(mayaClient.post).not.toHaveBeenCalled();
            expect(store.state.pendingPayments.hasError).toBe(true);
            expect(store.state.pendingPayments.errorMessage).toBe(
                'PaymentID is required',
            );
            expect(store.state.pendingPayments.isLoading).toBe(false);
        });

        it('updateAmountToSO validates a missing AmountToSO', async () => {
            await store.dispatch('pendingPayments/updateAmountToSO', {
                PaymentID: 1,
            });

            await flushPromises();

            expect(mayaClient.post).not.toHaveBeenCalled();
            expect(store.state.pendingPayments.hasError).toBe(true);
            expect(store.state.pendingPayments.errorMessage).toBe(
                'AmountToSO is required',
            );
            expect(store.state.pendingPayments.isLoading).toBe(false);
        });

        it('updateAmountToSO keeps pending payments unchanged when the API does not confirm success', async () => {
            const payments = [
                { PaymentId: 55, BookingId: 'BK-55' },
                { PaymentId: 66, BookingId: 'BK-66' },
            ];

            store.commit('pendingPayments/set-pending-payments', payments);
            mayaClient.post.mockResolvedValue({ Success: false });

            const response = await store.dispatch(
                'pendingPayments/updateAmountToSO',
                {
                    PaymentID: 55,
                    AmountToSO: 300,
                },
            );

            await flushPromises();

            expect(response).toEqual({ Success: false });
            expect(mayaClient.post).toHaveBeenCalledWith(
                '/payment/amount-to-so',
                {
                    PaymentID: 55,
                    AmountToSO: 300,
                },
            );
            expect(store.state.pendingPayments.pendingPayments).toEqual(
                payments,
            );
            expect(store.state.pendingPayments.hasError).toBe(false);
            expect(store.state.pendingPayments.errorMessage).toBe('');
            expect(store.state.pendingPayments.isLoading).toBe(false);
        });

        it('updateAmountToSO converts string input to numeric API payload values', async () => {
            mayaClient.post.mockResolvedValue({ Success: true });

            await store.dispatch('pendingPayments/updateAmountToSO', {
                PaymentID: '233',
                AmountToSO: '250',
            });

            await flushPromises();

            expect(mayaClient.post).toHaveBeenCalledWith(
                '/payment/amount-to-so',
                {
                    PaymentID: 233,
                    AmountToSO: 250,
                },
            );
        });
    });
});
