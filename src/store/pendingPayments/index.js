import { mayaClient } from '@/services/api';

const state = {
    pendingPayments: [],
    hasError: false,
    errorMessage: '',
    isLoading: false,
};

const formatDisplayError = (res) => {
    const errorDetails = res?.ErrorMsg ? ` ( ${res.ErrorMsg} )` : '';
    return `${res.DisplayMsg}${errorDetails}`;
};

const mutations = {
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
        state.pendingPayments = state.pendingPayments.filter((p) => {
            if (payload.paymentId) {
                return p.PaymentId !== payload.paymentId;
            }
            return p.BookingId !== payload.bookingId;
        });
    },
};

const actions = {
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

        const reqBody = {
            PaymentID: Number(payload?.PaymentID || 0),
            AmountToSO: Number(payload?.AmountToSO || 0),
            PaymentApp: Number(payload?.PaymentApp || 0),
        };

        if (payload?.TransferDate) {
            reqBody.TransferDate = payload.TransferDate;
        }

        try {
            const res = await mayaClient.post('/payment/amount-to-so', reqBody);

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
        } catch {
            commit('set-error', 'Failed to update payment');
        } finally {
            commit('set-loading', false);
        }
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
