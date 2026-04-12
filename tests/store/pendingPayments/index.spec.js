import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createStore } from 'vuex';
import pendingPayments from '@/store/pendingPayments';
import { mayaClient } from '@/services/api';

vi.mock('@/services/api', () => ({
    mayaClient: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

describe('PendingPayments Store', () => {
    let store;

    beforeEach(() => {
        vi.clearAllMocks();

        store = createStore({
            modules: {
                pendingPayments: {
                    ...pendingPayments,
                    state: { ...pendingPayments.state },
                },
            },
        });
    });

    describe('mutations', () => {
        it('record-payment-success removes by paymentId', () => {
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
                bookingId: 'B101',
            });

            expect(store.state.pendingPayments.pendingPayments).toEqual([
                { PaymentId: 202, BookingId: 'B202' },
            ]);
        });
    });

    describe('actions', () => {
        it('getPendingPayments success sets data', async () => {
            mayaClient.get.mockResolvedValue([
                {
                    PaymentId: 7,
                    BookingId: 'BK-7',
                    Amount: '500',
                },
            ]);

            await store.dispatch('pendingPayments/getPendingPayments');

            const payments = store.state.pendingPayments.pendingPayments;

            expect(payments).toHaveLength(1);
            expect(payments[0]).toEqual(
                expect.objectContaining({
                    PaymentId: 7,
                    BookingId: 'BK-7',
                    Amount: '500',
                }),
            );
        });

        it('getPendingPayments sets loading true → false', async () => {
            let resolveFn;

            mayaClient.get.mockReturnValue(
                new Promise((resolve) => {
                    resolveFn = resolve;
                }),
            );

            const promise = store.dispatch('pendingPayments/getPendingPayments');

            await Promise.resolve();

            expect(store.state.pendingPayments.isLoading).toBe(true);

            resolveFn([]);
            await promise;

            expect(store.state.pendingPayments.isLoading).toBe(false);
        });

        it('getPendingPayments sets error from API response', async () => {
            mayaClient.get.mockResolvedValue({
                DisplayMsg: 'Failed',
                ErrorMsg: 'Error',
            });

            await store.dispatch('pendingPayments/getPendingPayments');

            expect(store.state.pendingPayments.hasError).toBe(true);
            expect(store.state.pendingPayments.errorMessage).toContain('Failed');
        });

        it('getPendingPayments does not append undefined when ErrorMsg is missing', async () => {
            mayaClient.get.mockResolvedValue({
                DisplayMsg: 'Failed',
            });

            await store.dispatch('pendingPayments/getPendingPayments');

            expect(store.state.pendingPayments.hasError).toBe(true);
            expect(store.state.pendingPayments.errorMessage).toBe('Failed');
            expect(store.state.pendingPayments.errorMessage).not.toContain(
                'undefined',
            );
        });

        it('getPendingPayments handles API failure', async () => {
            mayaClient.get.mockRejectedValue(new Error('Network error'));

            await store.dispatch('pendingPayments/getPendingPayments');

            expect(store.state.pendingPayments.hasError).toBe(true);
            expect(store.state.pendingPayments.errorMessage).toBe(
                'Failed to fetch pending payments',
            );
        });

        it('updateAmountToSO sends correct payload and removes payment', async () => {
            store.state.pendingPayments.pendingPayments = [
                { PaymentId: 55 },
                { PaymentId: 66 },
            ];

            mayaClient.post.mockResolvedValue({ Success: true });

            await store.dispatch('pendingPayments/updateAmountToSO', {
                PaymentID: 55,
                AmountToSO: 300,
                PaymentApp: 1,
            });

            expect(mayaClient.post).toHaveBeenCalledWith(
                '/payment/amount-to-so',
                expect.objectContaining({
                    PaymentID: 55,
                    AmountToSO: 300,
                    PaymentApp: 1,
                }),
            );

            expect(store.state.pendingPayments.pendingPayments).toEqual([
                { PaymentId: 66 },
            ]);
        });

        it('updateAmountToSO handles API error response', async () => {
            mayaClient.post.mockResolvedValue({
                DisplayMsg: 'Failed',
                ErrorMsg: 'Error',
            });

            await store.dispatch('pendingPayments/updateAmountToSO', {
                PaymentID: 1,
            });

            expect(store.state.pendingPayments.hasError).toBe(true);
        });

        it('updateAmountToSO does not append undefined when ErrorMsg is missing', async () => {
            mayaClient.post.mockResolvedValue({
                DisplayMsg: 'Failed',
            });

            await store.dispatch('pendingPayments/updateAmountToSO', {
                PaymentID: 1,
            });

            expect(store.state.pendingPayments.hasError).toBe(true);
            expect(store.state.pendingPayments.errorMessage).toBe('Failed');
            expect(store.state.pendingPayments.errorMessage).not.toContain(
                'undefined',
            );
        });

        it('updateAmountToSO handles network failure', async () => {
            mayaClient.post.mockRejectedValue(new Error());

            await store.dispatch('pendingPayments/updateAmountToSO', {
                PaymentID: 1,
            });

            expect(store.state.pendingPayments.hasError).toBe(true);
            expect(store.state.pendingPayments.errorMessage).toBe(
                'Failed to update payment',
            );
        });
    });
});
