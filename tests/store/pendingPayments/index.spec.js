import { flushPromises } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createStore } from 'vuex';
import { mayaClient } from '@/services/api';

const isValidNumber = vi.fn((value) => {
    if (value === null || value === undefined || value === '') return false;
    return Number.isFinite(Number(value));
});

vi.mock('@/services/api', () => ({
    mayaClient: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

const formatDisplayError = (res) => {
    const errorDetails = res?.ErrorMsg ? ` ( ${res.ErrorMsg} )` : '';
    return `${res.DisplayMsg}${errorDetails}`;
};

const pendingPayments = {
    namespaced: true,
    state: {
        pendingPayments: [],
        hasError: false,
        errorMessage: '',
        isLoading: false,
    },
    mutations: {
        'set-pending-payments'(state, pendingPayments) {
            state.pendingPayments = pendingPayments;
            state.hasError = false;
            state.errorMessage = '';
        },

        'set-error'(state, message) {
            state.hasError = true;
            state.errorMessage = message;
        },

        'set-loading'(state, value) {
            state.isLoading = value;
        },

        'record-payment-success'(state, payload) {
            state.pendingPayments = state.pendingPayments.filter((payment) => {
                if (payload.paymentId) {
                    return payment.PaymentId !== payload.paymentId;
                }

                return payment.BookingId !== payload.bookingId;
            });
        },
    },
    actions: {
        async getPendingPayments({ commit }) {
            commit('set-loading', true);

            try {
                const res = await mayaClient.get('/internal/pending-payments');

                if (res?.DisplayMsg) {
                    commit('set-error', formatDisplayError(res));
                    return;
                }

                commit('set-pending-payments', res || []);
            } catch {
                commit('set-error', 'Failed to fetch pending payments');
            } finally {
                commit('set-loading', false);
            }
        },

        async updateAmountToSO({ commit }, payload) {
            commit('set-loading', true);

            try {
                const paymentID = Number(payload?.PaymentID);
                if (!isValidNumber(payload?.PaymentID)) {
                    throw new Error('PaymentID is required');
                }

                const amountToSO = Number(payload?.AmountToSO);
                if (!isValidNumber(payload?.AmountToSO)) {
                    throw new Error('AmountToSO is required');
                }

                const reqBody = {
                    PaymentID: paymentID,
                    AmountToSO: amountToSO,
                };

                if (payload?.TransferDate) {
                    reqBody.TransferDate = payload.TransferDate;
                }

                const res = await mayaClient.post(
                    '/payment/amount-to-so',
                    reqBody,
                );

                if (res?.DisplayMsg) {
                    commit('set-error', formatDisplayError(res));
                    return res;
                }

                if (res?.Success) {
                    commit('record-payment-success', {
                        paymentId: reqBody.PaymentID,
                        bookingId: payload?.bookingId,
                    });
                }

                return res;
            } catch (error) {
                commit(
                    'set-error',
                    error.message || 'Failed to update payment',
                );
            } finally {
                commit('set-loading', false);
            }
        },
    },
};

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

        it('getPendingPayments sets loading true during request and false after', async () => {
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

            expect(mayaClient.get).toHaveBeenCalledTimes(1);
            expect(store.state.pendingPayments.isLoading).toBe(true);

            resolveRequest([]);

            await actionPromise;
            await flushPromises();

            expect(store.state.pendingPayments.isLoading).toBe(false);
        });

        it('getPendingPayments sets error from API response', async () => {
            mayaClient.get.mockResolvedValue({
                DisplayMsg: 'Failed',
                ErrorMsg: 'Error',
            });

            await store.dispatch('pendingPayments/getPendingPayments');
            await flushPromises();

            expect(mayaClient.get).toHaveBeenCalledTimes(1);
            expect(store.state.pendingPayments.hasError).toBe(true);
            expect(store.state.pendingPayments.errorMessage).toBe(
                'Failed ( Error )',
            );
            expect(store.state.pendingPayments.isLoading).toBe(false);
        });

        it('getPendingPayments does not append undefined when ErrorMsg is missing', async () => {
            mayaClient.get.mockResolvedValue({
                DisplayMsg: 'Failed',
            });

            await store.dispatch('pendingPayments/getPendingPayments');
            await flushPromises();

            expect(mayaClient.get).toHaveBeenCalledTimes(1);
            expect(store.state.pendingPayments.hasError).toBe(true);
            expect(store.state.pendingPayments.errorMessage).toBe('Failed');
            expect(store.state.pendingPayments.isLoading).toBe(false);
        });

        it('getPendingPayments handles API failure', async () => {
            mayaClient.get.mockRejectedValue(new Error('Network error'));

            await store.dispatch('pendingPayments/getPendingPayments');
            await flushPromises();

            expect(mayaClient.get).toHaveBeenCalledTimes(1);
            expect(store.state.pendingPayments.hasError).toBe(true);
            expect(store.state.pendingPayments.errorMessage).toBe(
                'Failed to fetch pending payments',
            );
            expect(store.state.pendingPayments.isLoading).toBe(false);
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
            await flushPromises();

            expect(mayaClient.post).toHaveBeenCalledTimes(1);
            expect(mayaClient.post).toHaveBeenCalledWith(
                '/payment/amount-to-so',
                expect.objectContaining({
                    PaymentID: 55,
                    AmountToSO: 300,
                }),
            );
            expect(store.state.pendingPayments.pendingPayments).toEqual([
                { PaymentId: 66 },
            ]);
            expect(store.state.pendingPayments.hasError).toBe(false);
            expect(store.state.pendingPayments.errorMessage).toBe('');
            expect(store.state.pendingPayments.isLoading).toBe(false);
        });

        it('updateAmountToSO includes transfer date in API payload', async () => {
            mayaClient.post.mockResolvedValue({ Success: true });

            await store.dispatch('pendingPayments/updateAmountToSO', {
                PaymentID: 55,
                AmountToSO: 300,
                TransferDate: '2026-04-21',
            });
            await flushPromises();

            expect(mayaClient.post).toHaveBeenCalledTimes(1);
            expect(mayaClient.post).toHaveBeenCalledWith(
                '/payment/amount-to-so',
                expect.objectContaining({
                    PaymentID: 55,
                    AmountToSO: 300,
                    TransferDate: '2026-04-21',
                }),
            );
        });

        it('updateAmountToSO sets loading true during request and false after', async () => {
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

            expect(mayaClient.post).toHaveBeenCalledTimes(1);
            expect(store.state.pendingPayments.isLoading).toBe(true);

            resolveRequest({ Success: true });

            await actionPromise;
            await flushPromises();

            expect(store.state.pendingPayments.isLoading).toBe(false);
        });

        it('updateAmountToSO handles API error response', async () => {
            mayaClient.post.mockResolvedValue({
                DisplayMsg: 'Failed',
                ErrorMsg: 'Error',
            });

            await store.dispatch('pendingPayments/updateAmountToSO', {
                PaymentID: 1,
                AmountToSO: 300,
                PaymentApp: 1,
            });
            await flushPromises();

            expect(mayaClient.post).toHaveBeenCalledTimes(1);
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

        it('updateAmountToSO does not append undefined when ErrorMsg is missing', async () => {
            mayaClient.post.mockResolvedValue({
                DisplayMsg: 'Failed',
            });

            await store.dispatch('pendingPayments/updateAmountToSO', {
                PaymentID: 1,
                AmountToSO: 300,
                PaymentApp: 1,
            });
            await flushPromises();

            expect(mayaClient.post).toHaveBeenCalledTimes(1);
            expect(store.state.pendingPayments.hasError).toBe(true);
            expect(store.state.pendingPayments.errorMessage).toBe('Failed');
            expect(store.state.pendingPayments.isLoading).toBe(false);
        });

        it('updateAmountToSO handles network failure', async () => {
            mayaClient.post.mockRejectedValue(new Error());

            await store.dispatch('pendingPayments/updateAmountToSO', {
                PaymentID: 1,
                AmountToSO: 300,
                PaymentApp: 1,
            });
            await flushPromises();

            expect(mayaClient.post).toHaveBeenCalledTimes(1);
            expect(store.state.pendingPayments.hasError).toBe(true);
            expect(store.state.pendingPayments.errorMessage).toBe(
                'Failed to update payment',
            );
            expect(store.state.pendingPayments.isLoading).toBe(false);
        });

        it('updateAmountToSO validates missing PaymentID', async () => {
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

        it('updateAmountToSO validates invalid PaymentID', async () => {
            await store.dispatch('pendingPayments/updateAmountToSO', {
                PaymentID: 'abc',
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

        it('updateAmountToSO validates missing AmountToSO', async () => {
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

        it('updateAmountToSO validates invalid AmountToSO', async () => {
            await store.dispatch('pendingPayments/updateAmountToSO', {
                PaymentID: 1,
                AmountToSO: 'abc',
            });
            await flushPromises();

            expect(mayaClient.post).not.toHaveBeenCalled();
            expect(store.state.pendingPayments.hasError).toBe(true);
            expect(store.state.pendingPayments.errorMessage).toBe(
                'AmountToSO is required',
            );
            expect(store.state.pendingPayments.isLoading).toBe(false);
        });
    });
});
